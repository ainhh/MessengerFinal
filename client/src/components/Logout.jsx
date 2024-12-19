import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { IoExit } from 'react-icons/io5';

const Logout = () => {
  const { logoutUser } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmLogout = () => {
    handleLogout();
  };

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="relative">
      <button
        onClick={handleLogoutClick}
        className="cursor-pointer text-gray-500 hover:text-gray-700"
        title="Logout"
      >
        <IoExit className="w-7 h-7" />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Are you sure you want to log out?
            </h2>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logout;
