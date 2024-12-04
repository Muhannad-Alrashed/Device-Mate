import React, { useState, useRef, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext.js";
import { WebSocketContext } from "../context/webSocketContext";
import { TransferContext } from "../context/transferContext";
import { UtilContext } from "../context/utilContext";
import { FaChevronDown } from "react-icons/fa";
import Popup from "../components/Popup";
import ConfirmModal from "../components/ConfirmModal";
import ConnectionStatus from "../components/ConnectionStatus";

const CurrentSession = () => {
  const { currentUser } = useContext(AuthContext);
  const {
    socket,
    connectionInfo,
    setConnectionInfo,
    sessionInfo,
    startSession,
    endSession,
    isCodeExists,
    isClientExists,
  } = useContext(WebSocketContext);
  const {
    downloadFile,
    getDateTime,
    generateConnectionCode,
    action,
    setAction,
  } = useContext(UtilContext);
  const {
    isTransferring,
    setIsTransferring,
    setSharedFile,
    exportedFilesList,
    setExportedFilesList,
    importedFilesList,
    setImportedFilesList,
    clearTransferData,
  } = useContext(TransferContext);

  const handleModalConfirm = () => {
    setModalOpen(false);
    switch (modalMessage) {
      case "Are you sure you want to End the session":
        handleEndConfirm();
        break;
      case "Proceed to Archive the session":
        handleEndConfirm();
        break;
      default:
        break;
    }
  };

  //--------------------- Reconnect Old Session -----------------------

  const location = useLocation();

  useEffect(() => {
    if (location.state?.reconnectClient) {
      ConnectUser(location.state.reconnectClient);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //-------------------Handle Create Connection ----------------------

  const UserCodeRef = useRef();
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [clientName, setClientName] = useState(null);
  const clientNameRef = useRef(null);

  const HandleUserCode = async (e) => {
    let userCode;
    e.preventDefault();
    const triggerId = e.target.id;
    switch (triggerId) {
      case "create-new":
        if (await isClientExists(clientNameRef.current.value)) {
          setPopupData({
            title: "Error",
            description: "Change client name. This name is used before.",
          });
          return;
        }
        setClientName(clientNameRef.current.value);
        do {
          userCode = generateConnectionCode();
        } while (await isCodeExists(userCode));
        break;
      case "open-old":
        userCode = UserCodeRef.current.value;
        if (!(await isCodeExists(userCode))) {
          setPopupData({
            title: "Error",
            description: "There is no old session with this connection code.",
          });
          return;
        }
        break;
      case "reconnect":
        userCode = connectionInfo.user.code;
        break;
      default:
    }
    ConnectUser(userCode);
  };

  const ConnectUser = (userCode) => {
    socket.emit("sender-join", {
      user_code: userCode,
      client_code: connectionInfo.client.code,
    });
    setConnectionInfo((prev) => ({
      ...prev,
      user: { code: userCode, state: true },
    }));
    setPopupData({
      title: "Success",
      description: `${
        connectionInfo.client.state
          ? "You have reconnected seccessfully"
          : "Session created seccessfully."
      }`,
    });
  };

  // Update State
  socket.off("receiver-joined");
  socket.on("receiver-joined", async (clientCode) => {
    setClientName(null);
    const apiData = {
      user: {
        code: connectionInfo.user.code,
        state: true,
        id: currentUser.user_id,
      },
      client: {
        code: clientCode,
        state: true,
        name: clientName,
      },
    };
    const response = await startSession(apiData);
    console.log(response);
    if (response !== "") {
      // Error saving connection data
      setConnectionInfo((prev) => ({
        prev,
        user: { code: "", state: false },
      }));
      setPopupData({
        title: "Error",
        description: response,
      });
      socket.emit("cancel-connection", clientCode);
      return;
    }
    setConnectionInfo((prev) => ({
      ...prev,
      client: { code: clientCode, state: true },
    }));
    setPopupData({
      title: "Success",
      description: "Client Is Connected.",
    });
  });

  //----------------- Handle End Connection ------------------

  const handleEndConnection = () => {
    setModalMessage(
      connectionInfo.user.state && connectionInfo.user.state
        ? "Are you sure you want to End the session"
        : "Proceed to Archive the session"
    );
    setModalOpen(true);
  };

  const handleEndConfirm = () => {
    setModalOpen(false);
    socket.emit("end-socket", {
      sender_code: connectionInfo.user.code,
      receiver_code: connectionInfo.client.code,
    });
    if (connectionInfo.user.state) {
      if (!connectionInfo.client.state) {
        endSession();
        setConnectionInfo((prev) => ({
          ...prev,
          user: { code: "", state: false },
        }));
        clearTransferData();
      }
      setConnectionInfo((prev) => ({
        ...prev,
        user: { ...prev.user, state: false },
      }));
      setPopupData({
        title: "Success",
        description: "Connection is cut off.",
      });
    } else {
      setConnectionInfo({
        user: { code: "", state: false },
        client: { code: "", state: false },
      });
      clearTransferData();
      endSession();
    }
  };

  // Update state
  useEffect(() => {
    socket.on("socket-ended", () => {
      setPopupData({
        title: "Disconnection",
        description: "Connection ended. Client exited the session",
      });
      setConnectionInfo((prev) => ({
        ...prev,
        client: { code: "", state: false },
      }));
    });
    return () => {
      socket.off("socket-ended");
    };
  }, [setConnectionInfo, socket]);

  const handleModalCancel = () => {
    setModalOpen(false);
  };

  const closePopup = () => {
    setPopupData(null);
  };

  //----------------- Handle Transfer Dropdowns ------------------

  const [exportDropdownVisible, setExportDropdownVisible] = useState(false);
  const [importDropdownVisible, setImportDropdownVisible] = useState(false);
  const pickerRef = useRef();

  const toggleExportDropdown = () => {
    setExportDropdownVisible((prev) => !prev);
  };
  const toggleImportDropdown = () => {
    setImportDropdownVisible((prev) => !prev);
  };

  useEffect(() => {
    if (isTransferring.export) {
      setExportDropdownVisible(true);
      setImportDropdownVisible(false);
    }
    if (isTransferring.import) {
      setExportDropdownVisible(false);
      setImportDropdownVisible(true);
    }
  }, [isTransferring]);

  const HandleError = (error, message) => {
    socket.off("ex-file-share");
    socket.off("im-file-share");
    console.error(error);
    setPopupData({
      title: "Error",
      description: message,
    });
    setIsTransferring({ export: false, import: false });
  };

  //----------------- Handle Cancel Transfer ------------------

  const cancelTransfer = (index, list) => {
    socket.emit("cancel-share", {
      receiver_code: connectionInfo.client.code,
      item: { index: index, list: list },
    });
    socket.off("im-meta-received");
    socket.off("im-file-share");
    socket.off("ex-file-share");
    if (list === "export")
      setExportedFilesList((prevList) =>
        prevList.filter((_, i) => i !== index)
      );
    else
      setImportedFilesList((prevList) =>
        prevList.filter((_, i) => i !== index)
      );
    setIsTransferring({ export: false, import: false });
  };

  const saveFileToDB = async (metadata, id) => {
    try {
      const response = await axios.post(`/server/files/save/${id}`, {
        metadata,
        sessionInfo,
      });
      console.log("success.", response.data);
    } catch (error) {
      console.error(
        "failed to save file.",
        error.response ? error.response.data : error.message
      );
    }
  };

  //----------------------- Export File ------------------------

  // Trigger export
  useEffect(() => {
    if (action) {
      if (isTransferring.export || isTransferring.import) {
        setPopupData({
          title: "Wait...",
          description: "Wait until the current process finishes",
        });
        return;
      }
      if (action.name === "export") {
        setAction(null);
        pickerRef.current.click();
        if (pickerRef.current) pickerRef.current.value = "";
      } else if (action.name === "import") {
        setAction(null);
        RaiseImportRequest();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  // Prepare export
  const HandleExportFile = (e) => {
    socket.off("ex-file-share");
    let file = e.target.files[0];
    if (!file) return;
    setIsTransferring((prev) => ({ ...prev, export: true }));
    try {
      setExportDropdownVisible(true);
      const reader = new FileReader();
      reader.onload = () => {
        const buffer = new Uint8Array(reader.result);
        const newFileItem = { name: file.name, progress: 0 };
        setExportedFilesList((prevList) => [...prevList, newFileItem]);
        // Register export
        ShareFile(
          {
            filename: file.name,
            totalBufferSize: buffer.length,
            filetype: file.type,
            chunkSize: 1024,
          },
          buffer
        );
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      HandleError("Error sending file metadata.", error.message);
    }
  };

  // Send metadata
  const ShareFile = (metadata, buffer) => {
    try {
      socket.emit("ex-send-meta", {
        receiver_code: connectionInfo.client.code,
        metadata: metadata,
      });
      // Handle chunk sharing
      socket.on("ex-file-share", () => {
        const chunk = buffer.slice(0, metadata.chunkSize);
        buffer = buffer.slice(metadata.chunkSize, buffer.length);
        const progress = Math.trunc(
          ((metadata.totalBufferSize - buffer.length) /
            metadata.totalBufferSize) *
            100
        );
        // Update progress
        setExportedFilesList((prevList) => {
          if (prevList.length === 0) return prevList;
          return prevList.map((item, index) =>
            index === prevList.length - 1
              ? { ...item, progress: progress }
              : item
          );
        });
        // Send chunk
        if (chunk.length !== 0) {
          socket.emit("ex-share-chunk", {
            receiver_code: connectionInfo.client.code,
            file_chunk: chunk,
          });
        }
        // Complete
        if (buffer.length === 0) {
          setIsTransferring((prev) => ({ ...prev, export: false }));
          socket.off("ex-file-share");
          saveFileToDB(metadata, sessionInfo.user_id);
        }
      });
    } catch (error) {
      HandleError("Error during sending file content.", error.message);
    }
  };

  //----------------------- Import File -----------------------

  // Trigger import
  const RaiseImportRequest = () => {
    socket.emit("trigger-import", connectionInfo.client.code, (response) => {
      if (response.success) {
        setPopupData({
          title: "Success",
          description: "Export from client device requested successfully.",
        });
      } else {
        setPopupData({
          title: "Error",
          description: "Export request Failed.",
        });
      }
    });
  };
  useEffect(() => {
    socket.on("cancel-import", () => {
      setPopupData({
        title: "Notification",
        description: "Client declined export request.",
      });
    });
    return () => {
      socket.off("cancel-import");
    };
  }, [socket]);

  // Receive metadata
  useEffect(() => {
    socket.off("im-file-share");
    let isDownloading = false;
    const handleMetaReceived = (data) => {
      setIsTransferring((prev) => ({ ...prev, import: true }));
      try {
        setImportDropdownVisible(true);
        setSharedFile({
          metadata: data.metadata,
          transmitted: 0,
          buffer: [],
        });
        const newFileItem = { name: data.metadata.filename, progress: 0 };
        setImportedFilesList((prevList) => [...prevList, newFileItem]);
        // Request chunk
        socket.emit("im-file-start", {
          sender_code: connectionInfo.client.code,
        });
      } catch (error) {
        HandleError("Error receiving file metadata.", error.message);
      }
    };
    const handleFileShare = (chunk) => {
      try {
        setSharedFile((prev) => {
          const updatedTransmitted = prev.transmitted + chunk.byteLength;
          const updatedBuffer = [...prev.buffer, chunk];
          const progress = Math.trunc(
            (updatedTransmitted / prev.metadata.totalBufferSize) * 100
          );
          // Update progress
          setImportedFilesList((prevList) => {
            if (prevList.length === 0) return prevList;
            return prevList.map((item, index) =>
              index === prevList.length - 1
                ? { ...item, progress: progress }
                : item
            );
          });
          // Complete
          if (updatedTransmitted === prev.metadata.totalBufferSize) {
            if (!isDownloading) {
              isDownloading = true;
              downloadFile(updatedBuffer, prev.metadata.filename);
              saveFileToDB(prev.metadata, sessionInfo.client_id);
            }
            setIsTransferring({ export: false, import: false });
            return { metadata: {}, transmitted: 0, buffer: [] };
          } else {
            // Request chunk
            socket.emit("im-file-start", {
              sender_code: connectionInfo.client.code,
            });
          }
          return {
            ...prev,
            transmitted: updatedTransmitted,
            buffer: updatedBuffer,
          };
        });
      } catch (error) {
        HandleError("Error during receiving file content.", error.message);
      }
    };
    socket.on("im-meta-received", handleMetaReceived);
    socket.on("im-file-share", handleFileShare);
    isDownloading = false;
    return () => {
      socket.off("im-meta-received");
    };
  });

  //-------------------------------------------------------------

  return (
    <main>
      <input
        ref={pickerRef}
        className="hidden"
        onChange={(e) => HandleExportFile(e)}
        type="file"
      />
      <div className="grid container current-session gap-8 pt-8 pb-16">
        <h1 className="text-xl font-bold text-gray text-center">
          Current Session
        </h1>
        {!connectionInfo.client.state && !connectionInfo.user.state ? (
          <>
            {/* Create Connection */}
            <div className="grid my-6 gap-8">
              <div>
                <p className="text-center text-light-cta my-4">
                  Create A New Session
                </p>
                <form
                  id="create-new"
                  className="flex flex-col md:flex-row gap-4 sm:w-3/4 md:w-full lg:w-3/4 m-auto"
                  onSubmit={(e) => HandleUserCode(e)}
                >
                  <input
                    ref={clientNameRef}
                    placeholder="Name The New Client"
                    required
                    className="flex-1 text-center text-lg text-gray font-bold tracking-widest
                  border-4 border-dashed py-1 md:py-0 rounded focus:outline-none focus:border-green-500"
                    type="text"
                    name="client-name"
                  />
                  <button
                    className="w-1/2 md:w-1/3 m-auto primary-button"
                    type="submit"
                  >
                    Create Session
                  </button>
                </form>
              </div>
              <div>
                <p className="text-center text-light-cta my-4">
                  Or Reopen an Old Session
                </p>
                <form
                  id="open-old"
                  className="flex flex-col md:flex-row gap-4 sm:w-3/4 md:w-full lg:w-3/4 m-auto"
                  onSubmit={(e) => HandleUserCode(e)}
                >
                  <input
                    placeholder="Enter Connection Code"
                    required
                    ref={UserCodeRef}
                    className="flex-1 text-center text-lg text-gray font-bold tracking-widest
                  border-4 border-dashed py-1 md:py-0 rounded focus:outline-none focus:border-green-500"
                    type="text"
                    name="connection-code"
                  />
                  <button
                    className="w-1/2 md:w-1/3 m-auto secondery-button"
                    type="submit"
                  >
                    Reconnect Session
                  </button>
                </form>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Display Connection Status */}
            <div className="connection grid my-6 lg:gap-8">
              <ConnectionStatus connectionInfo={connectionInfo} />
              <div className="flex gap-2 justify-center">
                {connectionInfo.user.state ? (
                  <button
                    className="danger-button m-auto"
                    onClick={handleEndConnection}
                  >
                    {!connectionInfo.client.state
                      ? "Cancel Session"
                      : "Stop Connection"}
                  </button>
                ) : (
                  <>
                    <button
                      id="reconnect"
                      className="primary-button"
                      onClick={(e) => HandleUserCode(e)}
                    >
                      Reconnect Session
                    </button>
                    <button
                      className="secondery-button"
                      onClick={handleEndConnection}
                    >
                      Archive Session
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 lg:items-start">
              {/* Exported Files */}
              <div
                className="flex-1 border-2 border-dashed border-gray-100 rounded
                hover:border-[#40bf95] transition-all
              p-4 px-8"
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={toggleExportDropdown}
                >
                  <p className="text-lg text-gray">
                    Recent Exported Files:
                    <span className="text-[16px] text-light-cta text-bold">
                      {` [${exportedFilesList.length}].`}
                    </span>
                  </p>
                  <FaChevronDown
                    className="dropdown-icon text-light-cta"
                    style={{
                      transform: exportDropdownVisible
                        ? "rotateX(180deg)"
                        : "rotateX(0deg)",
                    }}
                  />
                </div>
                {exportDropdownVisible && (
                  <ul className="mt-4">
                    {exportedFilesList
                      .filter(
                        (item) => item.name && item.progress !== undefined
                      )
                      .map((item, index) => (
                        <li
                          key={index}
                          className="flex gap-3 justify-between items-end 
                          bg-light-gray-extra p-4 my-4 rounded"
                        >
                          <div className="flex-1 flex flex-col">
                            <div className="flex">
                              <div className="flex-1 text-dark-gray px-2">
                                {item.name}
                              </div>
                              <div className="text-gray text-sm">
                                {getDateTime()}
                              </div>
                            </div>
                            <div className="progress-container">
                              <div
                                className="progress-bar"
                                style={{ width: `${item.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <button
                              onClick={() => cancelTransfer(index, "export")}
                              className="px-2 text-red-500 bg-white hover:font-bold 
                                border-2 border-gray-100 rounded "
                            >
                              X
                            </button>
                            <div className="whitespace-nowrap text-lg text-dark-cta -my-1">
                              {item.progress !== 100
                                ? `${item.progress} %`
                                : "✔"}
                            </div>
                          </div>
                        </li>
                      ))
                      .reverse()}
                  </ul>
                )}
              </div>
              {/* Imported Files */}
              <div
                className="flex-1 border-2 border-dashed border-gray-100 rounded
                hover:border-[#40bf95] transition-all
              p-4 px-8"
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={toggleImportDropdown}
                >
                  <p className="text-lg text-gray">
                    Recent Imported Files:
                    <span className="text-[16px] text-light-cta text-bold">
                      {` [${importedFilesList.length}].`}
                    </span>
                  </p>
                  <FaChevronDown
                    className="dropdown-icon text-light-cta"
                    style={{
                      transform: importDropdownVisible
                        ? "rotateX(180deg)"
                        : "rotateX(0deg)",
                    }}
                  />
                </div>
                {importDropdownVisible && (
                  <ul className="mt-4">
                    {importedFilesList
                      .filter(
                        (item) => item.name && item.progress !== undefined
                      )
                      .map((item, index) => (
                        <li
                          key={index}
                          className="flex gap-3 justify-between items-end 
                          bg-light-gray-extra p-4 my-4 rounded"
                        >
                          <div className="flex-1 flex flex-col">
                            <div className="flex">
                              <div className="flex-1 text-dark-gray px-2">
                                {item.name}
                              </div>
                              <div className="text-gray text-sm">
                                {getDateTime()}
                              </div>
                            </div>
                            <div className="progress-container">
                              <div
                                className="progress-bar"
                                style={{ width: `${item.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <button
                              onClick={() => cancelTransfer(index, "import")}
                              className="px-2 text-red-500 bg-white hover:font-bold
                                border-2 border-gray-100 rounded "
                            >
                              X
                            </button>
                            <div className="whitespace-nowrap text-lg text-dark-cta -my-1">
                              {item.progress !== 100
                                ? `${item.progress} %`
                                : "✔"}
                            </div>
                          </div>
                        </li>
                      ))
                      .reverse()}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </div>
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

export default CurrentSession;
