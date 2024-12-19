import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import Avatar from '../Avatar';

const PotentialChats = () => {
  const { onlineUsers, createChat } = useContext(ChatContext);
  const { allUsers = [] } = useContext(ChatContext); // Default to empty array
  const { user } = useContext(AuthContext); // Get current user details

  console.log('allUsers:', allUsers);
  console.log('onlineUsers:', onlineUsers);

  // Combine online user data with details from allUsers
  const onlineUserDetails =
    Array.isArray(onlineUsers) &&
    onlineUsers
      .filter((onlineUser) => onlineUser.userId !== user?._id) // Exclude current user
      .map((onlineUser) => {
        const userData = allUsers.find((u) => u._id === onlineUser.userId);
        return {
          ...onlineUser,
          name: userData?.name || 'Unknown User', // Provide fallback
        };
      });

  return (
    <div className="px-5 py-2">
      <div>
        <p className="text-xl font-bold mb-2 py-4 border-b">Online Users</p>
      </div>
      <div className="space-y-1">
        {onlineUserDetails && onlineUserDetails.length > 0 ? (
          onlineUserDetails.map((user, index) => (
            <div
              key={index}
              // onClick={() => createChat(user.userId)}
              className="flex items-center justify-between p-3 rounded-lg cursor-pointer bg-white hover:bg-gray-100 shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <Avatar name={user.name} size="30px" round={true} />
                <span className="text-gray-800 font-medium">{user.name}</span>
              </div>

              <span className="h-3 w-3 bg-green-500 rounded-full"></span>
            </div>
          ))
        ) : (
          <p>No online users available.</p>
        )}
      </div>
    </div>
  );
};

export default PotentialChats;
