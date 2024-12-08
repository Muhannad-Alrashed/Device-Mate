import { createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import axios2 from "../axios2";
import { AuthContext } from "./authContext";

const socket = io(
    process.env.REACT_APP_API_URL           // Production
    || 'http://localhost:3001',             // Development
    { transports: ["websocket", "polling"] });

export const WebSocketContext = createContext();

export const WebSocketContextProvider = ({ children }) => {
    const [sessionInfo, setSessionInfo] = useState(
        JSON.parse(localStorage.getItem("session")) || null
    );
    const [connectionInfo, setConnectionInfo] = useState(
        JSON.parse(localStorage.getItem("connection")) || {
            user: { code: "", state: false },
            client: { code: "", state: false },
        }
    );

    // Ask for notification permission on page load
    useEffect(() => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    //---------------------------- Check Initial Values--------------------------------

    // Fetch connection info
    useEffect(() => {
        const currentConnection = JSON.parse(localStorage.getItem("connection"));
        if (currentConnection) {
            setConnectionInfo(currentConnection);
            if (currentConnection.user.state) {
                socket.emit("sender-join", { user_code: currentConnection.user.code });
            }
            if (currentConnection.client.state) {
                socket.emit("sender-join", { user_code: currentConnection.client.code });
            }
        } else {
            localStorage.setItem("connection", JSON.stringify({
                user: { code: "", state: false },
                client: { code: "", state: false }
            }));
        }
    }, []);

    // Fetch session info
    useEffect(() => {
        const {
            user: { code, state: userState },
            client: { state: clientState }
        } = connectionInfo;
        const getCurrentSession = async () => {
            try {
                const response = await axios2.get(`/conn/get-current/${code}`);
                setSessionInfo(response.data);
            } catch (error) {
                console.error(error.response ? error.response.data : error.message);
            }
        };
        if (code !== "" && userState && clientState)
            getCurrentSession();
    }, [connectionInfo, connectionInfo.client.state]);

    // Update local storage
    useEffect(() => {
        localStorage.setItem("connection", JSON.stringify(connectionInfo));
        if (sessionInfo) {
            localStorage.setItem("session", JSON.stringify(sessionInfo));
        } else {
            localStorage.removeItem("session");
        }
    }, [connectionInfo, sessionInfo]);

    //------------------------------- Get Devices Info -------------------------------

    const { currentUser } = useContext(AuthContext)
    const [clientDeviceInfo, setClientDeviceInfo] = useState(null);
    const [userDeviceInfo, setuserDeviceInfo] = useState({});

    useEffect(() => {
        // Get battery info
        let battery;
        const getBatteryInfo = async () => {
            if (navigator.getBattery) {
                try {
                    battery = await navigator.getBattery();
                    return battery;
                } catch (err) {
                    console.error("Battery information not available", err.message);
                    return null;
                }
            }
            return null;
        };
        // Get device Info
        const getDeviceInfo = async () => {
            const batteryInfo = await getBatteryInfo();
            const deviceInfo = {
                Device_Type: getDeviceType(),
                Platform: getPlatformInfo(),
                Operating_System: getOSVersion(),
                Network_Type: getNetworkType(),
                Battery_Level: batteryInfo ? `${(batteryInfo.level * 100).toFixed(0)}%` : "Unknown",
            };
            return deviceInfo;
        };
        // Save device info
        const fetchDeviceInfo = async () => {
            const info = await getDeviceInfo();
            if (currentUser) {
                setuserDeviceInfo(info);
            } else {
                setClientDeviceInfo(info);
            }
        };
        // Call functions and update
        fetchDeviceInfo();
        getBatteryInfo().then((bat) => {
            battery = bat;
            if (battery)
                battery.addEventListener("levelchange", fetchDeviceInfo);
        });
        // Clean up
        return () => {
            if (battery)
                battery.removeEventListener("levelchange", fetchDeviceInfo);
        };
    }, [currentUser, setuserDeviceInfo, setClientDeviceInfo]);

    //-----------------------------

    // Device type
    const getDeviceType = () => {
        const userAgent = navigator.userAgent;
        if (/mobile/i.test(userAgent)) {
            return "Mobile";
        } else if (/tablet/i.test(userAgent)) {
            return "Tablet";
        } else {
            return "Desktop";
        }
    };
    // Platform information
    const getPlatformInfo = () => {
        if (navigator.userAgentData) {
            return navigator.userAgentData.platform;
        }
        return "Platform not supported";
    };
    // Operating system
    const getOSVersion = () => {
        const userAgent = navigator.userAgent;
        const match = userAgent.match(
            /(Windows NT|Mac OS X|Android|CPU OS|Linux) ([\d_\\.]+)/
        );
        return match ? match[0].replace(/_/g, ".") : "Unknown";
    };
    // Network information
    const getNetworkType = () => {
        const connection =
            navigator.connection ||
            navigator.mozConnection ||
            navigator.webkitConnection;
        return connection ? connection.effectiveType : "Unknown";
    };

    //----------------------------- Update Client Device Info ----------------------------------

    // Send data
    useEffect(() => {
        if (!currentUser) {
            if (connectionInfo.user.state) {
                const sendDeviceInfo = () => {
                    socket.emit("send-client-device-info", {
                        device_info: clientDeviceInfo,
                        receiver_code: connectionInfo.user.code,
                    });
                };
                const interval = setInterval(() => {
                    sendDeviceInfo();
                }, 10000);
                return () => {
                    clearInterval(interval);
                };
            }
        }
    }, [clientDeviceInfo, connectionInfo, currentUser]);

    // Receive data
    useEffect(() => {
        if (currentUser) {
            const currentClientDevice = JSON.parse(localStorage.getItem("clientDevice"));
            if (currentClientDevice)
                setClientDeviceInfo(currentClientDevice);
        }
        const getClientDeviceInfo = (deviceInfo) => {
            setClientDeviceInfo(deviceInfo);
            localStorage.setItem("clientDevice", JSON.stringify(deviceInfo));
        };
        socket.on("get-client-device-info", getClientDeviceInfo);
        return () => {
            socket.off("get-client-device-info", getClientDeviceInfo);
        };
    }, [currentUser]);

    //----------------------------- Manage Connection ----------------------------------

    // Start Session
    const startSession = async (conData) => {
        const data = { ...conData, clientDeviceInfo }
        try {
            const response = await axios2.post("/conn/start-session", data);
            console.log(response.data.message);
            setSessionInfo(response.data.result)
            return "";
        } catch (error) {
            console.error(error.response ? error.response.data : error.message);
            return "Error saving connection info."
        }
    };

    // End session
    const endSession = async () => {
        try {
            const response = await axios2.post("/conn/end-session", sessionInfo);
            console.log(response.data);
            setSessionInfo(null);
        } catch (error) {
            console.error("Error ending connection: ",
                error.response ? error.response.data : error.message);
        }
    };

    // Check session code
    const isCodeExists = async (userCode) => {
        const userId = currentUser.user_id;
        try {
            const response = await axios2.get(`/conn/code-exist/${userCode}/${userId}`);
            return response.data.exists;
        } catch (error) {
            console.error('Error checking connection code, ', error.message);
        }
    };

    // Check client name 
    const isClientExists = async (clientName) => {
        const userId = currentUser.user_id;
        try {
            const response = await axios2.get(`/conn/name-exist/${clientName}/${userId}`);
            return response.data.exists;
        } catch (error) {
            console.error('Error checking client name, ', error.message);
        }
    };

    // End connection coercively
    const killConnection = () => {
        socket.emit("end-socket", {
            sender_code: connectionInfo.user.code,
            receiver_code: connectionInfo.client.code,
        });
        endSession()
        setSessionInfo(null);
        setClientDeviceInfo(null);
        setConnectionInfo({
            user: { code: "", state: false },
            client: { code: "", state: false },
        });
    };

    //----------------------------------------------------------------------------------

    return (
        <WebSocketContext.Provider
            value={{
                socket, connectionInfo, setConnectionInfo,
                startSession, endSession, sessionInfo, setSessionInfo,
                isCodeExists, isClientExists,
                clientDeviceInfo, setClientDeviceInfo, userDeviceInfo, killConnection
            }}>
            {children}
        </WebSocketContext.Provider>
    );
};