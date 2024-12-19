import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Notification from './chat/Notification';

const NavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <nav className="bg-white px-[200px] sticky top-0 z-10 font-PrimaryFont">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center text-gray-800 hover:text-blue-500"
        >
          <svg
            height="50px"
            width="50px"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            className="mr-2"
          >
            <defs>
              <radialGradient
                cx="19.2474387%"
                cy="99.4651948%"
                fx="19.2474387%"
                fy="99.4651948%"
                id="radialGradient-1"
                r="108.959588%"
              >
                <stop offset="0%" stopColor="#0099FF" />
                <stop offset="60.9753877%" stopColor="#A033FF" />
                <stop offset="93.482299%" stopColor="#FF5280" />
                <stop offset="100%" stopColor="#FF7061" />
              </radialGradient>
            </defs>
            <g
              fill="none"
              fillRule="evenodd"
              id="logo"
              stroke="none"
              strokeWidth="1"
            >
              <rect
                fill="#FFFFFF"
                fillOpacity="0"
                height="1024"
                id="bounding-box"
                width="1024"
                x="0"
                y="0"
              />
              <g id="logo">
                <path
                  d="M512,122 C286.668,122 112,287.056 112,510 C112,626.6144 159.792,727.3824 237.6224,796.984 C244.156,802.832 248.1,811.024 248.368,819.792 L250.5464,890.944 C251.2424,913.64 274.6856,928.408 295.4536,919.24 L374.848,884.192 C381.5784,881.224 389.12,880.672 396.212,882.624 C432.696,892.656 471.5264,898 512,898 C737.332,898 912,732.944 912,510 C912,287.056 737.332,122 512,122 Z"
                  fill="url(#radialGradient-1)"
                  id="Path"
                />
                <path
                  d="M271.8016,623.4688 L389.3016,437.0528 C407.992,407.3968 448.016,400.0128 476.06,421.0448 L569.5136,491.1352 C578.088,497.5672 589.8856,497.5328 598.424,491.0528 L724.6376,395.2648 C741.484,382.4808 763.4736,402.6408 752.2,420.5312 L634.7,606.9488 C616.008,636.6032 575.984,643.9888 547.9416,622.9552 L454.4856,552.8632 C445.912,546.4328 434.1136,546.4672 425.576,552.9472 L299.3616,648.7352 C282.516,661.5184 260.5256,641.3584 271.8016,623.4688 Z"
                  fill="#FFFFFF"
                  id="Path"
                />
              </g>
            </g>
          </svg>
        </Link>

        {user && (
          <span className="text-yellow-500 text-sm">
            Logged in as {user?.name}
          </span>
        )}

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Notification />
              <Link
                to="/login"
                onClick={() => logoutUser()}
                className="text-black hover:text-red-500"
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-black hover:text-blue-500 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-800 hover:text-green-500 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
