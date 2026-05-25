import React, { forwardRef } from 'react';

const Player = forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      className="player"
      style={{
        position: 'absolute',
        width: '575px', 
        height: '523px', 
        backgroundImage: 'url(/shadow_dog.png)',
        backgroundRepeat: 'no-repeat',
        transform: 'scale(0.4)',
        transformOrigin: 'bottom left',
        left: '180px', 
        bottom: '20px', 
        zIndex: 10
      }}
    />
  );
});

export default Player;
