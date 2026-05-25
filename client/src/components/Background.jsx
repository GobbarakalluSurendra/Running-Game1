import React, { forwardRef } from 'react';

const Background = forwardRef((props, ref) => {
  return (
    <div className="bg-container">
      <div 
        ref={ref}
        className="parallax-bg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/shadow.jpg)',
          backgroundSize: 'auto 100%',
          backgroundRepeat: 'repeat-x',
          opacity: 0.2,
          zIndex: 1
        }}
      />
    </div>
  );
});

export default Background;
