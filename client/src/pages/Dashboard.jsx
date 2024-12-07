import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios2 from "../axios2";
import { AuthContext } from "../context/authContext";
import { FaChevronDown } from "react-icons/fa";
import { WebSocketContext } from "../context/webSocketContext";
import { UtilContext } from "../context/utilContext";
import ConfirmModal from "../components/ConfirmModal";
import Loading from "../components/Loading";

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const { sessionInfo, connectionInfo, userDeviceInfo, clientDeviceInfo } =
    useContext(WebSocketContext);
  const { getDateTime } = useContext(UtilContext);

  //--------------------- Get Old Sessions ---------------------

  const [oldSessions, setOldSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchSessions = async () => {
      const userId = currentUser.user_id;
      try {
        const response = await axios2.get(
          `/history/get-sessions/${userId}/recent`
        );
        setOldSessions(response.data);
      } catch (error) {
        console.error(
          "Failed to get sessions",
          error.response ? error.response.data : error.message
        );
      }
      setLoading(false);
    };
    if (!hasFetched.current) {
      fetchSessions();
      hasFetched.current = true;
    }
  }, [currentUser.user_id]);

  //--------------------- Client Device Dropdown -----------------------

  const [infoDropDownVisible, setinfoDropDownVisible] = useState(true);
  const toggleInfoDropdown = () => {
    // toggle
    setinfoDropDownVisible((prev) => !prev);
  };

  // -------------------- Current session Dropdown

  const [currentSessionVisible, setcurrentSessionVisible] = useState(false);
  const currentRef = useRef(null);
  const toggleCurrentDropdown = () => {
    // scroll to view
    !currentSessionVisible &&
      setTimeout(() => {
        currentRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 10);
    // toggle
    setcurrentSessionVisible((prev) => !prev);
  };

  // ---------------------- Sessions Box Dropdown

  const [sessionsDropdownVisible, setSessionsDropdownVisible] = useState(
    sessionInfo ? false : true
  );
  const sessionsBoxRef = useRef(null);
  const toggleSessionsDropdown = () => {
    // scroll to view
    !sessionsDropdownVisible &&
      setTimeout(() => {
        sessionsBoxRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 10);
    // hide all sessions
    setSessionsVisible((prev) => {
      const updatedObject = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      return updatedObject;
    });
    // toggle
    setSessionsDropdownVisible((prev) => !prev);
  };

  // ---------------------- Session Item Dropdown

  const [sessionsVisible, setSessionsVisible] = useState({});
  const sessionRef = useRef(null);
  useEffect(() => {
    oldSessions.forEach((item) => {
      setSessionsVisible((prev) => ({
        ...prev,
        [item.client_id]: false,
      }));
    });
  }, [oldSessions]);
  const toggleSession = (clientId) => {
    // scroll to view
    !sessionsVisible[clientId] &&
      setTimeout(() => {
        sessionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 10);
    // toggle
    setSessionsVisible((prev) => ({
      ...prev,
      [clientId]: !prev[clientId],
    }));
  };

  //--------------------- Reconnect Old Session -----------------------

  const navigate = useNavigate();
  const [connectionCode, setConnectionCode] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const connectSession = (connectionCode) => {
    setConnectionCode(connectionCode);
    setModalMessage("Are you sure you want to open session?");
    setIsModalOpen(true);
  };
  const handleModalConfirm = () => {
    navigate("/dashboard/current-session", {
      state: { reconnectClient: connectionCode },
    });
    setConnectionCode(null);
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  //-------------------------------------------------------------------

  return (
    <main>
      <div className="container flex flex-col gap-8 py-8">
        {/* Welcome Message*/}
        <div className="flex justify-center gap-4 bg-white flex items-center">
          <h1 className="text-xl font-bold text-gray-400">
            <span className="font-normal"> Welcome,</span>
            <span className="text-dark-cta"> {currentUser.username}</span>
          </h1>
          <Link
            to="/dashboard/profile"
            className="text-light-cta hover:underline mt-auto"
          >
            view profile
          </Link>
        </div>
        {/* Client Device Info*/}
        {sessionInfo ? (
          <div className="flex-1 flex flex-col gap-4 shadow rounded p-4 px-8">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={toggleInfoDropdown}
            >
              <h2 className="text-lg text-dark-cta font-bold">
                Client Device Info:
              </h2>
              <FaChevronDown
                className="dropdown-icon text-light-cta"
                style={{
                  transform: infoDropDownVisible
                    ? "rotateX(180deg)"
                    : "rotateX(0deg)",
                }}
              />
            </div>
            {infoDropDownVisible && (
              <>
                {clientDeviceInfo ? (
                  <ul
                    className={`flex flex-col ps-4 gap-2 ${
                      (!connectionInfo.user.state ||
                        !connectionInfo.client.state) &&
                      "opacity-30"
                    }`}
                  >
                    {Object.entries(clientDeviceInfo).map(
                      ([key, value], index) => (
                        <li key={index} className="flex gap-2">
                          <div className="text-gray">{`${key}: `}</div>
                          <div className="text-dark-cta">{value}</div>
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <Loading />
                )}
                <hr />
                <div className="flex gap-2 justify-center">
                  <div className="text-gray">Connection:</div>
                  <div
                    className={`${
                      connectionInfo.user.state && connectionInfo.client.state
                        ? "text-light-cta"
                        : "text-red-500"
                    }`}
                  >
                    {connectionInfo.user.state && connectionInfo.client.state
                      ? "Devices Connected"
                      : "Connection Cut off"}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white p-8 rounded shadow">
            <div className="flex justify-between items-center cursor-pointer">
              <h2 className="text-lg text-dark-cta font-bold">
                Current Session:
              </h2>
            </div>
            <div className="text-gray ps-4 mt-2">No Current Session Open.</div>
          </div>
        )}
        {/* Current Session*/}
        <div className="flex-1 flex flex-col gap-4 shadow rounded p-4 px-8">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={toggleCurrentDropdown}
          >
            <h2 className="text-lg text-dark-cta font-bold">
              {sessionInfo ? "Session Info:" : "Your Device Info:"}
            </h2>
            <FaChevronDown
              className="dropdown-icon text-light-cta"
              style={{
                transform: currentSessionVisible
                  ? "rotateX(180deg)"
                  : "rotateX(0deg)",
              }}
            />
          </div>
          {currentSessionVisible && (
            <div ref={currentRef}>
              {sessionInfo && (
                <>
                  <ul className="flex flex-col gap-2 mb-3 ps-4">
                    {Object.entries(sessionInfo).map(
                      ([key, value], index) =>
                        key !== "status" &&
                        key !== "user_id" &&
                        key !== "end_time" && (
                          <li key={index} className="flex gap-2">
                            <div className="text-gray">{`${key}: `}</div>
                            <div className="text-dark-cta">
                              {key === "start_time"
                                ? getDateTime(value)
                                : value}
                            </div>
                          </li>
                        )
                    )}
                  </ul>{" "}
                  <hr></hr>
                </>
              )}
              {/* Technician Device Info */}
              {sessionInfo && (
                <div className="text-light-cta font-[500] mt-4">
                  Your Device Info:
                </div>
              )}
              {infoDropDownVisible && (
                <ul className="flex flex-col gap-2 my-2 ps-4">
                  {Object.entries(userDeviceInfo).map(([key, value], index) => (
                    <li key={index} className="flex gap-2">
                      <div className="text-gray">{`${key}: `}</div>
                      <div className="text-dark-cta">{value}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        {/* Check Connection */}
        {sessionInfo && (
          <div className="text-center">
            <Link
              to="/dashboard/current-session"
              className="w-1/2 md:w-1/3 m-auto secondery-button"
            >
              Check Connection
            </Link>
          </div>
        )}
        {/* Create Session */}
        {!sessionInfo && (
          <Link
            to="/dashboard/current-session"
            className="w-1/2 md:w-1/3 m-auto primary-button text-center"
          >
            Create Session
          </Link>
        )}
        {/* Old Sessions */}
        <div className="flex-1 flex flex-col shadow rounded p-4 px-8">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={toggleSessionsDropdown}
          >
            <p className="text-lg text-dark-cta font-bold">
              Recently Completed Sessions:
            </p>
            <FaChevronDown
              className="dropdown-icon text-light-cta"
              style={{
                transform: sessionsDropdownVisible
                  ? "rotateX(180deg)"
                  : "rotateX(0deg)",
              }}
            />
          </div>
          <div
            ref={sessionsBoxRef}
            className={`flex flex-col gap-1 ${
              sessionsDropdownVisible ? "mt-4" : ""
            }`}
          >
            {loading ? (
              <Loading />
            ) : (
              sessionsDropdownVisible &&
              (oldSessions.length > 0 ? (
                oldSessions.map((session, index) => (
                  <div key={index}>
                    <div
                      className="flex justify-between items-center
                      p-1 px-2 border border-white hover:border-[#40bf95] rounded cursor-pointer"
                      onClick={() => toggleSession(session.client_id)}
                    >
                      <div>
                        <span className="text-gray">Client:</span>
                        {` ${session.client_name}`}
                      </div>
                      <FaChevronDown
                        className="dropdown-icon text-light-cta text-xs"
                        style={{
                          transform: sessionsVisible[session.client_id]
                            ? "rotateX(180deg)"
                            : "rotateX(0deg)",
                        }}
                      />
                    </div>
                    {sessionsVisible[session.client_id] && (
                      <ul
                        ref={sessionRef}
                        key={index}
                        className="flex flex-col gap-1 justify-between 
                                    bg-[#fcfcfc] p-4 mb-4 rounded"
                      >
                        {Object.entries(session).map(
                          ([key, value], index) =>
                            key !== "client_name" && (
                              <li key={index} className="flex gap-2">
                                <div className="text-gray">{`${key}: `}</div>
                                <div className="text-dark-cta">
                                  {key === "start_time" || key === "end_time"
                                    ? key === "end_time" && session.status === 1
                                      ? "Opened"
                                      : getDateTime(value)
                                    : value}
                                </div>
                              </li>
                            )
                        )}
                        <div className="flex justify-center gap-4">
                          {!sessionInfo && (
                            <button
                              onClick={() =>
                                connectSession(session.session_connection_code)
                              }
                              className="secondery-button "
                            >
                              Connect
                            </button>
                          )}
                          <button
                            onClick={() =>
                              navigate(
                                `./history/session/${session.session_id}`
                              )
                            }
                            className="primary-button "
                          >
                            View Details
                          </button>
                        </div>
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-gray ps-4">
                  There is no previous sessions yet.
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        message={modalMessage}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
    </main>
  );
};

export default Dashboard;
