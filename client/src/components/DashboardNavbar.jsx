import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios2 from "../axios2.js";
import { AuthContext } from "../context/authContext.js";
import { WebSocketContext } from "../context/webSocketContext.js";
import { TransferContext } from "../context/transferContext.js";
import { UtilContext } from "../context/utilContext.js";
import Popup from "./Popup.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import {
  FaDesktop,
  FaComment,
  FaSignOutAlt,
  FaChevronDown,
  FaHistory,
} from "react-icons/fa";
import {
  FaFileArrowDown,
  FaFileArrowUp,
  FaFileCircleMinus,
} from "react-icons/fa6";
import "../styles/navbars.css";

const DashboardNavbar = () => {
  //
  const { currentUser, logout } = useContext(AuthContext);
  const {
    socket,
    connectionInfo,
    setConnectionInfo,
    sessionInfo,
    startSession,
    clientName,
    killConnection,
  } = useContext(WebSocketContext);
  const { clearTransferData } = useContext(TransferContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [popupData, setPopupData] = useState(null);

  //---------------------------- Handle Basics ----------------------------

  // Indicator
  useEffect(() => {
    const updateIndicator = () => {
      const linkButtons = document.querySelectorAll("nav a");
      linkButtons.forEach((linkButton) => {
        const button_href = linkButton.getAttribute("href");
        if (location.pathname.endsWith(button_href)) {
          linkButton.classList.add("indicator");
        } else {
          linkButton.classList.remove("indicator");
        }
      });
    };
    updateIndicator();
  }, [location]);

  //  Logout
  const handleLogout = () => {
    logout();
    if (sessionInfo) {
      // Clear account connection
      killConnection();
      clearTransferData();
    }
    navigate("/login");
  };

  //---------------------------- Handle Join/Cut Connection ----------------------------

  // Join connection
  useEffect(() => {
    const handleJoinConnection = (client_code) => {
      setConnectionInfo((prev) => ({
        ...prev,
        client: { code: client_code, state: true },
      }));
      const apiData = {
        user: {
          code: connectionInfo.user.code,
          state: true,
          id: currentUser.user_id,
        },
        client: {
          code: client_code,
          state: true,
          name: clientName,
        },
      };
      startSession(apiData);
      setPopupData({
        title: "Success",
        description: "Client Is Connected.",
      });
    };
    if (!location.pathname.endsWith("/current-session")) {
      socket.on("receiver-joined", handleJoinConnection);
    }
    return () => {
      socket.off("receiver-joined", handleJoinConnection);
    };
  }, [
    clientName,
    connectionInfo,
    currentUser,
    location,
    setConnectionInfo,
    socket,
    startSession,
  ]);

  // Cut connection
  useEffect(() => {
    const handleCutConnection = () => {
      setPopupData({
        title: "Disconnection",
        description: "Connection ended. Client exited the session",
      });
      setConnectionInfo((prev) => ({
        ...prev,
        client: { code: "", state: false },
      }));
    };
    if (!location.pathname.endsWith("/current-session")) {
      socket.on("socket-ended", handleCutConnection);
    }
    return () => {
      socket.off("socket-ended", handleCutConnection);
    };
  }, [location, setConnectionInfo, socket]);

  const closePopup = () => {
    setPopupData(null);
  };

  //---------------------------- Handle Receive Message ----------------------------

  useEffect(() => {
    // Get sender name
    const fetchName = async (senderId) => {
      try {
        const response = await axios2.get(
          `/server/chat/get-name/${senderId}/client`
        );
        return response.data.name;
      } catch (error) {
        console.error(
          "Failed to get name.",
          error.response ? error.response.data : error.message
        );
        return null;
      }
    };

    // Display a notification
    const displayNotification = async (message) => {
      const senderName = await fetchName(message.sender_id);
      if (Notification.permission === "granted") {
        const notification = new Notification("DeviceMate: New Message", {
          body: `From: ${senderName}\nMessage: ${message.content}`,
        });
        notification.onclick = () => {
          navigate("/dashboard/chat");
        };
      }
    };

    // Receive message
    const handleReceiveMessage = (newMessage) => {
      if (location.pathname !== "/dashboard/chat") {
        displayNotification(newMessage);
      }
    };
    socket.on("receive-message", handleReceiveMessage);
    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [location, navigate, socket]);

  //---------------------------- Handle DropDown Menus ----------------------------
  //
  const [userDropdownVisible, setUserDropdownVisible] = useState(false);
  const [fileDropdownVisible, setFileDropdownVisible] = useState(false);

  const userDropdownRef = useRef();
  const fileDropdownRef = useRef();

  const toggleUserDropdown = () => {
    setUserDropdownVisible((prev) => !prev);
  };

  const toggleFileDropdown = () => {
    const targetPage = "/dashboard/current-session";
    if (location.pathname !== targetPage) {
      navigate(targetPage, { replace: true });
    }
    setFileDropdownVisible((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (
      userDropdownRef.current &&
      !userDropdownRef.current.contains(event.target)
    ) {
      setUserDropdownVisible(false);
    }
    if (
      fileDropdownRef.current &&
      !fileDropdownRef.current.contains(event.target)
    ) {
      setFileDropdownVisible(false);
    }
  };

  const hideAllDropdowns = () => {
    setUserDropdownVisible(false);
    setFileDropdownVisible(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  //------------------- Handle Export Files ------------------

  const { triggerAction } = useContext(UtilContext);

  const HandleExportFile = () => {
    hideAllDropdowns();
    if (connectionInfo.user.code !== "" && connectionInfo.client.code !== "") {
      triggerAction("export", null);
    } else {
      setPopupData({
        title: "Info",
        description: "You need to start a connection to proceed.",
      });
    }
  };

  //------------------- Handle Import Files ------------------

  const HandleImportFile = () => {
    hideAllDropdowns();
    if (connectionInfo.user.code === "" || connectionInfo.client.code === "") {
      setPopupData({
        title: "Info",
        description: "You need to start a connection to proceed.",
      });
    } else {
      triggerAction("import", null);
    }
  };

  //------------------------------------------------------------

  return (
    <div className="navbar-background navbar-position">
      <nav className="container dashboard-navbar">
        <div className="logo">
          <Link to="/dashboard">Dashboard</Link>
        </div>
        <ul className="nav-links">
          <div className="file-dropdown">
            <button onClick={toggleFileDropdown} className="file-dropbtn">
              <FaFileCircleMinus className="navbar-icon file-transfer" />
              <FaChevronDown
                className="file-arrow"
                style={{
                  transform: fileDropdownVisible
                    ? "rotateX(180deg)"
                    : "rotateX(0deg)",
                }}
              />
            </button>
            {fileDropdownVisible && (
              <div
                ref={fileDropdownRef}
                className="dropdown-content file-dropdown-content"
              >
                <button onClick={HandleExportFile}>
                  <FaFileArrowUp className="dropdown-icon file-download" />
                  <p className="flex-1">Export File To Device</p>
                </button>
                <hr className="mx-4 text-gray" />
                <button onClick={HandleImportFile}>
                  <FaFileArrowDown className="dropdown-icon file-download" />
                  <p className="flex-1">Import File From Device</p>
                </button>
              </div>
            )}
          </div>
          <Link to="/dashboard/current-session">
            <FaDesktop className="navbar-icon computer" />
          </Link>
          <Link to="/dashboard/chat">
            <FaComment className="navbar-icon chat" />
          </Link>
        </ul>
        <div className="uesr-dropdown">
          <button onClick={toggleUserDropdown} className="user-dropbtn">
            {currentUser ? (
              <>
                <img className="user-image" src="" alt="" />
                <span>{currentUser.username}</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon
                  icon={faUser}
                  className="navbar-icon profile"
                />
                <span>Loading...</span>
              </>
            )}
            <FaChevronDown
              className=" down-arrow"
              style={{
                transform: userDropdownVisible
                  ? "rotateX(180deg)"
                  : "rotateX(0deg)",
              }}
            />
          </button>
          {userDropdownVisible && (
            <div ref={userDropdownRef} className="dropdown-content">
              <Link to="/dashboard/profile" onClick={hideAllDropdowns}>
                <FontAwesomeIcon
                  icon={faUser}
                  className="dropdown-icon profile"
                />
                Profile
              </Link>
              <hr className="mx-4 text-gray" />
              <Link to="/dashboard/history" onClick={hideAllDropdowns}>
                <FaHistory className="dropdown-icon history" />
                History
              </Link>{" "}
              <Link to="/support" onClick={hideAllDropdowns}>
                <FontAwesomeIcon
                  icon={faCircleQuestion}
                  className="dropdown-icon history"
                />
                Help
              </Link>
              <hr className="mx-4 text-gray" />
              <button onClick={handleLogout}>
                <FaSignOutAlt className="logout dropdown-icon" />
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
      {popupData && (
        <Popup
          title={popupData.title}
          description={popupData.description}
          close={closePopup}
        />
      )}
    </div>
  );
};

export default DashboardNavbar;
