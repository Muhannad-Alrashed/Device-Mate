import React, { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { WebSocketContext } from "../context/webSocketContext";
import { TransferContext } from "../context/transferContext";
import { UtilContext } from "../context/utilContext";
import Popup from "../components/Popup";
import ConfirmModal from "../components/ConfirmModal";
import ConnectionStatus from "../components/ConnectionStatus";

const ConnectDevice = () => {
  const { action, setAction, triggerAction } = useContext(UtilContext);
  const { downloadFile, getDateTime, generateConnectionCode } =
    useContext(UtilContext);
  const {
    socket,
    connectionInfo,
    setConnectionInfo,
    clientDeviceInfo,
    setSessionInfo,
  } = useContext(WebSocketContext);
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
  const navigate = useNavigate();

  const handleModalConfirm = () => {
    setModalOpen(false);
    switch (modalMessage) {
      case "Are you sure you want to connect to session?":
        ConnectConfirm();
        break;
      case "Are you sure you want to End the connection":
        handleEndConfirm();
        break;
      case `Technician wants to import a file from your device.\n Confirm to proceed!`:
        HandleExportConfirm();
        break;
      case "Confirm to continue!":
        HandleExportConfirm();
        break;
      default:
        break;
    }
  };

  //-------------------Handle Connection ----------------------

  const userCodeRef = useRef();
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);

  const ConnectDevice = (e) => {
    e.preventDefault();
    setModalMessage("Are you sure you want to connect to session?");
    setModalOpen(true);
  };

  const ConnectConfirm = () => {
    const UserCode = userCodeRef.current.value;
    let clientCode = generateConnectionCode();

    while (clientCode === UserCode) {
      clientCode = generateConnectionCode();
    }
    socket.emit(
      "receiver-join",
      { user_code: UserCode, client_code: clientCode },
      function (response) {
        if (response.success) {
          setConnectionInfo((prev) => ({
            ...prev,
            user: { code: UserCode, state: true },
            client: { code: clientCode, state: true },
          }));
          setPopupData({
            title: "Success",
            description: "Your devices is now connected.",
          });
          socket.emit("send-client-device-info", {
            device_info: clientDeviceInfo,
            receiver_code: UserCode,
          });
        } else {
          setPopupData({
            title: "Error",
            description: response.message,
          });
        }
      }
    );
  };

  // Update State
  useEffect(() => {
    socket.on("sender-joined", (user_code) => {
      setConnectionInfo((prev) => ({
        ...prev,
        user: { code: user_code, state: true },
      }));
      setPopupData({
        title: "Success",
        description: "Technician Is Connected.",
      });
    });
    return () => {
      socket.off("sender-joined");
    };
  }, [setConnectionInfo, socket]);
  useEffect(() => {
    const cancelConnection = () => {
      setConnectionInfo((prev) => ({
        prev,
        client: { code: "", state: false },
      }));
    };
    socket.on("connection-canceled", cancelConnection);
    return () => {
      socket.off("connection-canceled", cancelConnection);
    };
  });

  //------------------- Handle End Connection ----------------------

  const handleEndConnection = () => {
    if (!connectionInfo.user.state || !connectionInfo.client.state) {
      handleEndConfirm();
      return;
    }
    setModalMessage("Are you sure you want to End the connection");
    setModalOpen(true);
  };

  const handleEndConfirm = () => {
    setModalOpen(false);
    socket.emit("end-socket", {
      sender_code: connectionInfo.client.code,
      receiver_code: connectionInfo.user.code,
    });
    if (connectionInfo.client.state) {
      if (!connectionInfo.user.state) {
        setConnectionInfo({
          user: { code: "", state: false },
          client: { code: "", state: false },
        });
        clearTransferData();
        setSessionInfo(null);
      }
      setPopupData({
        title: "Success",
        description: "Connection has been ended.",
      });
      setConnectionInfo((prev) => ({
        ...prev,
        client: { code: "", state: false },
      }));
    } else {
      setConnectionInfo({
        user: { code: "", state: false },
        client: { code: "", state: false },
      });
      clearTransferData();
      setSessionInfo(null);
    }
  };

  // Update state
  useEffect(() => {
    socket.on("socket-ended", () => {
      setPopupData({
        title: "Disconnection",
        description: "Connection ended. Technician exited the session",
      });
      setConnectionInfo((prev) => ({
        ...prev,
        user: { code: "", state: false },
      }));
    });
    return () => {
      socket.off("socket-ended");
    };
  }, [setConnectionInfo, socket]);

  const closePopup = () => {
    setPopupData(null);
  };

  //--------------------- Handle Transfer Dropdowns --------------------

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
    socket.off("im-file-share");
    socket.off("ex-file-share");
    console.error(error);
    setPopupData({
      title: "Error",
      description: message,
    });
    setIsTransferring({ export: false, import: false });
  };

  //--------------------- Handle Cancel Transfer --------------------

  const handleModalCancel = () => {
    if (
      modalMessage ===
      "Technician wants to import a file from your device.\n Confirm to proceed!"
    )
      socket.emit("cancel-export");
    setModalOpen(false);
  };

  useEffect(() => {
    socket.on("cancel-share", (item) => {
      socket.off("ex-meta-received");
      socket.off("ex-file-share");
      socket.off("im-file-share");
      if (item.list === "import")
        setExportedFilesList((prevList) =>
          prevList.filter((_, i) => i !== item.index)
        );
      else
        setImportedFilesList((prevList) =>
          prevList.filter((_, i) => i !== item.index)
        );
      setIsTransferring({ export: false, import: false });
    });
    return () => {
      socket.off("cancel-share");
    };
  }, [setExportedFilesList, setImportedFilesList, setIsTransferring, socket]);

  //------------------------- Export Files ------------------------

  // Trigger export
  // From chat
  useEffect(() => {
    if (action)
      if (action.name === "from-chat") {
        setModalMessage("Confirm to continue!");
        setModalOpen(true);
        setAction(null);
        triggerAction("close-modal", null);
      }
  }, [action, setAction, socket, triggerAction]);
  // From main
  useEffect(() => {
    socket.on("trigger-export", () => {
      setModalMessage(
        "Technician wants to import a file from your device.\n Confirm to proceed!"
      );
      setModalOpen(true);
    });
    return () => {
      socket.off("trigger-export");
    };
  }, [socket]);

  // Prepare export
  const HandleExportConfirm = () => {
    setModalOpen(false);
    pickerRef.current.click();
    if (pickerRef.current) pickerRef.current.value = "";
  };
  const HandleExportFile = (e) => {
    if (isTransferring.export || isTransferring.import) {
      setPopupData({
        title: "Wait...",
        description: "Wait until the current process finishes",
      });
      return;
    }
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
      socket.emit("im-send-meta", {
        receiver_code: connectionInfo.user.code,
        metadata: metadata,
      });
      // Handle chunk sharing
      socket.on("im-file-share", () => {
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
          socket.emit("im-share-chunk", {
            receiver_code: connectionInfo.user.code,
            file_chunk: chunk,
          });
        }
        // Complete
        if (buffer.length === 0) {
          setIsTransferring((prev) => ({ ...prev, export: false }));
          socket.off("im-file-share");
        }
      });
    } catch (error) {
      HandleError("Error during sending file content.", error.message);
    }
  };

  //------------------------- Import Files ------------------------

  // Receive metadata
  useEffect(() => {
    socket.off("ex-file-share");
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
        socket.emit("ex-file-start", { sender_code: connectionInfo.user.code });
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
            }
            setIsTransferring({ export: false, import: false });
            return { metadata: {}, transmitted: 0, buffer: [] };
          } else {
            // Request chunk
            socket.emit("ex-file-start", {
              sender_code: connectionInfo.user.code,
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
    socket.on("ex-meta-received", handleMetaReceived);
    socket.on("ex-file-share", handleFileShare);
    isDownloading = false;
    return () => {
      socket.off("ex-meta-received");
    };
  });

  //--------------------------------------------------------------------

  return (
    <main>
      <input
        ref={pickerRef}
        className="hidden"
        onChange={(e) => HandleExportFile(e)}
        type="file"
      />
      <div className="flex flex-col container connect-device gap-8 pb-16">
        <h1 className="text-xl text-gray text-center">Connect Device</h1>
        {!connectionInfo.client.state && !connectionInfo.user.state ? (
          <>
            {/* Create Connection */}
            <form
              className="flex flex-col my-4 gap-2"
              onSubmit={(e) => ConnectDevice(e)}
            >
              <p className="text-center text-light-cta mt-12">
                Enter Connection Code
              </p>
              <input
                required
                ref={userCodeRef}
                className="text-center text-xl w-4/5 sm:w-2/3 lg:w-1/2 m-auto text-gray font-bold tracking-widest
                  border-4 border-dashed py-2 rounded focus:outline-none focus:border-green-500"
                type="text"
                name="confirmation-code"
              />
              <button
                type="submit"
                className="w-1/2 md:w-1/3 m-auto primary-button mt-6"
              >
                Connect Device
              </button>
            </form>
          </>
        ) : (
          <>
            {/* Display Connection Status */}
            <div className="connection grid my-6 lg:gap-8">
              <ConnectionStatus connectionInfo={connectionInfo} />
              <button
                onClick={handleEndConnection}
                className="danger-button m-auto"
              >
                {connectionInfo.user.state && connectionInfo.client.state
                  ? "End Connection"
                  : "Leave Session"}
              </button>
            </div>
            {/* Chat Room */}
            <button
              className="self-end flex items-center w-[160px] secondery-button"
              onClick={() => {
                navigate("/client-chat");
              }}
            >
              <span className="flex-1 text-center">Open Chat</span>
              <FaChevronRight />
            </button>
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
                          <div>
                            <div className="whitespace-nowrap text-lg text-dark-cta">
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
                          <div>
                            <div className="whitespace-nowrap text-lg text-dark-cta">
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

export default ConnectDevice;
