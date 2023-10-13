import React, { useEffect, useRef, useState } from 'react';
import { Paper, Box, Button, TextField, Avatar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
        {messages.map((message) => {
          return (
            <div
              key={message._id}
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
              className={`message ${message.sender._id === userId ? 'outgoing' : 'incoming'}`}
            >
              <div className="message-sender" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                {message.sender._id !== userId && (
                  <Avatar sizes="large">{message.sender.firstName[0].toUpperCase()}</Avatar>
                )}
                {/* <b>{message.sender._id !== userId && message.sender.firstName}</b> */}
              </div>
              {/* {message?.type === 'file' ? (
                <audio controls>
                  <source src={`${BASE_URL}${message?.media}`} type="audio/mpeg" />
                  <track label="English" kind="subtitles" srcLang="en" default />
                </audio>
              ) : ( */}
                <div className="message-text" style={{ marginLeft: '7px' }}>
                  {message.content}
                </div>
              {/* )} */}
              {/* <span>{message.createdAt}</span> */}
            </div>
          );
        })}
      </div>
      <div className="message-input">
        {/* <div> */}
        {/* {file && (
            <>
              <span>{file.name}</span>
              <IconButton onClick={() => setFile({})}>
                <CloseIcon />
              </IconButton>
            </>
          )} */}

        <TextField
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
        />
        {/* </div> */}

        <FileInputIcon file={file} setFile={setFile} />
        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </div>
    </Paper>
  );
};

export default ChatBox;
