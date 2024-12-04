import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios2 from "../axios2";
import { FaChevronLeft, FaChevronDown } from "react-icons/fa";
import { AuthContext } from "../context/authContext";
import { UtilContext } from "../context/utilContext";
import { WebSocketContext } from "../context/webSocketContext";
import { TransferContext } from "../context/transferContext";
import Popup from "../components/Popup";
import ConfirmModal from "../components/ConfirmModal";
import Loading from "../components/Loading";

const Session = () => {
  const { sessionId } = useParams(); // Get session id from URL
  const { currentUser } = useContext(AuthContext);
  const { triggerAction, getDateTime } = useContext(UtilContext);
  const { sessionInfo, killConnection } = useContext(WebSocketContext);
  const { clearTransferData } = useContext(TransferContext);

  //----------------------- Fetch session details -------------------------

  const [sessionDetails, setSessionDetails] = useState(null);
  const [sessionVisible, setSessionVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleSessionVisible = () => {
    setSessionVisible((prev) => !prev);
  };

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const response = await axios2.get(
          `/server/history/get-session/${sessionId}`
        );
        setSessionDetails(response.data);
      } catch (error) {
        console.error(
          "Error fetching session Info.",
          error.response ? error.response.data : error.message
        );
      }
      setLoading(false);
    };
    fetchSessionDetails();
  }, [sessionId]);

  //----------------------- Fetch device info -------------------------

  const [clientDeviceInfo, setClientDeviceInfo] = useState({});
  const [deviceInfoVisible, setDeviceInfoVisible] = useState(true);

  const toggleDeviceInfoVisible = () => {
    setDeviceInfoVisible((prev) => !prev);
  };

  useEffect(() => {
    const fetchSessionDetails = async () => {
      const clientId = sessionDetails.client_id;
      try {
        const response = await axios2.get(
          `/server/history/get-device-info/${clientId}`
        );
        setClientDeviceInfo(response.data);
      } catch (error) {
        console.error(
          "Error fetching device Info.",
          error.response ? error.response.data : error.message
        );
      }
    };
    sessionDetails && fetchSessionDetails();
  }, [sessionDetails, sessionId]);

  //----------------------- Fetch files -------------------------

  const [transferredFiles, setTransferredFiles] = useState([]);

  useEffect(() => {
    const fetchTransferedFiles = async () => {
      try {
        const response = await axios2.get(
          `/server/history/get-files/${sessionId}`
        );
        setTransferredFiles(response.data);
      } catch (error) {
        console.error(
          "Error fetching files.",
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchTransferedFiles();
  }, [sessionId]);

  //------------------------- Files Box Dropdown -----------------------

  const [filesVisible, setFilesVisible] = useState(false);
  const FilesBoxRef = useRef(null);

  const toggleTransferedFiles = () => {
    // scroll to view
    !fileDropdown[transferId] &&
      setTimeout(() => {
        FilesBoxRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 10);
    // hide all files
    setFileDropdown((prev) => {
      const updatedObject = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      return updatedObject;
    });
    // toggle
    setFilesVisible((prev) => !prev);
  };

  //-------------------------  File Item Dropdown -----------------------

  const [fileDropdown, setFileDropdown] = useState({});
  const FileRef = useRef(null);

  useEffect(() => {
    transferredFiles.map((item) =>
      setFileDropdown((prev) => ({ ...prev, [item.transfer_id]: false }))
    );
  }, [transferredFiles]);

  const toggleFileDropdown = (transferId) => {
    // scroll to view
    !fileDropdown[transferId] &&
      setTimeout(() => {
        FileRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 10);
    // toggle
    setFileDropdown((prev) => ({ ...prev, [transferId]: !prev[transferId] }));
  };

  // ---------------------- Navigate To Chat ----------------------------

  const Navigate = useNavigate();

  const openConversation = () => {
    triggerAction("open-chat", sessionDetails.client_id);
    Navigate("/dashboard/chat");
  };

  // ---------------------- Confirm Modal ----------------------------

  const [popupData, setPopupData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [transferId, setTransferId] = useState(null);

  const handleModalConfirm = () => {
    switch (modalMessage) {
      case "Are you sure you want to clear this file?":
        handleDeleteFile();
        break;
      case "Are you sure you want to delete this session?":
        handleDeleteSession();
        break;
      case "Are you sure you want to open session?":
        handleConnectSession();
        break;
      default:
    }
  };

  // ---------------------- Delete File ----------------------------

  const deleteFile = async (transferId) => {
    setModalMessage("Are you sure you want to clear this file?");
    setIsModalOpen(true);
    setTransferId(transferId);
  };

  const handleDeleteFile = async () => {
    try {
      const response = await axios2.delete(
        `/server/history/delete-file/${transferId}`
      );
      setPopupData({
        title: "Success",
        description: response.data,
      });
      setTransferId(null);
      setIsModalOpen(false);
      setTransferredFiles((prev) =>
        prev.filter((item) => item.transfer_id !== transferId)
      );
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      setPopupData({
        title: "Error",
        description: "Deletion failed.",
      });
      setTransferId(null);
      setIsModalOpen(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  // ---------------------- Delete Session ----------------------------

  const [sessionDeleted, setSessionDeleted] = useState(false);

  const deleteSession = async () => {
    setModalMessage("Are you sure you want to delete this session?");
    setIsModalOpen(true);
  };

  // Handle delete file
  const handleDeleteSession = async () => {
    setIsModalOpen(false);
    const clientId = sessionDetails.client_id;
    try {
      const response = await axios2.delete(
        `/server/history/delete-session/${clientId}`
      );
      setSessionDeleted(true);
      // End connection if current session deleted
      // eslint-disable-next-line eqeqeq
      if (sessionInfo.session_id == sessionId) {
        killConnection();
        clearTransferData();
      }
      setPopupData({
        title: "Success",
        description: response.data,
      });
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      setPopupData({
        title: "Error",
        description: "Deletion failed.",
      });
    }
  };

  const closePopup = () => {
    setPopupData(null);
    if (sessionDeleted) Navigate("/dashboard/history");
  };

  //--------------------- Reconnect Old Session -----------------------

  const navigate = useNavigate();

  const connectSession = () => {
    setModalMessage("Are you sure you want to open session?");
    setIsModalOpen(true);
  };

  const handleConnectSession = () => {
    const connectionCode = sessionDetails.session_connection_code;
    navigate("/dashboard/current-session", {
      state: { reconnectClient: connectionCode },
    });
  };

  // ---------------------------------------------------------------------

  return (
    <main>
      {!sessionDeleted && (
        <div className="container flex flex-col justify-between pt-12 pb-8 min-h-[86vh]">
          {loading ? (
            <Loading label="loading session" />
          ) : !sessionDetails ? (
            <p className="text-gray text-lg text-center font-bold">
              No Session Found!
            </p>
          ) : (
            <>
              <div className="flex flex-col gap-8">
                <h1 className="text-2xl text-gray-400 font-bold ">
                  <Link to="/dashboard/history">
                    <FaChevronLeft
                      className="absolute -top-6 left-0 dropdown-icon text-light-cta
                text-lg cursor-pointer hover:-left-0.5 transition-all duration-100"
                    />
                  </Link>
                  Session Details.
                  <span className="text-dark-cta font-bold text-base m-4">
                    {sessionDetails.client_name}
                  </span>
                </h1>
                {/* Session Details*/}
                <div className="flex-1 flex flex-col gap-4 shadow rounded p-4 px-8">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={toggleSessionVisible}
                  >
                    <h2 className="text-lg text-dark-cta font-bold">
                      Session Info:
                    </h2>
                    <FaChevronDown
                      className="dropdown-icon text-light-cta"
                      style={{
                        transform: sessionVisible
                          ? "rotateX(180deg)"
                          : "rotateX(0deg)",
                      }}
                    />
                  </div>
                  {sessionVisible && (
                    <ul className="flex flex-col gap-2 ps-4">
                      {Object.entries(sessionDetails).map(
                        ([key, value], index) =>
                          key !== "status" &&
                          key !== "user_id" && (
                            <li key={index} className="flex gap-2">
                              <div className="text-gray">{`${key}: `}</div>
                              <div className="text-dark-cta">
                                {key === "start_time" || key === "end_time"
                                  ? value === null
                                    ? "Session is open"
                                    : getDateTime(value)
                                  : value}
                              </div>
                            </li>
                          )
                      )}
                    </ul>
                  )}
                </div>
                {/* Client Device Info*/}
                <div className="flex-1 flex flex-col gap-4 shadow rounded p-4 px-8">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={toggleDeviceInfoVisible}
                  >
                    <h2 className="text-lg text-dark-cta font-bold">
                      Client Device Info:
                    </h2>
                    <FaChevronDown
                      className="dropdown-icon text-light-cta"
                      style={{
                        transform: deviceInfoVisible
                          ? "rotateX(180deg)"
                          : "rotateX(0deg)",
                      }}
                    />
                  </div>
                  {deviceInfoVisible && (
                    <ul className="flex flex-col gap-2 ps-4">
                      {Object.entries(clientDeviceInfo).map(
                        ([key, value], index) =>
                          key !== "device_id" &&
                          key !== "client_id" && (
                            <li key={index} className="flex gap-2">
                              <div className="text-gray">{`${key}: `}</div>
                              <div className="text-dark-cta">{value}</div>
                            </li>
                          )
                      )}
                    </ul>
                  )}
                </div>
                {/* Transfered Files*/}
                <div
                  ref={FilesBoxRef}
                  className="flex-1 flex flex-col shadow rounded p-4 px-8"
                >
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={toggleTransferedFiles}
                  >
                    <p className="text-lg text-dark-cta font-bold">
                      Transferred Files:
                      <span className="text-base text-light-cta font-normal">
                        {` [${transferredFiles.length}]`}
                      </span>
                    </p>
                    <FaChevronDown
                      className="dropdown-icon text-light-cta"
                      style={{
                        transform: filesVisible
                          ? "rotateX(180deg)"
                          : "rotateX(0deg)",
                      }}
                    />
                  </div>
                  <ul
                    className={`flex flex-col gap-1 ${
                      filesVisible ? "mt-4" : ""
                    }`}
                  >
                    {filesVisible &&
                      (transferredFiles.length > 0 ? (
                        transferredFiles.map((file, fileIndex) => (
                          <li key={fileIndex}>
                            <div
                              className="flex justify-between items-center
                      p-1 px-2 border border-white hover:border-[#40bf95] rounded cursor-pointer"
                              onClick={() =>
                                toggleFileDropdown(file.transfer_id)
                              }
                            >
                              <div>
                                <span className="text-gray">
                                  Sender
                                  {file.sender_id === currentUser.user_id
                                    ? " (Technician), "
                                    : " (Client), "}
                                </span>
                                {file.file_name}
                              </div>
                              <FaChevronDown
                                className="dropdown-icon text-light-cta text-xs"
                                style={{
                                  transform: fileDropdown[file.transfer_id]
                                    ? "rotateX(180deg)"
                                    : "rotateX(0deg)",
                                }}
                              />
                            </div>
                            {fileDropdown[file.transfer_id] && (
                              <ul
                                ref={FileRef}
                                key={fileIndex}
                                className="flex flex-col gap-1 justify-between 
                                    bg-[#fcfcfc] p-4 mb-4 rounded"
                              >
                                {Object.entries(file).map(
                                  ([key, value], entryIndex) => (
                                    <li key={entryIndex} className="flex gap-2">
                                      <div className="text-gray">{`${key}: `}</div>
                                      <div className="text-dark-cta">
                                        {key === "transferred_at"
                                          ? getDateTime(value)
                                          : key === "file_size"
                                          ? `${value} kb`
                                          : value}
                                      </div>
                                    </li>
                                  )
                                )}
                                <button
                                  onClick={() => deleteFile(file.transfer_id)}
                                  className="self-end danger-button"
                                >
                                  delete file
                                </button>
                              </ul>
                            )}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray ps-4">
                          There is no transferred files yet.
                        </li>
                      ))}
                  </ul>
                </div>
                {/* View Chat */}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={openConversation}
                    className="secondery-button"
                  >
                    View Chat
                  </button>
                  {/* Connect Session */}
                  {!sessionInfo && (
                    <button onClick={connectSession} className="primary-button">
                      Connect Session
                    </button>
                  )}
                </div>
                {/* Delete Session */}
              </div>
              <div className="text-end">
                <button
                  onClick={deleteSession}
                  className="m-auto danger-button text-center"
                >
                  Delete Session
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {popupData && (
        <Popup
          title={popupData.title}
          description={popupData.description}
          close={closePopup}
        />
      )}
      <ConfirmModal
        isOpen={isModalOpen}
        message={modalMessage}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
    </main>
  );
};

export default Session;
