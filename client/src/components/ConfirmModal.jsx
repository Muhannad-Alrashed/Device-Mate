import { React, useState } from "react";
import Loading from "./Loading";

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  const [disabled, setDisabled] = useState(false);

  const handleConfirm = async () => {
    setDisabled(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Confirmation Error:", error);
    } finally {
      setDisabled(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl text-dark-cta font-bold mb-4">Confirm Action</h2>
        <p className={`${disabled && "opacity-25 mb-8"}`}>{message}</p>
        {disabled ? (
          <Loading label="Action in process" />
        ) : (
          <>
            <div className="mt-4 flex justify-end">
              <button className="secondery-button me-2" onClick={onCancel}>
                Cancel
              </button>
              <button className="primary-button ms-2" onClick={handleConfirm}>
                Confirm
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmModal;
