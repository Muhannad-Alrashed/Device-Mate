import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import axios2 from "../axios2";
import { AuthContext } from "../context/authContext";
import { WebSocketContext } from "../context/webSocketContext.js";
import { TransferContext } from "../context/transferContext.js";
import ConfirmModal from "../components/ConfirmModal";
import Loading from "../components/Loading";
import Popup from "../components/Popup";

const DeleteAccount = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { sessionInfo, killConnection } = useContext(WebSocketContext);
  const { clearTransferData } = useContext(TransferContext);

  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);

  const handleModalConfirm = async () => {
    setModalOpen(false);
    setIsDeleting(true);
    const userId = currentUser.user_id;
    try {
      await axios2.delete(`/profile/delete-account/${userId}`);
      if (sessionInfo) {
        // clear deleted account connection
        killConnection();
        clearTransferData();
      }
      setPopupData({
        title: "Success",
        description: "Account deleted successfully.",
      });
    } catch (error) {
      setError(
        "Failed to delete account. ",
        error.response ? error.response.data : error.message
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteAccount = async () => {
    setModalMessage("Confirm action to proceed with deleting your account?!");
    setModalOpen(true);
  };

  const handleModalCancel = () => {
    setModalOpen(false);
  };

  const handleClosePopup = () => {
    setPopupData(null);
    navigate("/signup");
  };

  //-----------------------------------------------------------------------

  return (
    <main>
      <div
        className="flex flex-col items-center
        min-h-[73vh] sm:min-h-[86vh] max-h-[73vh] sm:max-h-[86vh]"
      >
        <div
          className="bg-white pt-16 p-8 mt-32 max-w-md w-full
                      rounded-lg shadow-xl border-2 border-gray-50"
        >
          <Link to="/dashboard/profile" hidden={isDeleting}>
            <FaChevronLeft
              className="absolute -top-8 left-0 dropdown-icon text-light-cta
                text-lg cursor-pointer hover:-left-0.5 transition-all duration-100"
            />
          </Link>
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Delete Account
          </h2>
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete your account? This action is
            irreversible, and all of your data will be permanently removed.
          </p>
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
              {error}
            </div>
          )}
          <button
            onClick={deleteAccount}
            disabled={isDeleting}
            className={`danger-button w-full bg-red-300 ${
              isDeleting && "opacity-50 cursor-not-allowed mb-6"
            }`}
          >
            Delete My Account
          </button>
          {isDeleting && <Loading label="Deleting account" />}
        </div>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        message={modalMessage}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
      {popupData && (
        <Popup
          title={popupData.title}
          description={popupData.description}
          close={handleClosePopup}
        />
      )}
    </main>
  );
};

export default DeleteAccount;
