import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import { usefetchRecipientUser } from '../../hooks/useFetchRecipientUser';
import moment from 'moment';
import InputEmoji from 'react-input-emoji';
import Avatar from '../Avatar';
import { MdCall, MdDelete } from 'react-icons/md';
import { IoVideocam } from 'react-icons/io5';
import { LuFileImage } from 'react-icons/lu';
import {
  FaRegFileWord,
  FaRegFilePdf,
  FaRegFilePowerpoint,
  FaRegFile,
} from 'react-icons/fa6';
import { HiMiniXMark } from 'react-icons/hi2';
import { IoSend } from 'react-icons/io5';
import hiImg from '../../assets/hiImg.gif';

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const {
    currentChat,
    messages,
    isMessagesLoading,
    sendTextMessage,
    deleteChat,
    onlineUsers,
  } = useContext(ChatContext);

  const { recipientUser } = usefetchRecipientUser(currentChat, user);
  const [textMessage, setTextMessage] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const scroll = useRef();
  const [fullscreenImage, setFullscreenImage] = useState(null);

  console.log('me: ', user?.name);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (textMessage.trim() || file) {
      sendTextMessage(textMessage, user, currentChat._id, setTextMessage, file);
      setTextMessage('');
      setFile(null);
      setFilePreview(null);
    }
  };

  const handleImageClick = (imageUrl) => {
    setFullscreenImage(imageUrl);
  };

  const closeFullscreenImage = () => {
    setFullscreenImage(null);
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    if (uploadedFile) {
      if (uploadedFile.type.startsWith('image')) {
        setFilePreview(URL.createObjectURL(uploadedFile));
      } else {
        setFilePreview(null);
      }
    }
  };

  const getFormattedTime = (date) => {
    return moment(date).format('MMMM D, YYYY h:mm A');
  };

  if (!recipientUser)
    return (
      <div className="flex items-center justify-center h-[85vh] text-center overflow-hidden relative">
        <img
          src={hiImg}
          alt="Login Illustration"
          className="w-2/4 h-auto rounded-lg absolute right-0"
        />
        <h1 className="z-20 p-1 text-2xl">Hello!</h1>
        <h1 className="z-20 text-2xl"> {user?.name}</h1>
      </div>
    );

  const isEmpty = messages && messages.length === 0;

  let lastTimestamp = null;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf':
        return <FaRegFilePdf className="text-gray-500 w-6 h-6" />;
      case 'doc':
      case 'docx':
        return <FaRegFileWord className="text-gray-500 w-6 h-6" />;
      case 'ppt':
      case 'pptx':
        return <FaRegFilePowerpoint className="text-gray-500 w-6 h-6" />;
      default:
        return <FaRegFile className="text-gray-500 w-6 h-6" />;
    }
  };

  return (
    <div className="flex flex-col h-[95vh] p-1 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center border-b pb-4  mb-4 bg-white px-2 py-3">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar name={recipientUser?.name} size="40px" />
            {onlineUsers?.some(
              (user) => user?.userId === recipientUser?._id
            ) && (
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{recipientUser?.name}</h2>
            <p className="text-xs text-gray-500">
              {onlineUsers?.some((user) => user?.userId === recipientUser?._id)
                ? 'Active'
                : null}
            </p>
          </div>
        </div>
        <div className="flex gap-4 text-gray-600">
          <MdCall className="w-6 h-6 cursor-pointer" />
          <IoVideocam className="w-6 h-6 cursor-pointer" />
          <MdDelete
            className="w-6 h-6 cursor-pointer"
            onClick={() => deleteChat(currentChat._id)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 px-3">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-lg text-gray-600">
              No messages yet. Start a conversation!
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isCurrentUser = message?.senderId === user?._id;
            const showTimestamp =
              !lastTimestamp ||
              moment(message.createdAt).diff(lastTimestamp, 'hours') >= 1;
            if (showTimestamp) lastTimestamp = moment(message.createdAt);

            return (
              <div key={index} ref={scroll}>
                {showTimestamp && (
                  <div className="text-center text-xs text-gray-500 mb-4 mt-10">
                    {moment(message.createdAt).isBefore(moment().startOf('day'))
                      ? moment(message.createdAt).format('MMM D, YYYY, h:mm A') // Show date and time if older than a day
                      : moment(message.createdAt).format('h:mm A')}{' '}
                  </div>
                )}

                <div
                  className={`group flex items-end ${
                    isCurrentUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {!isCurrentUser && (
                    <Avatar
                      name={recipientUser?.name}
                      size="30px"
                      className="mr-2"
                    />
                  )}
                  <div className="relative flex flex-col max-w-[75%] space-y-2">
                    {/* Message Bubble */}
                    <div
                      className={`flex flex-col ${
                        isCurrentUser ? 'items-end' : 'items-start pl-2'
                      }`}
                    >
                      {/* Text Message */}
                      {message.text && (
                        <div
                          className={`p-3 rounded-3xl relative group-hover:bg-opacity-90 ${
                            isCurrentUser
                              ? 'bg-blue-500 text-white self-end'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          {message.text}
                          {/* Tooltip for time */}
                          <div
                            className={`absolute hidden group-hover:flex px-2 py-1 bg-gray-100 text-black text-xs rounded shadow bottom-full mb-1 ${
                              isCurrentUser ? 'right-0' : 'left-0'
                            } max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap`}
                          >
                            {getFormattedTime(message.createdAt)}
                          </div>
                        </div>
                      )}

                      {/* Image Message */}
                      {message.file?.mimetype.startsWith('image') && (
                        <div
                          className={`mb-2 ${isCurrentUser ? 'ml-2' : 'mr-2'}`}
                        >
                          <img
                            src={`http://localhost:5000/${message.file.path}`}
                            alt={message.file.filename}
                            className="max-w-[200px] max-h-[200px] object-cover rounded-lg shadow mt-2"
                            onClick={() =>
                              handleImageClick(
                                `http://localhost:5000/${message.file.path}`
                              )
                            }
                          />
                          <div
                            className={`absolute hidden group-hover:flex px-2 py-1 bg-gray-100 text-black text-xs rounded shadow bottom-full mb-1 ${
                              isCurrentUser ? 'right-0' : 'left-0'
                            } max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap`}
                          >
                            {getFormattedTime(message.createdAt)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* File Message */}
                    {message.file &&
                      !message.file.mimetype.startsWith('image') && (
                        <div className="p-3 rounded-2xl flex items-center gap-2 bg-gray-200 hover:bg-gray-300">
                          <div className="p-2 bg-gray-200 rounded-full">
                            {getFileIcon(message.file.filename)}{' '}
                          </div>
                          <a
                            href={`http://localhost:5000/${message.file.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            {message.file.filename}
                            <div
                              className={`absolute hidden group-hover:flex px-2 py-1 bg-gray-100 text-black text-xs rounded shadow bottom-full mb-1 ${
                                isCurrentUser ? 'right-0' : 'left-0'
                              } max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap`}
                            >
                              {getFormattedTime(message.createdAt)}
                            </div>
                          </a>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {file && (
        <div className="flex items-center space-x-2 mx-7 m-2 bg-gray-50 p-2 rounded-lg shadow-md">
          {filePreview ? (
            <div className="w-12 h-12 bg-gray-200 rounded-md">
              <img
                src={filePreview}
                alt="file preview"
                className="object-cover w-full h-full rounded-md "
              />
            </div>
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
              {getFileIcon(file.name)}{' '}
            </div>
          )}
          <div className="flex-1 text-gray-700 truncate text-sm pl-2">
            {file.name}
          </div>
          <button
            onClick={() => {
              setFile(null);
              setFilePreview(null);
            }}
            className="text-red-500 hover:text-red-700 pr-2 opacity-100"
          >
            <HiMiniXMark className="w-5 h-5" />
          </button>
        </div>
      )}

      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={closeFullscreenImage}
        >
          <img
            src={fullscreenImage}
            alt="Fullscreen"
            className="max-w-full max-h-full"
          />
          <button
            onClick={closeFullscreenImage}
            className="absolute top-4 right-4 text-white text-2xl"
          >
            &times;
          </button>
        </div>
      )}
      <div className="flex items-center gap-2 px-2 py-2 border-t bg-white">
        {/* {filePreview && (
          <div className="relative w-20 h-20">
            <img
              src={filePreview}
              alt="file preview"
              className="w-full h-full object-cover rounded-md"
            />
            <button
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
              onClick={() => setFile(null)}
            >
              <HiMiniXMark className="w-4 h-4" />
            </button>
          </div>
        )} */}
        <input
          type="file"
          className="hidden"
          id="file-input"
          onChange={handleFileChange}
        />
        <label htmlFor="file-input" className="cursor-pointer">
          <LuFileImage className="w-6 h-6 text-gray-600" />
        </label>
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full border"
        />
        <button onClick={handleSendMessage} className=" text-blue-500 py-1">
          <IoSend className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
