import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../img/logo-white-larg.png";
import "../styles/footers.css";

const Footer = () => {
  const [footerClasses, setFooterClasses] = useState("");
  const location = useLocation();

  const addFooterClass = (path) => {
    if (path === "/login" || path === "/signup") {
      return "footer-background footer-position";
    } else {
      return "footer-background";
    }
  };

  useEffect(() => {
    const path = location.pathname;
    const updatedClasses = addFooterClass(path);
    setFooterClasses(updatedClasses);
  }, [location]);

  return (
    <div className={footerClasses}>
      <footer className="container footer">
        <div className="column">
          <div className="logo">
            <img src={Logo} alt="Logo" />
          </div>
          <div className="text-sm font-light text-center mt-1">
            Device Control App: Copy right © {new Date().getFullYear()}
          </div>
        </div>
        <div className="column">
          <Link>link one</Link>
          <Link>link two</Link>
          <Link>link three</Link>
        </div>
        <div className="column">
          <Link>link four</Link>
          <Link>link five</Link>
          <Link>link six</Link>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
