import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { WebSocketContext } from "../context/webSocketContext";
import { TransferContext } from "../context/transferContext";
import Popup from "../components/Popup";
import "../styles/login-signup.css";

const Signup = () => {
  const { signup, currentUser } = useContext(AuthContext);
  const { killConnection } = useContext(WebSocketContext);
  const { clearTransferData } = useContext(TransferContext);
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  //---------------------------------------

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(inputs);
      setShowPopup(true);
      if (currentUser) {
        // Clear previous account connection
        killConnection();
        clearTransferData();
      }
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate("/dashboard/profile");
  };

  //------------------------------------------------------------------------------

  return (
    <main className="auth-background">
      {!showPopup ? (
        <div className="container auth">
          <form onSubmit={handleSubmit}>
            <Link className="close-button" to="/">
              X
            </Link>
            <h1>Create a New Account</h1>
            <input
              className="focus:outline-none focus:border-[#40bf95]"
              autoComplete="off"
              required
              type="text"
              placeholder="username"
              name="username"
              onChange={handleChange}
            />
            <input
              className="focus:outline-none focus:border-[#40bf95]"
              autoComplete="off"
              required
              type="email"
              placeholder="email"
              name="email"
              onChange={handleChange}
            />
            <input
              className="focus:outline-none focus:border-[#40bf95]"
              autoComplete="off"
              required
              type="password"
              placeholder="password"
              name="password"
              onChange={handleChange}
            />
            <button className="primary-button" type="submit">
              Create Account
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <span>
              Don't you have an account?
              <Link className="link-button" to="/login">
                Log In
              </Link>
            </span>
          </form>
        </div>
      ) : (
        <Popup
          username={inputs.username}
          title="Welcome"
          description="Your account has been created successfully."
          close={handleClosePopup}
        />
      )}
    </main>
  );
};

export default Signup;
