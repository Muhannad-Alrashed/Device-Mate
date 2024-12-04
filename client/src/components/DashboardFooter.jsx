import React from "react";
import { Link } from "react-router-dom";
import Logo from "../img/logo-white-small.png";
import "../styles/footers.css";

const DashboardFooter = () => {
  return (
    <div className="footer-background footer-position">
      <footer className="dashboard-footer">
        <div className="logo">
          <img src={Logo} alt="" />
        </div>
        <div className="column">
          <Link>link one</Link>
          <Link>link two</Link>
          <Link>link three</Link>
        </div>
        <p>Copy right © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default DashboardFooter;
