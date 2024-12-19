import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const {
    loginUser,
    loginError,
    LoginInfo,
    loginLoading,
    updateLoginInfo,
    setLoginError,
  } = useContext(AuthContext);

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (!LoginInfo.email || !LoginInfo.password) {
      setLoginError({
        error: true,
        message: 'Both email and password are required',
      });
      return;
    }

    loginUser(e);
  };

  return (
    <div className="h-[87vh] justify-center items-center bg-white px-[230px] pt-12">
      <h2 className="helvetica text-7xl w-[80vh] font-bold bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
        A place for meaningful conversations
      </h2>
      <p className="helvetica w-[60vh] text-base mt-14 mb-5 space-x-2">
        Connect with your friends and family, build your community, and deepen
        your interests.
      </p>
      <form onSubmit={handleLoginSubmit} className=" ">
        <div className=" max-w-xs rounded-lg ">
          <div className="space-y-4">
            {/* Email Input */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-2 bg-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) =>
                updateLoginInfo({ ...LoginInfo, email: e.target.value })
              }
            />
            {/* Password Input */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-2 bg-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) =>
                updateLoginInfo({ ...LoginInfo, password: e.target.value })
              }
            />
            {/* Submit Button */}
            <button
              type="submit"
              className="w-2/6 helvetica text-base bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition duration-300"
            >
              {loginLoading ? 'Getting you in...' : 'Login'}
            </button>
            {/* Error Alert */}
            {loginError?.error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                <p>{loginError?.message}</p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
