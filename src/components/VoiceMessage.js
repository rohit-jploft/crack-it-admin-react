// import React, { useState, useRef } from 'react';

// const VoiceMessage = ({ audioUrl , content}) => {
//   const audioRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);

//   const toggleAudio = () => {
//     if (audioRef.current.paused) {
//       audioRef.current.play();
//       setIsPlaying(true);
//     } else {
//       audioRef.current.pause();
//       setIsPlaying(false);
//     }
//   };

//   return (
//     <div>
//       {/* <button onClick={toggleAudio}>
//         {isPlaying ? 'Pause' : 'Play'}
//       </button> */}
//       <audio ref={audioRef} controls>
//         <source src={audioUrl} type="audio/mpeg" />
//         Your browser does not support the audio element.
//       </audio>
//       <div className="message-text" style={{ marginLeft: '7px' }}>
//         {content}
//       </div>
//     </div>
//   );
// };

// export default VoiceMessage;
