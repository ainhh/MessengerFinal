import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import './app.css';
import Chat from './pages/Chat';
import Register from './pages/Register';
import Login from './pages/Login';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
import NavBar from './components/NavBar'; // Assuming your NavBar is Tailwind-styled

function App() {
  const { user } = useContext(AuthContext);

  return (
    <ChatContextProvider user={user}>
      {!user && <NavBar />}
      <div className="container-fluid p-0">
        <Routes>
          <Route path="/" element={user ? <Chat /> : <Login />} />
          <Route path="/register" element={user ? <Chat /> : <Register />} />
          <Route path="/login" element={user ? <Chat /> : <Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </ChatContextProvider>
  );
}

export default App;
