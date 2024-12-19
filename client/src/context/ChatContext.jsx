import { createContext, useCallback, useEffect, useState } from 'react';
import {
  baseUrl,
  getRequest,
  postRequest,
  messagePostRequest,
} from '../utils/services';
import { useRef } from 'react';
import { io } from 'socket.io-client';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setisUserChatsLoading] = useState(false);
  const [userChatsError, setuserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextmessagesError, setSendTextMessagesError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUSers] = useState([]);

  // console.log("messages", messages);
  // console.log("CurrentChat", currentChat);
  console.log('notifications', notifications);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket === null) return;
    socket.emit('addNewUser', user?._id); // if there's an error please check this
    socket.on('getOnlineUsers', (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off('getOnlineUsers');
    };
  }, [socket]);

  useEffect(() => {
    if (socket === null) return;

    const recipientId = currentChat?.members?.find((id) => id !== user?._id);
    socket.emit('sendMessage', { ...newMessage, recipientId });
  }, [newMessage]);

  useEffect(() => {
    if (socket === null) return;

    socket.on('getMessage', (res) => {
      if (currentChat?._id !== res.chatId) return;

      setMessages((prev) => [...prev, res]);
    });

    socket.on('getNotifications', (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);

      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off('getMessage');
      socket.off('getNotifications');
    };
  }, [socket, currentChat]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);

      if (response.error) {
        return console.log('Error fetching useres', response);
      }

      const pChats = response.filter((u) => {
        let ischatCreated = false;

        if (user?._id === u._id) return false;

        if (userChats) {
          ischatCreated = userChats?.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] == u._id;
          });
        }

        return !ischatCreated;
      });

      setPotentialChats(pChats);
      setAllUSers(response);
    };

    getUsers();
  }, [userChats]);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setisUserChatsLoading(true);
        setuserChatsError(null);

        const response = await getRequest(`${baseUrl}/chats/${user?._id}`);

        setisUserChatsLoading(false);

        if (response.error) {
          return setuserChatsError(response);
        }

        setUserChats(response);
      }
    };

    getUserChats();
  }, [user, notifications]);

  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);

      const response = await getRequest(
        `${baseUrl}/messages/${currentChat?._id}`
      );

      setIsMessagesLoading(false);

      if (response.error) {
        return setMessagesError(response);
      }

      setMessages(response);
    };

    getMessages();
  }, [currentChat]);

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage, file) => {
      if (!textMessage && !file) {
        console.log('You must type something or select a file...');
        return;
      }

      // Ensure textMessage is a string before appending
      console.log('Text message:', textMessage); // Log to see the content
      console.log('Sender ID:', sender._id);
      console.log('Chat ID:', currentChatId);

      const formData = new FormData();
      formData.append('chatId', currentChatId);
      formData.append('senderId', sender._id);
      formData.append('text', textMessage);

      if (file) {
        formData.append('file', file);
      }

      try {
        const response = await messagePostRequest(
          `${baseUrl}/messages/sendMessage`,
          formData
        );

        if (response.error) {
          return console.error('Error sending message', response);
        }

        setNewMessage(response);
        setMessages((prev) => [...prev, response]);
        setTextMessage('');
        if (file) setFile(null);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
    []
  );

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({
        firstId,
        secondId,
      })
    );

    if (response.error) {
      return console.log('Error creating chat', response);
    }

    setUserChats((prev) => [...prev, response]);
  }, []);

  const markAllNotificationsAsRead = useCallback((notifications) => {
    const mNotification = notifications.map((n) => {
      return { ...n, isRead: true };
    });
    setNotifications(mNotification);
  }, []);

  const markNotificationAsRead = useCallback(
    (n, userChats, user, notifications) => {
      //find chta to open
      const desiredChat = userChats.find((chat) => {
        const chatMembers = [user._id, n.senderId];
        const isDesiredChat = chat?.members.every((member) => {
          return chatMembers.includes(member);
        });

        return isDesiredChat;
      });

      //Mark notification as read
      const mNotification = notifications.map((el) => {
        if (n.senderId === el.senderId) {
          return { ...n, isRead: true };
        } else {
          return el;
        }
      });

      updateCurrentChat(desiredChat);
      setNotifications(mNotification);
    },
    []
  );

  const markThisUserNotificationAsRead = useCallback(
    (thisUserNotifications, notifications) => {
      //mark notification as read
      const mNotifications = notifications.map((el) => {
        let notification;

        thisUserNotifications.forEach((n) => {
          if (n.senderId === el.senderId) {
            notification = { ...n, isRead: true };
          } else {
            notification = el;
          }
        });
        return notification;
      });

      setNotifications(mNotifications);
    },
    []
  );

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        currentChat,
        messages,
        isMessagesLoading,
        messagesError,
        sendTextMessage,
        onlineUsers,
        notifications,
        allUsers,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        markThisUserNotificationAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
