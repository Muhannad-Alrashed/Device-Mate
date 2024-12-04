import React from "react";

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl text-dark-cta font-bold mb-4">Confirm Action</h2>
        <p>{message}</p>
        <div className="mt-4 flex justify-end">
          <button className="secondery-button me-2" onClick={onCancel}>
            Cancel
          </button>
          <button className="primary-button ms-2" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
