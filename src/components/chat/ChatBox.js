import React, { useEffect, useRef, useState } from 'react';
import { Paper, Box, Button, TextField, Avatar, IconButton, InputAdornment } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import pdfIcon from '../../images/pdf_icon.png';
import { scrollToBottom } from '../../utils/helper';
import FileInputIcon from '../FileInputIcon';
import { BASE_URL } from '../../constant';
// import VoiceMessage from '../VoiceMessage';
const ChatBox = ({ messages, onSendMessage, selectedConvoId, setFile, file }) => {
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef(null);

  const handleSendMessage = () => {
   
    if (newMessage.trim() === '') return;
    
    onSendMessage(newMessage);

    setNewMessage('');
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  const userId = localStorage.getItem('userId');
  return (
    <Paper elevation={3} className="chat-box">
      <div ref={scrollRef} className="message-list">
        {messages.map((message) => (
          <div
            key={message._id}
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
            className={`message ${message?.sender?._id === userId ? 'outgoing' : 'incoming'}`}
          >
            <div className="message-sender" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              {message.sender._id !== userId && (
                <Avatar sizes="large">{message?.sender?.firstName[0]?.toUpperCase()}</Avatar>
              )}
            </div>
            {message?.type?.startsWith('image') ? (
              <div className="message-text" style={{ marginLeft: '7px' }}>
                <img src={`${BASE_URL}${message.media}`} alt="d" />
              </div>
            ) : message?.type?.startsWith('audio') ? (
              <div className="message-text" style={{ marginLeft: '7px' }}>
                <audio controls>
                  <source src={`${BASE_URL}${message?.media}`} type="audio/mpeg" />
                  <track src="" kind="subtitles" default />
                </audio>
              </div>
            ) : message?.type?.startsWith('application/pdf') ? (
              <button
                onClick={() => window.open(`${BASE_URL}${message?.media}`, '_blank')}
                style={{ width: '130px', color: 'grey', padding: '12px', border: 0 }}
              >
                <img alt="pdf-icon" src={pdfIcon} />
                Open File
              </button>
            ) : (
              <div className="message-text" style={{ marginLeft: '7px' }}>
                {message?.content}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="message-input">
        <TextField
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={file ? file.name : newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          InputProps={{
            endAdornment: file && (
              <InputAdornment position="start" sx={{ cursor: 'pointer' }} onClick={() => {
                setFile()
                setNewMessage('')
              }}>
                <CloseIcon />
              </InputAdornment>
            ),
          }}
        />
        <FileInputIcon file={file} setFile={(value) => {
          setFile(value)
          setNewMessage(value?.name)
        }} />
        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </div>
    </Paper>
  );
};

export default ChatBox;
