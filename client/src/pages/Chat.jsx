import { useContext, useState, useEffect } from 'react';
import { ChatContext } from '../context/ChatContext';
import UserChat from '../components/chat/UserChat';
import { AuthContext } from '../context/AuthContext';
import ChatBox from '../components/chat/ChatBox';
import { FaSearch, FaPlus } from 'react-icons/fa';
import Notification from '../components/chat/Notification';
import PotentialChats from '../components/chat/PotentialChats';
import { FiPlus } from 'react-icons/fi';
import { HiMiniXMark } from 'react-icons/hi2';
import Logout from '../components/Logout';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const {
    userChats,
    isUserChatsLoading,
    updateCurrentChat,
    createChat,
    allUsers,
  } = useContext(ChatContext);

  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectUser = async (selectedUser) => {
    if (!selectedUser) {
      console.error('Selected user is undefined or null');
      return;
    }

    const currentUserId = user?._id;
    console.log('current', currentUserId);
    console.log('selectedUser', selectedUser?._id);

    if (!currentUserId) {
      console.error('No current user ID found');
      return;
    }

    const existingChat = userChats.find((chat) =>
      chat.members.includes(selectedUser._id)
    );

    if (existingChat) {
      updateCurrentChat(existingChat);
    } else {
      const newChat = await createChat(currentUserId, selectedUser._id);
      updateCurrentChat(newChat);

      if (newChat) {
        updateCurrentChat(newChat);
        userChats.push(newChat);
      }
    }

    setIsComposeOpen(false);
  };

  useEffect(() => {
    document.body.classList.add('logged-in-background');
    return () => {
      document.body.classList.remove('logged-in-background');
    };
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid mx-auto pt-4">
      <div className="flex gap-3">
        <div className="bg-white shadow-md rounded-lg w-1/3 p-4 h-[95vh] flex flex-col ml-5 inter">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-700">Chats</h1>
            <div className="flex items-center gap-4 justify-center pb-4">
              <Notification />
              <Logout />
            </div>
          </div>

          <div className="relative my-4">
            <input
              type="text"
              placeholder="Search Message"
              className="w-full px-12 py-2 rounded-full bg-gray-100 border border-gray-300 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring focus:ring-blue-300"
              onChange={(e) => handleSearch(e.target.value)}
            />
            <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
          </div>

          {isUserChatsLoading ? (
            <div className="flex-1 flex justify-center items-center text-gray-500">
              Loading chats...
            </div>
          ) : userChats?.length > 0 ? (
            <div className="flex-1 overflow-y-auto">
              {userChats?.map((chat, index) => (
                <div
                  key={index}
                  className="cursor-pointer py-2 rounded-lg flex items-center space-x-2"
                  onClick={() => updateCurrentChat(chat)}
                >
                  <UserChat chat={chat} user={user} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex justify-center items-center text-gray-500">
              <p>No chats yet. Start a new conversation!</p>
            </div>
          )}

          <button
            onClick={() => setIsComposeOpen(true)}
            className="bg-blue-400 hover:bg-blue-700 p-3 rounded-full mb-3 w-14 relative bottom-[20px] left-[350px]"
          >
            <FiPlus className="w-8 h-8 text-white" />
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg w-1/2 h-[95vh]">
          <ChatBox />
        </div>
        <div className=" bg-white shadow-md rounded-lg w-1/4 mr-6 h-[95vh] overflow-auto">
          <PotentialChats />
        </div>

        {isComposeOpen && (
          <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white shadow-md rounded-lg w-1/3 p-6 h-[85vh] flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-700">
                  Start a conversation
                </h2>
                <button
                  onClick={() => setIsComposeOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <HiMiniXMark className="w-7 h-7" />
                </button>
              </div>

              <input
                type="text"
                placeholder="Search for a user"
                className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none"
                onChange={(e) => handleSearch(e.target.value)}
              />

              <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto">
                {filteredUsers?.map((u, index) => (
                  <div
                    key={index}
                    className="cursor-pointer py-2 px-4 rounded-lg flex items-center space-x-3 bg-white hover:bg-gray-100"
                    onClick={() => handleSelectUser(u)}
                  >
                    <span className="text-gray-700">{u.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
