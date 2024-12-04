import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthContextProvider } from "./context/authContext";
import { WebSocketContextProvider } from "./context/webSocketContext";
import { UtilContextProvider } from "./context/utilContext";
import { TransferContextProvider } from "./context/transferContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <WebSocketContextProvider>
        <UtilContextProvider>
          <TransferContextProvider>
            <Root />
          </TransferContextProvider>
        </UtilContextProvider>
      </WebSocketContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
