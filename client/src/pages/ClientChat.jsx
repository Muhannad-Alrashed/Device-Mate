import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import axios2 from "../axios2";
import "../styles/dashboard-pages.css";
import { WebSocketContext } from "../context/webSocketContext";
import { UtilContext } from "../context/utilContext";
import Popup from "../components/Popup";
import { FaArrowLeft } from "react-icons/fa";
import ContextMenu from "../components/ContextMenu.jsx";

const ChatPage = () => {
  const { socket, sessionInfo, connectionInfo } = useContext(WebSocketContext);
  const [chat, setChat] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const inputRef = useRef(null);

  const closePopup = () => {
    setPopupData(null);
  };

  //---------------------------- Load Current Chat -----------------------------

  // Load chat
  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const response = await axios2.get(
          `/server/chat/client-Id/${connectionInfo.user.code}`
        );
        return response.data;
      } catch (error) {
        console.error("Failed to load chat", error.message);
        return null;
      }
    };
    const loadChat = async (Id) => {
      try {
        const response = await axios2.get(`/server/chat/get-messages/${Id}`);
        setChat({ clientId: Id, messages: response.data });
      } catch (error) {
        console.error("Failed to load chat", error.message);
      }
    };
    const initializeChat = async () => {
      if (sessionInfo) {
        const clientId = await fetchClientId();
        if (sessionInfo.client_id === clientId) {
          loadChat(clientId);
        }
      }
    };
    initializeChat();
  }, [connectionInfo, sessionInfo]);

  //---------------------------- Handle Chating -----------------------------

  // Prepare message
  const handleSendMessage = async () => {
    if (!sessionInfo) return;
    try {
      const message = inputRef.current.value;
      if (message === "") return;
      const data = {
        senderId: sessionInfo.client_id,
        ...sessionInfo,
        message,
        repliedTo: repliedToMessage,
      };
      const response = await axios2.post("/server/chat/send-message", data);
      sendMessage(response.data.details);
    } catch (error) {
      console.error(
        "Failed to insert message.",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Send message
  const sendMessage = (newMessage) => {
    socket.emit("send-message", {
      new_message: newMessage,
      receiver_code: connectionInfo.user.code,
    });
    setChat((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));
    inputRef.current.value = "";
    setRepliedToMessage(null);
  };

  // Receive message
  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      setChat((prev) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
      }));
    };
    socket.on("receive-message", handleReceiveMessage);
    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [socket]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  //------------------------- Handle Context Menu ------------------------------

  const [contextMenu, setContextMenu] = useState(null);

  const handleRightClick = (event, message) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      message,
    });
  };

  const handleContextMenuAction = (action) => {
    if (contextMenu) {
      const { message } = contextMenu;
      switch (action) {
        case "delete":
          deleteMessage(message);
          break;
        case "reply":
          replyToMessage(message);
          break;
        case "copy":
          navigator.clipboard.writeText(message.content);
          break;
        case "info":
          showMessageInfo(message);
          break;
        default:
          break;
      }
      setContextMenu(null);
    }
  };

  // Delete message
  const deleteMessage = async (message) => {
    const { message_id, sender_id } = message;
    try {
      const response = await axios2.delete(
        `/server/chat/delete-message/${message_id}?senderId=${sender_id}`
      );
      console.log("Success:", response.data);
      setChat((prev) => ({
        ...prev,
        messages: prev.messages.filter(
          (item) => item.message_id !== message_id
        ),
      }));
      socket.emit("delete-message", {
        deleted_message: message,
        receiver_code: connectionInfo.user.code,
      });
    } catch (error) {
      console.error(
        "Deletion failed",
        error.response ? error.response.data : error.message
      );
    }
  };
  useEffect(() => {
    const handleMessageDeleted = (message) => {
      setChat((prev) => ({
        ...prev,
        messages: prev.messages.filter(
          (item) => item.message_id !== message.message_id
        ),
      }));
    };
    socket.on("message-deleted", handleMessageDeleted);
    return () => {
      socket.off("message-deleted", handleMessageDeleted);
    };
  }, [socket, chat]);

  // Reply to message
  const [repliedToMessage, setRepliedToMessage] = useState(null);
  const replyToMessage = (message) => {
    setRepliedToMessage(message.content);
    inputRef.current.focus();
  };
  const removeReply = () => {
    setRepliedToMessage(null);
  };

  // Show message info
  const [messageInfo, setMessageInfo] = useState(null);
  const infoRef = useRef(null);
  const showMessageInfo = (message) => {
    setMessageInfo(message);
  };
  const closeMessageInfo = () => {
    setMessageInfo(null);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (infoRef.current && !infoRef.current.contains(event.target))
        closeMessageInfo();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [infoRef]);

  //------------------------ Navigate to connect device page ----------------------

  const { triggerAction, getTime, getDateTime } = useContext(UtilContext);
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const targetPage = "/connect-device";
  ////
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
  }, [socket, navigate]);
  ////
  const handleModalConfirm = () => {
    setModalOpen(false);
    navigate(targetPage);
    triggerAction("from-chat", null);
  };
  ////
  const handleModalCancel = () => {
    socket.emit("cancel-export");
    setModalOpen(false);
  };

  //-------------------------- Handle Scrolling ---------------------------

  const messagesEndRef = useRef(null);

  // Scroll to bottom when new message is added
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        block: "end",
      });
    }
  };
  useEffect(() => {
    if (chat?.messages && chat.messages.length > 0) {
      scrollToBottom();
    }
  }, [chat?.messages]);

  // Scroll to messages when entering messages area
  const handleMouseEnter = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  //-------------------------------------------------------------------------

  return (
    <div className="chat-box min-h-[86vh] max-h-[86vh]">
      {/* Sidebar for Devices */}
      <div className="flex">
        <div className="transition-width duration-300 bg-light overflow-y-auto">
          <button
            className="secondery-button toggle"
            onClick={() => navigate("/connect-device")}
          >
            <FaArrowLeft />
          </button>
        </div>
      </div>
      {chat ? (
        <div
          className="flex-1 flex flex-col gap-2 p-2"
          onMouseEnter={handleMouseEnter}
        >
          {/* Chat area */}
          <div className="flex-1 bg-white overflow-y-auto rounded p-3">
            {/* Messages */}
            {chat && Array.isArray(chat.messages) ? (
              <ul className="flex flex-col gap-3">
                {chat.messages.map((message, index) =>
                  message.sender_id === sessionInfo.client_id ? (
                    <li
                      key={index}
                      onContextMenu={(event) =>
                        handleRightClick(event, message)
                      }
                      className="w-fit self-end"
                    >
                      <div className="flex flex-col bg-blue-100 rounded max-w-md justify-end">
                        {message.replied_to && (
                          <div className="m-1">
                            <div
                              className="text-sm text-gray-400 bg-white bg-opacity-50 p-1
                                      rounded-sm border-2 border-dashed border-white"
                            >
                              {message.replied_to}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-gray-700 p-2">
                          <span className="text-gray-400 text-xs pr-2">
                            {getTime(message.sent_at)}
                          </span>
                          <div className="">{message.content}</div>
                        </div>
                      </div>
                    </li>
                  ) : (
                    <li
                      key={index}
                      onContextMenu={(event) =>
                        handleRightClick(event, message)
                      }
                      className="w-fit"
                    >
                      <div className="flex flex-col bg-yellow-100 rounded max-w-md">
                        {message.replied_to && (
                          <div className="m-1">
                            <div
                              className="text-sm text-gray-400 bg-white bg-opacity-50 p-1
                                      rounded-sm border-2 border-dashed border-white"
                            >
                              {message.replied_to}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-gray-600 p-2">
                          <div className="">{message.content}</div>
                          <span className="text-gray-400 text-xs pl-2">
                            {getTime(message.sent_at)}
                          </span>
                        </div>
                      </div>
                    </li>
                  )
                )}
                <div ref={messagesEndRef} />
              </ul>
            ) : (
              <div>No Messages.</div>
            )}
          </div>
          {/* Input box */}
          {repliedToMessage && (
            <div className="flex gap-2 m-2 items-start">
              <div
                className="flex-1 p-2 text-gray-400 text-sm bg-gray-50 rounded
                            border-2 border-dashed border-white"
              >
                {repliedToMessage}
              </div>
              <button
                onClick={removeReply}
                className="px-2 text-dark-cta bg-white hover:font-bold
                                border-2 border-white rounded "
              >
                X
              </button>
            </div>
          )}
          <div className="flex justify-center p-2 bg-light">
            <input
              ref={inputRef}
              onKeyDown={handleKeyDown}
              name="text"
              type="text"
              placeholder="Type a message"
              className="flex-1 border focus:outline-none rounded py-1 px-2 mr-2 w-full max-w-[600px]"
            />
            <button onClick={handleSendMessage} className="primary-button send">
              Send
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 self-center text-center">
          No Technician Connected
        </div>
      )}
      {popupData && (
        <Popup
          title={popupData.title}
          description={popupData.description}
          close={closePopup}
        />
      )}
      {/* Message Info */}
      {messageInfo && (
        <div className="absolute w-[100vw] h-[87vh] top-[60px] bg-black bg-opacity-25">
          <div
            ref={infoRef}
            className="flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        border border-gray-500 rounded-lg bg-white p-4 px-8 gap-4"
          >
            <button
              onClick={closeMessageInfo}
              className="px-2 text-dark-cta bg-white hover:font-bold
                                border-2 border-gray rounded w-fit"
            >
              X
            </button>
            <ul className="flex flex-col gap-2">
              {Object.entries(messageInfo).map(([key, value], index) => (
                <li key={index} className="flex gap-2">
                  <div className="text-gray">
                    {key === "started_at" ? null : `${key} :`}
                  </div>
                  <div>
                    {key === "started_at" ? null : (
                      <div>
                        {key === "sent_at"
                          ? getDateTime(value)
                          : value !== null
                          ? value
                          : "no reply"}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          message={contextMenu.message}
          userId={sessionInfo.client_id}
          onDelete={() => handleContextMenuAction("delete")}
          onReply={() => handleContextMenuAction("reply")}
          onCopy={() => handleContextMenuAction("copy")}
          onInfo={() => handleContextMenuAction("info")}
          onClose={() => setContextMenu(null)}
        />
      )}
      <ConfirmModal
        isOpen={isModalOpen}
        message={modalMessage}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
    </div>
  );
};

export default ChatPage;
