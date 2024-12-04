import React, { useEffect, useRef } from "react";
import { FaCopy, FaInfo, FaReply } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";

const ContextMenu = ({
  x,
  y,
  message,
  userId,
  onReply,
  onDelete,
  onCopy,
  onInfo,
  onClose,
}) => {
  //
  //--------------------------------- Menu Position ------------------------------

  // Viewport dimensions
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  ////
  let adjustedX = x;
  let adjustedY = y;
  // Mouse coordinations
  if (x < screenWidth / 2 && y < screenHeight / 2) {
    // First quarter
    adjustedX = x;
    adjustedY = y;
  } else if (x >= screenWidth / 2 && y < screenHeight / 2) {
    // Second quarter
    adjustedX = x - 160;
    adjustedY = y;
  } else if (x < screenWidth / 2 && y >= screenHeight / 2) {
    // Third quarter
    adjustedX = x;
    adjustedY = y - 180;
  } else if (x >= screenWidth / 2 && y >= screenHeight / 2) {
    // Fourth quarter
    adjustedX = x - 160;
    adjustedY = y - 180;
  }

  //--------------------------------- Close Menu ------------------------------------

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  //---------------------------------------------------------------------------------

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-white border border-gray-300 shadow-lg rounded-md w-[160px]"
      style={{ top: adjustedY, left: adjustedX }}
      onClick={(e) => e.stopPropagation()}
    >
      <ul className="list-none m-0 p-0">
        {message.sender_id === userId && (
          <li
            onClick={() => onDelete()}
            className="flex gap-2 items-center cursor-pointer p-3 pt-5 
            hover:bg-gray-100 text-sm hover:text-green-500 hover:text-base transition-all"
          >
            <FaDeleteLeft className="text-light-cta" />
            Delete
          </li>
        )}
        <li
          onClick={() => onReply()}
          className="flex gap-2 items-center cursor-pointer p-3 pt-5 
            hover:bg-gray-100 text-sm hover:text-green-500 hover:text-base transition-all"
        >
          <FaReply className="text-light-cta" />
          Replay
        </li>

        <hr className="w-4/5 m-auto"></hr>
        <li
          onClick={() => onCopy()}
          className="flex gap-2 items-center cursor-pointer p-3 py-4 
          hover:bg-gray-100 text-sm hover:text-green-500 hover:text-base transition-all"
        >
          <FaCopy className="text-light-cta" />
          Copy
        </li>
        <hr className="w-4/5 m-auto"></hr>
        <li
          onClick={() => onInfo()}
          className="flex gap-2 items-center cursor-pointer p-3 pb-5 
          hover:bg-gray-100 text-sm hover:text-green-500 hover:text-base transition-all"
        >
          <FaInfo className="text-light-cta" />
          Info
        </li>
      </ul>
    </div>
  );
};

export default ContextMenu;
