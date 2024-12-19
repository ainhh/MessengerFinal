import { createContext, useCallback, useEffect, useState } from 'react';
import { baseUrl, postRequest } from '../utils/services';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [LoginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });

  console.log('Userr', user);
  console.log('loginInfo', LoginInfo);
  console.log('Register Info:', registerInfo);
  console.log('Request Body:', JSON.stringify(registerInfo));

  useEffect(() => {
    const user = localStorage.getItem('User');

    setUser(JSON.parse(user));
  }, []);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);

  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();

      setRegisterLoading(true);
      setRegisterError(null);

      const response = await postRequest(
        `${baseUrl}/users/register`,
        JSON.stringify(registerInfo)
      );

      setRegisterLoading(false);

      if (response.error) {
        return setRegisterError(response);
      }

      localStorage.setItem('User', JSON.stringify(response));
      setUser(response);
    },
    [registerInfo]
  );

  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();

      if (!LoginInfo.email || !LoginInfo.password) {
        return setLoginError('Email or password is missing');
      }

      setLoginLoading(true);
      setLoginError(null);

      const response = await postRequest(
        `${baseUrl}/users/login`,
        JSON.stringify(LoginInfo)
      );

      setLoginLoading(false);

      if (response.error) {
        return setLoginError(response.message); // Display error message
      }

      localStorage.setItem('User', JSON.stringify(response));
      setUser(response);
    },
    [LoginInfo]
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem('User');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        registerLoading,
        logoutUser,
        loginUser,
        loginError,
        LoginInfo,
        loginLoading,
        updateLoginInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
