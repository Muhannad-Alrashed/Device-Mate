import React, { useState, useContext, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Popup from "../components/Popup";

const Profile = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [popupData, setPopupData] = useState(null);
  const [error, setError] = useState(null);

  const closePopup = () => {
    setPopupData(null);
  };

  //---------------------------- Change Info ---------------------------

  const [infoChanged, setInfoChanged] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: currentUser.username || "",
    email: currentUser.email || "",
    phone: currentUser.phone || "",
    about: currentUser.about || "",
  });

  const handleInfoChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    setInfoChanged(true);
    setError(null);
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    if (!infoChanged) return;
    const userId = currentUser.user_id;
    try {
      const response = await axios.put(
        `/server/profile/save-info/${userId}`,
        userInfo
      );
      setCurrentUser(response.data);
      setPopupData({
        title: "Success",
        description: "Your info updated successfully.",
      });
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  //---------------------------- Change Password ---------------------------

  const oldPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleInputChange = () => {
    setError(null);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const oldPasswordCorrect = await isOldPasswordCorrect();
    if (!oldPasswordCorrect) {
      return;
    }
    if (!doPassowrdsMatch()) {
      return;
    }
    const userId = currentUser.user_id;
    const newPassword = newPasswordRef.current.value;
    try {
      const response = await axios.put(
        `/server/profile/save-password/${userId}`,
        {
          password: newPassword,
        }
      );
      if (response.data !== 0)
        setPopupData({
          title: "Success",
          description: "Password updated successfully.",
        });
      setInfoTab(true);
    } catch (error) {
      setError(
        error.response ? error.response.data : "Failed to update user password."
      );
    }
  };

  const doPassowrdsMatch = () => {
    if (newPasswordRef.current.value !== confirmPasswordRef.current.value) {
      setError("The two passwords don't match.");
      return false;
    } else return true;
  };

  const isOldPasswordCorrect = async () => {
    const userId = currentUser.user_id;
    const password = oldPasswordRef.current.value;
    try {
      const response = await axios.get(
        `/server/profile/check-password/${userId}?password=${password}`
      );
      return response.data;
    } catch (error) {
      console.log(error.response ? error.response.data : error);
      setError("Old password is not correct.");
      return false;
    }
  };

  //---------------------------- Toggle Taps ---------------------------

  const [infoTab, setInfoTab] = useState(true);

  const toggleTap = () => {
    setInfoTab((prev) => !prev);
    setError(null);
  };

  useEffect(() => {
    if (!infoTab) {
      oldPasswordRef.current.value = "";
      newPasswordRef.current.value = "";
      confirmPasswordRef.current.value = "";
    }
  }, [infoTab]);

  //--------------------------------------------------------------------

  return (
    <main>
      <div className="container flex flex-col py-12">
        <Link to="/dashboard">
          <FaChevronLeft
            className="absolute -top-8 left-0 dropdown-icon text-light-cta
                text-lg cursor-pointer hover:-left-0.5 transition-all duration-100"
          />
        </Link>
        <h1 className="text-2xl text-dark-cta font-bold mb-4 ">
          Profile Settings.
          <span className="text-gray font-bold text-base m-4">
            {infoTab ? "Personal Details:" : "Change Password:"}
          </span>
        </h1>
        {infoTab ? (
          // Change Personal Details
          <form
            onSubmit={handleInfoSubmit}
            className="flex flex-col gap-4 ps-4 max-w-[700px] lg:m-auto lg:w-[700px]"
          >
            <div>
              <div className="block text-gray text-sm font-medium text-gray-700">
                Name
              </div>
              <input
                type="text"
                name="username"
                autoComplete="name"
                value={userInfo.username}
                onChange={handleInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 border p-3
                            focus:outline-none focus:border-[#40bf95]"
              />
            </div>
            <div>
              <div className="block text-gray text-sm font-medium text-gray-700">
                Email
              </div>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={userInfo.email}
                onChange={handleInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 border p-3
                            focus:outline-none focus:border-[#40bf95]"
              />
            </div>
            <div>
              <div className="block text-gray text-sm font-medium text-gray-700">
                Phone
              </div>
              <input
                type="text"
                name="phone"
                autoComplete="phone"
                value={userInfo.phone}
                onChange={handleInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 border p-3
                            focus:outline-none focus:border-[#40bf95]"
              />
            </div>
            <div>
              <div className="block text-gray text-sm font-medium text-gray-700">
                About
              </div>
              <textarea
                type="text"
                name="about"
                value={userInfo.about}
                onChange={handleInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 border p-3
                      h-32  focus:outline-none focus:border-[#40bf95]"
              />
            </div>
            {error && (
              <div className="text-red-500 text-center mb-3">{error}</div>
            )}
            <div className="flex justify-between space-x-4">
              <button
                className="flex items-center gap-2 link-button"
                onClick={toggleTap}
              >
                Change Password
                <FaChevronRight className="text-xs" />
              </button>
              <button type="submit" className="primary-button">
                Save Changes
              </button>
            </div>
            <div className="flex justify-between space-x-4 mt-16">
              <Link
                to="./delete-account"
                className="flex items-center gap-2 danger-button"
              >
                Delete Account
                <FaChevronRight className="text-xs" />
              </Link>
            </div>
          </form>
        ) : (
          //  Change Password
          <form
            onSubmit={handlePasswordSubmit}
            className="flex flex-col ps-4 max-w-[700px] lg:m-auto lg:w-[700px]"
          >
            <div className="block text-gray text-sm font-medium text-gray-700">
              Enter old password
            </div>
            <input
              required
              type="text"
              name="old"
              ref={oldPasswordRef}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 border p-3
                            focus:outline-none focus:border-[#40bf95] mb-4"
            />
            <div className="block text-gray text-sm font-medium text-gray-700">
              Enter new password
            </div>
            <input
              required
              type="text"
              name="new"
              ref={newPasswordRef}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 border p-3
                            focus:outline-none focus:border-[#40bf95] mb-4"
            />
            <div className="block text-gray text-sm font-medium text-gray-700">
              Confirm password
            </div>
            <input
              required
              type="text"
              name="confirm"
              ref={confirmPasswordRef}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 border p-3
                            focus:outline-none focus:border-[#40bf95] mb-4"
            />
            {error && (
              <div className="text-red-500 text-center mb-3">{error}</div>
            )}
            <div className="flex justify-end space-x-4">
              <button className="secondery-button" onClick={toggleTap}>
                Cancel
              </button>
              <button type="submit" className="primary-button">
                Change Password
              </button>
            </div>
          </form>
        )}
      </div>
      {popupData && (
        <Popup
          title={popupData.title}
          description={popupData.description}
          close={closePopup}
        />
      )}
    </main>
  );
};

export default Profile;
