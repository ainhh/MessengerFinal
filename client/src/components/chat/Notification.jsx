import { useContext, useState } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import { unreadNotificationsFunc } from '../../utils/unreadNotification';
import moment from 'moment';
import { BsFillBellFill } from 'react-icons/bs';

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const {
    notifications,
    userChats,
    allUsers,
    markAllNotificationsAsRead,
    markNotificationAsRead,
  } = useContext(ChatContext);

  const unreadNotifications = unreadNotificationsFunc(notifications);
  const modifiedNotifications = notifications.map((n) => {
    const sender = allUsers.find((user) => user._id === n.senderId);

    return {
      ...n,
      senderName: sender?.name,
    };
  });

  return (
    <div className="relative">
      {/* Notification Icon */}
      <div
        className="relative cursor-pointer text-gray-500 hover:text-gray-700"
        title="Notification"
        onClick={() => setIsOpen(!isOpen)}
      >
        <BsFillBellFill className="w-6 h-6" />

        {unreadNotifications?.length > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">
            {unreadNotifications?.length}
          </span>
        )}
      </div>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <button
              className="text-sm text-blue-500 hover:underline"
              onClick={() => markAllNotificationsAsRead(notifications)}
            >
              Mark all as read
            </button>
          </div>

          {/* Notification Items */}
          <div className="max-h-60 overflow-y-auto">
            {modifiedNotifications?.length === 0 ? (
              <div className="px-4 py-3 text-center text-gray-500">
                No notifications yet
              </div>
            ) : (
              modifiedNotifications.map((n, index) => (
                <div
                  key={index}
                  className={`px-4 py-3 cursor-pointer ${
                    n.isRead
                      ? 'bg-white hover:bg-gray-100'
                      : 'bg-blue-50 hover:bg-blue-100'
                  }`}
                  onClick={() => {
                    markNotificationAsRead(n, userChats, user, notifications);
                    setIsOpen(false);
                  }}
                >
                  <p className="text-sm text-gray-800">
                    {`${n.senderName} sent you a message`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {moment(n.date).calendar()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
