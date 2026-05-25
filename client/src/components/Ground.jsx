import React, { forwardRef } from 'react';

const Ground = forwardRef((props, ref) => {
  return (
    <div className="ground-container">
      <div 
        ref={ref}
        className="ground" 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '200%',
          height: '20px',
          background: 'repeating-linear-gradient(45deg, #3d2b1f, #3d2b1f 20px, #5c4033 20px, #5c4033 40px)',
          zIndex: 4
        }}
      />
    </div>
  );
});

export default Ground;
