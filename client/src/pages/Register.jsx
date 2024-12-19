import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import loginImg from '../assets/loginImg.gif';

const Register = () => {
  const {
    registerInfo,
    updateRegisterInfo,
    registerUser,
    registerError,
    registerLoading,
  } = useContext(AuthContext);

  return (
    <div className="h-[87vh] justify-center items-center bg-white px-[230px] pt-12">
      <h2 className="helvetica text-7xl w-[80vh] font-bold bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
        A place for meaningful conversations
      </h2>
      <p className="helvetica w-[60vh] text-base mt-14 mb-5 space-x-2">
        Connect with your friends and family, build your community, and deepen
        your interests.
      </p>
      <form onSubmit={registerUser}>
        <div className=" max-w-xs rounded-lg ">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              onChange={(e) =>
                updateRegisterInfo({
                  ...registerInfo,
                  name: e.target.value,
                })
              }
              className="w-full p-2 bg-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              onChange={(e) =>
                updateRegisterInfo({
                  ...registerInfo,
                  email: e.target.value,
                })
              }
              className="w-full p-2 bg-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) =>
                updateRegisterInfo({
                  ...registerInfo,
                  password: e.target.value,
                })
              }
              className="w-full p-2 bg-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <button
              type="submit"
              className="w-2/6 helvetica text-base bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition duration-300"
            >
              {registerLoading ? 'Creating your account...' : 'Register'}
            </button>

            {registerError?.error && (
              <div className="mt-4 p-4 bg-red-200 text-red-600 rounded-lg">
                <p>{registerError?.message}</p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
