import axios2 from "../axios2.js";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await axios2.post("/server/auth/login", inputs);
    setCurrentUser(res.data);
  };

  const signup = async (inputs) => {
    const res = await axios2.post("/server/auth/signup", inputs);
    setCurrentUser(res.data);
  };

  const logout = async (inputs) => {
    await axios2.post("/server/auth/logout");
    setCurrentUser(null);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
