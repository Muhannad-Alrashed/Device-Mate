import React, { useState, useContext, useEffect, useRef } from "react";
import axios2 from "../axios2";
import "../styles/dashboard-pages.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { WebSocketContext } from "../context/webSocketContext";
import { UtilContext } from "../context/utilContext.js";
import { AuthContext } from "../context/authContext";
import Popup from "../components/Popup";
import ContextMenu from "../components/ContextMenu.jsx";
import Loading from "../components/Loading.jsx";

const ChatPage = () => {
  const { socket, sessionInfo, connectionInfo } = useContext(WebSocketContext);
  const { getTime, getDateTime, action, setAction } = useContext(UtilContext);
  const { currentUser } = useContext(AuthContext);
  const [currentClient, setCurrentClient] = useState("");
  const [chats, setChats] = useState([]);
  const [displayedChat, setDisplayedChat] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const inputRef = useRef(null);

  const closePopup = () => {
    setPopupData(null);
  };

  // show specific chat
  useEffect(() => {
    if (action) {
      if (action.name === "open-chat") {
        displayChat(action.param);
        setAction(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //---------------------------- Fetch Chats -----------------------------

  // Get client name
  const fetchName = async (clientId) => {
    try {
      const response = await axios2.get(`/chat/get-name/${clientId}/client`);
      return response.data.name;
    } catch (error) {
      console.error(
        "Failed to get name.",
        error.response ? error.response.data : error.message
      );
      return null;
    }
  };

  // Get messages
  const fetchMessages = async (clientId) => {
    try {
      const response = await axios2.get(`/chat/get-messages/${clientId}`);
      return response.data;
    } catch (error) {
      console.error(
        "Failed to get messages.",
        error.response ? error.response.data : error.message
      );
      return null;
    }
  };

  //---------------------------- Load Chats -----------------------------

  const [loadingChats, setLoading] = useState(true);

  const displayChat = async (Id) => {
    try {
      const [clientName, messages] = await Promise.all([
        fetchName(Id),
        fetchMessages(Id),
      ]);
      setDisplayedChat({ clientId: Id, clientName, messages });
    } catch (error) {
      console.error("Failed to load chat", error.message);
    }
  };

  // show current chat
  useEffect(() => {
    const load = async () => {
      displayChat(sessionInfo.client_id);
      const clientName = await fetchName(sessionInfo.client_id);
      setCurrentClient(clientName);
    };
    if (sessionInfo) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionInfo]);

  // Fetch old chats list
  useEffect(() => {
    const fetchOldChats = async () => {
      const userId = currentUser.user_id;
      try {
        const response = await axios2.get(`/chat/get-chats/${userId}`);
        const chats = response.data || [];
        ////
        const chatsWithClientDetails = await Promise.all(
          chats.map(async (chat) => {
            const clientName = await fetchName(chat.client_id);
            return { ...chat, clientName };
          })
        );
        setChats(chatsWithClientDetails);
      } catch (error) {
        console.error(
          "Failed to get chats.",
          error.response ? error.response.data : error.message
        );
      }
      setLoading(false);
    };
    if (currentUser) {
      fetchOldChats();
    }
  }, [currentUser]);

  //----------------------------- Handle Chating ------------------------

  // Prepare message
  const handleSendMessage = async () => {
    if (!sessionInfo) return;
    if (displayedChat.clientId !== sessionInfo.client_id) {
      setPopupData({
        title: "Notification",
        description: "This client is not connected.",
      });
      return;
    }
    try {
      const message = inputRef.current.value;
      if (message === "") return;
      const data = {
        senderId: sessionInfo.user_id,
        ...sessionInfo,
        message,
        repliedTo: repliedToMessage,
      };
      const response = await axios2.post("/chat/send-message", data);
      sendMessage(response.data.details);
    } catch (error) {
      console.error(
        "Failed to send message.",
        error.response ? error.response.data.error : error.message
      );
    }
  };

  //Send message
  const sendMessage = (newMessage) => {
    socket.emit("send-message", {
      new_message: newMessage,
      receiver_code: connectionInfo.client.code,
    });
    setDisplayedChat((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));
    inputRef.current.value = "";
    setRepliedToMessage(null);
  };

  // Receive message
  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      setDisplayedChat((prevChat) => ({
        ...prevChat,
        messages: [...(prevChat?.messages || []), newMessage],
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

  // Identify Menu action
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
        `/chat/delete-message/${message_id}?senderId=${sender_id}`
      );
      console.log("Success:", response.data);
      setDisplayedChat((prev) => ({
        ...prev,
        messages: prev.messages.filter(
          (item) => item.message_id !== message_id
        ),
      }));
      socket.emit("delete-message", {
        deleted_message: message,
        receiver_code: connectionInfo.client.code,
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
      setDisplayedChat((prev) => ({
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
  }, [socket, displayedChat]);

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

  //-------------------------- Handle Scrolling ---------------------------

  const messagesEndRef = useRef(null);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        block: "end",
      });
    }
  };

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (displayedChat?.messages && displayedChat.messages.length > 0) {
      scrollToBottom();
    }
  }, [displayedChat?.messages]);

  //-------------------------------------------------------------------------

  return (
    <div className="chat-box">
      <div className="wrapper flex flex-1 overflow-hidden">
        {/* Sidebar for Devices */}
        <div className="flex max-w-[50%]">
          <div
            className={`${
              isSidebarCollapsed ? "w-[54px]" : "w-[300px]"
            } transition-width duration-300 bg-light border-r border-white overflow-y-auto`}
          >
            <button
              className="secondery-button toggle"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              {isSidebarCollapsed ? <FaArrowRight /> : <FaArrowLeft />}
            </button>
            <div className={`p-3 ${isSidebarCollapsed ? "hidden" : "block"}`}>
              <div className="mb-4">
                <h3 className="text-lg text-gray">Connected Device</h3>
                {displayedChat && sessionInfo ? (
                  <div
                    onClick={() => displayChat(sessionInfo.client_id)}
                    className={`p-2 ps-6 border-b cursor-pointer hover:bg-gray-50 ${
                      displayedChat &&
                      sessionInfo.client_id === displayedChat.clientId
                        ? " border-b-2 border-[#40bf95]"
                        : " border-white"
                    }`}
                  >
                    {currentClient}
                  </div>
                ) : (
                  <div className="p-2 ps-4 border-b border-white">
                    No connected device
                  </div>
                )}
              </div>
              {/* Old Conversations */}
              <div className="my-4">
                <h3 className="text-lg text-gray ">Old Conversations</h3>
                {loadingChats ? (
                  <Loading label="loading conversations" />
                ) : chats.length > 0 ? (
                  <ul>
                    {sessionInfo
                      ? chats
                          .filter(
                            (item) => item.client_id !== sessionInfo.client_id
                          )
                          .map((item, index) => (
                            <li
                              onClick={() => displayChat(item.client_id)}
                              key={index}
                              className={`p-2 ps-6 border-b cursor-pointer hover:bg-gray-50
                            ${
                              displayedChat &&
                              item.client_id === displayedChat.clientId
                                ? " border-b-2 border-[#40bf95]"
                                : " border-white"
                            }`}
                            >
                              {item.clientName}
                            </li>
                          ))
                      : chats.map((item, index) => (
                          <li
                            onClick={() => displayChat(item.client_id)}
                            key={index}
                            className={`p-2 ps-6 border-b cursor-pointer hover:bg-gray-50
                          ${
                            displayedChat &&
                            item.client_id === displayedChat.clientId
                              ? " border-b-2 border-[#40bf95]"
                              : " border-white"
                          }`}
                          >
                            {item.clientName}
                          </li>
                        ))}
                  </ul>
                ) : (
                  <div className="ps-4">No old conversations.</div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Chat area */}
        <div className="flex-1 flex flex-col w-4/5 sm:w-full">
          <div className="flex-1 bg-white p-1 p-3 overflow-y-auto">
            {/* Messages */}
            {displayedChat &&
            Array.isArray(displayedChat.messages) &&
            currentUser ? (
              <ul className="flex flex-col gap-3">
                {displayedChat.messages.map((message, index) =>
                  message.sender_id === currentUser.user_id ? (
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
      </div>
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
          userId={currentUser.user_id}
          onDelete={() => handleContextMenuAction("delete")}
          onReply={() => handleContextMenuAction("reply")}
          onCopy={() => handleContextMenuAction("copy")}
          onInfo={() => handleContextMenuAction("info")}
          onClose={() => setContextMenu(null)}
        />
      )}
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

export default ChatPage;
