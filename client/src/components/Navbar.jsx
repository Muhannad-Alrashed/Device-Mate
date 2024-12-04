import React, { useEffect, useRef, useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { WebSocketContext } from "../context/webSocketContext.js";
import axios from "axios";
import Logo from "../img/logo-white-small.png";
import { FaAlignRight, FaUser } from "react-icons/fa";
import Popup from "../components/Popup";

const NavBar = () => {
  //
  const { socket, setConnectionInfo, connectionInfo } =
    useContext(WebSocketContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [popupData, setPopupData] = useState(null);

  const goHome = () => {
    navigate("/");
    window.location.reload();
  };

  //---------------------------- Handle Page Indicator  ----------------------------

  useEffect(() => {
    const updateIndicator = () => {
      const linkButtons = document.querySelectorAll("nav a");
      linkButtons.forEach((linkButton) => {
        const button_href = linkButton.getAttribute("href");
        if (button_href !== "/" && button_href !== "/login")
          if (location.pathname.startsWith(button_href)) {
            linkButton.classList.add("indicator");
          } else {
            linkButton.classList.remove("indicator");
          }
      });
    };
    updateIndicator();
  }, [location]);

  //---------------------------- Handle Join/Cut Connection ----------------------------

  // Join connection
  useEffect(() => {
    const handleJoinConnection = (user_code) => {
      setConnectionInfo((prev) => ({
        ...prev,
        user: { code: user_code, state: true },
      }));
      setPopupData({
        title: "Success",
        description: "Technician Is Connected.",
      });
    };
    if (!location.pathname.endsWith("/connect-device")) {
      socket.on("sender-joined", handleJoinConnection);
    }
    return () => {
      socket.off("sender-joined", handleJoinConnection);
    };
  }, [location, setConnectionInfo, connectionInfo, socket]);

  // End connection
  useEffect(() => {
    const handleCutConnection = () => {
      setPopupData({
        title: "Disconnection",
        description: "Connection ended. Technician exited the session",
      });
      setConnectionInfo((prev) => ({
        ...prev,
        user: { code: "", state: false },
      }));
    };
    if (!location.pathname.endsWith("/connect-device")) {
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
    if (socket) {
      // Get sender name
      const fetchName = async (senderId) => {
        try {
          const response = await axios.get(
            `/server/chat/get-name/${senderId}/user`
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
            navigate("/client-chat");
          };
        }
      };

      // Receive message
      const handleReceiveMessage = (newMessage) => {
        if (location.pathname !== "/client-chat") {
          displayNotification(newMessage);
        }
      };
      socket.on("receive-message", handleReceiveMessage);
      return () => {
        socket.off("receive-message", handleReceiveMessage);
      };
    }
  }, [location, navigate, socket]);

  //---------------------------- Handle DropDown Menu ----------------------------

  const dropdownRef = useRef();
  const dropdownContentRef = useRef();

  const toggleDropdown = () => {
    if (dropdownContentRef.current) {
      dropdownContentRef.current.classList.toggle("show-dropdown");
    }
  };

  const handleClickOutside = (event) => {
    if (
      !dropdownRef.current.contains(event.target) &&
      dropdownContentRef.current.classList.contains("show-dropdown")
    ) {
      dropdownContentRef.current.classList.remove("show-dropdown");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //-----------------------------------------------------------------------------

  return (
    <div className="navbar-background navbar-position">
      <nav className="container navbar">
        <div className="navbar-logo">
          <Link to="/" onClick={goHome}>
            <img src={Logo} alt="logo" />
          </Link>
        </div>
        <div ref={dropdownRef} className="navbar-links">
          <div ref={dropdownContentRef} className="dropdown">
            <Link onClick={handleClickOutside} to="/blog-news">
              Blog & News
            </Link>
            <Link onClick={handleClickOutside} to="/about">
              About Us
            </Link>
            <Link onClick={handleClickOutside} to="/contact">
              Contact
            </Link>
            <Link onClick={handleClickOutside} to="/support">
              Support
            </Link>
          </div>
          <Link to="/login">
            Login
            <FaUser className="navbar-icon profile" />
          </Link>
          <FaAlignRight
            onClick={toggleDropdown}
            className="navbar-icon burger-menu"
          />
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

export default NavBar;
