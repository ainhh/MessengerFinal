import { useContext } from 'react';
import { usefetchRecipientUser } from '../../hooks/useFetchRecipientUser';
import { ChatContext } from '../../context/ChatContext';
import { unreadNotificationsFunc } from '../../utils/unreadNotification';
import { useFetchLatestMessage } from '../../hooks/useFetchLatestMessage';
import moment from 'moment';
import Avatar from '../Avatar';

const UserChat = ({ chat, user }) => {
  const { recipientUser } = usefetchRecipientUser(chat, user);
  const { onlineUsers, notifications, markThisUserNotificationAsRead } =
    useContext(ChatContext);
  const { latestMessage } = useFetchLatestMessage(chat);

  const unreadNotifications = unreadNotificationsFunc(notifications);
  const thisUserNotifications = unreadNotifications?.filter(
    (n) => n.senderId === recipientUser?._id
  );
  const isOnline = onlineUsers?.some(
    (user) => user?.userId === recipientUser?._id
  );

  const truncateText = (text) => {
    let shortText = text.substring(0, 20);
    if (text.length > 20) {
      shortText = shortText + '...';
    }
    return shortText;
  };

  const getFormattedTime = (date) => {
    const now = moment();
    const messageTime = moment(date);

    if (now.isSame(messageTime, 'day')) {
      return messageTime.fromNow();
    }
    return messageTime.calendar();
  };

  return (
    <div
      className="flex items-center justify-between p-2 w-full bg-white rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer"
      role="button"
      tabIndex="0"
      onClick={() => {
        if (thisUserNotifications?.length !== 0) {
          markThisUserNotificationAsRead(thisUserNotifications, notifications);
        }
      }}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar name={recipientUser?.name} size="50px" />
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
          )}
        </div>

        <div>
          <div className="text-gray-800 font-medium">{recipientUser?.name}</div>
          <div className="text-sm text-gray-500">
            {latestMessage?.text && (
              <span>{truncateText(latestMessage?.text)}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end space-y-1 text-xs text-gray-400">
        <span>{getFormattedTime(latestMessage?.createdAt)}</span>
        {thisUserNotifications?.length > 0 && (
          <span className="flex items-center justify-center h-5 w-5 bg-blue-500 text-white rounded-full text-xs font-bold">
            {thisUserNotifications?.length}
          </span>
        )}
      </div>
    </div>
  );
};

export default UserChat;
