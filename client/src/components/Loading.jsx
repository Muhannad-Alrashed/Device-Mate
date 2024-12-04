import React from "react";

const Loading = ({ label = "loading data" }) => {
  return (
    <div className="flex justify-center gap-2">
      <span className="text-gray-500">{label}...</span>
      <div className="flex justify-center mt-2 space-x-2">
        <div className="w-3 h-3 bg-dark-cta rounded-full animate-up-and-down delay-0"></div>
        <div className="w-3 h-3 bg-dark-cta rounded-full animate-up-and-down delay-150"></div>
        <div className="w-3 h-3 bg-dark-cta rounded-full animate-up-and-down delay-300"></div>
      </div>
    </div>
  );
};

export default Loading;
