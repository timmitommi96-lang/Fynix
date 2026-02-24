import React, { useState } from 'react';

const emotions = {
  happy: '😊',
  angry: '😡',
  neutral: '😐',
  laughing: '😂',
  crying: '😭',
  sleeping: '😴',
  thinking: '🤔',
  throne: '👑',
};

function Mascot({ emotion = 'neutral' }) {
  const [currentEmotion, setCurrentEmotion] = useState(emotion);

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      fontSize: '3rem',
      transition: 'transform 0.3s',
    }}
    onClick={() => setCurrentEmotion('happy')}
    >
      {emotions[currentEmotion] || emotions.neutral}
    </div>
  );
}

export default Mascot;