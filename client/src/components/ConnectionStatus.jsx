import React from "react";
import client from "../img/client.png";
import technician from "../img/technician.png";
import connected from "../img/connected.png";
import disconnected from "../img/disconnected.png";

const ConnectionStatus = ({ connectionInfo }) => {
  return (
    <div className="flex justify-center gap-8 my-8 lg:w-4/5 lg:m-auto">
      <div className="flex flex-col justify-between w-1/6 gap-2">
        <p className="text-gray text-center">Client</p>
        <img src={client} alt="Client"></img>
        <p
          className={`text-center leading-3	font-bold ${
            connectionInfo.client.state ? "text-green-500" : "text-red-500"
          }`}
        >
          {connectionInfo.client.state ? "Connected" : "Not Connected"}
        </p>
      </div>
      <div className="flex flex-col justify-between gap-y-[30px]">
        <div className="flex justify-center gap-2">
          <div
            className={`flex-1 h-3/4 border-b-4 border-dashed ${
              connectionInfo.client.state
                ? "border-green-500"
                : "border-red-500"
            }`}
          ></div>
          <div className="w-1/4">
            {connectionInfo.user.state && connectionInfo.client.state ? (
              <img src={connected} alt="Connected"></img>
            ) : (
              <img src={disconnected} alt="Disconnected"></img>
            )}
          </div>
          <div
            className={`flex-1 h-3/4 border-b-4 border-dashed border-green-500 ${
              connectionInfo.user.state
                ? "border-green-500 "
                : "border-red-500 "
            }`}
          ></div>
        </div>
        <div>
          <p className="text-gray text-center md:my-2">Connection Code</p>
          <p
            className="text-center sm:text-xl md:text-2xl font-bold text-green-500 py-2
            border-2 lg:border-4 border-gray-200 border-dashed hover:border-green-500 "
          >
            {connectionInfo.user.code}
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-between w-1/6 gap-2">
        <p className="text-gray text-center">Technician</p>
        <img src={technician} alt="Technician"></img>
        <p
          className={`text-center leading-3 font-bold	${
            connectionInfo.user.state ? "text-green-500" : "text-red-500"
          }`}
        >
          {connectionInfo.user.state ? "Connected" : "Not Connected"}
        </p>
      </div>
    </div>
  );
};

export default ConnectionStatus;
