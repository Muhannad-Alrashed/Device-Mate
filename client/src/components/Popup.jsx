import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "../styles/popup.css";

const Popup = ({ title, description, username = "", close }) => {
  useEffect(() => {
    const timer = setTimeout(close, 4000);
    return () => clearTimeout(timer);
  }, [close]);

  return (
    <div className="popup-container">
      <div className="popup-content">
        <button className="close-button " onClick={close}>
          X
        </button>
        <h3>
          DeviceMate
          <div className="username">{username}</div>
        </h3>
        <h2
          className={`${title === "Error" ? "text-red-700" : "text-dark-cta"}`}
        >
          {title}
        </h2>
        <p>{description}</p>
      </div>
    </div>
  );
};

Popup.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  username: PropTypes.string,
  close: PropTypes.func.isRequired,
};

export default Popup;
