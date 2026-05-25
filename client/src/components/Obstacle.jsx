import React, { forwardRef } from 'react';

const Obstacle = forwardRef(({ id }, ref) => {
  return (
    <div
      ref={ref}
      className={`obstacle obstacle-${id}`}
      style={{
        position: 'absolute',
        width: '40px',
        height: '40px',
        backgroundColor: '#7a4f1c',
        bottom: '20px', // Sit on the ground
        left: '0px', // Aligns with translateX logic
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        zIndex: 5
      }}
    />
  );
});

export default Obstacle;
