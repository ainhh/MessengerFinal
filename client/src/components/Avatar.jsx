// Avatar.js (or Avatar.tsx if using TypeScript)
import React from 'react';

const Avatar = ({ name, size = '50px' }) => {
  const initial = name ? name.charAt(0).toUpperCase() : '';

  const bluePastelColors = [
    '#A8DADC',
    '#457B9D',
    '#1D3557',
    '#a9acce',
    '#A2D2FF',
    '#6D98B6',
    '#98C9E2',
    '#2A9D8F',
    '#81B3C4',
    '#B0E0E6',
    '#B3D9FF',
    '#88C8FF',
    '#6A90B1',
    '#7EC8D9',
    '#6CA0DC',
  ];

  // Determine the color index based on the first letter
  const colorIndex = initial.charCodeAt(0) % bluePastelColors.length;
  const backgroundColor = bluePastelColors[colorIndex];

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: backgroundColor,
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '18px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {initial}
    </div>
  );
};

export default Avatar;
