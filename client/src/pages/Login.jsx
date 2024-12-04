import React, { useState } from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { WebSocketContext } from "../context/webSocketContext";
import { TransferContext } from "../context/transferContext";
import "../styles/login-signup.css";

const Login = () => {
  const { login, currentUser } = useContext(AuthContext);
  const { killConnection } = useContext(WebSocketContext);
  const { clearTransferData } = useContext(TransferContext);
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  //---------------------------------------

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      if (currentUser) {
        // Clear previous account connection
        killConnection();
        clearTransferData();
      }
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data);
    }
  };

  //------------------------------------------------------------------------------

  return (
    <main className="auth-background">
      <div className="container auth">
        <form onSubmit={handleSubmit}>
          <Link className="close-button" to="/">
            X
          </Link>
          <h1>Welcome Back</h1>
          <div>
            <input
              className="focus:outline-none focus:border-[#40bf95]"
              autoComplete="off"
              required
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              className="focus:outline-none focus:border-[#40bf95]"
              autoComplete="off"
              required
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
          </div>
          <button className="primary-button" type="submit">
            Login
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <span>
            Don't you have an account?
            <Link className="link-button" to="/signup">
              Sign Up
            </Link>
          </span>
        </form>
      </div>
    </main>
  );
};

export default Login;
