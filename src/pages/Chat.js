import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { io } from 'socket.io-client';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ConversationList from '../components/chat/ConversationList';
import ChatBox from '../components/chat/ChatBox';
import VoiceMessage from '../components/VoiceMessage';

import { getConversation, getConvoMessage, searchConvoApi, sendMessage } from '../data/chat';
import { BASE_URL } from '../constant';
import Socket from '../data/socket';

const ChatPage = () => {
  const { selectConvo } = useParams();
  const [selectedConversation, setSelectedConversation] = useState(selectConvo || null);
  const [convoData, setConvoData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageSent, setMessageSent] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [file, setFile] = useState();
  const [newMsgObj, setNewMsgObj] = useState();

  useEffect(() => {
    Socket.emit('addUser', localStorage.getItem('userId'));
    Socket.on('getUsers', (users) => {
      setOnlineUsers(users);
      console.log(users, 'online users');
    });
  }, []);

  const getConvo = async () => {
    const data = await getConversation();
    setConversations(data);
    console.log(data);
  };
  const searchConvo = async () => {
    const data = await searchConvoApi(search);
    setConversations(data);
  };

  const getConvoMessages = async () => {
    const data = await getConvoMessage(selectedConversation);
    setMessages(data);
    console.log('mesgga', data);
  };

  useEffect(() => {
    getConvoMessages();
    setMessageSent(false);
    Socket.emit('join_room', selectedConversation);
  }, [selectedConversation, Socket, newMsgObj, messageSent]);
  useEffect(() => {
    getConvo();
  }, []);
  useEffect(() => {
    Socket.on('getMessage', (newIncomingMsg) => {
      console.log('helloooooooooooooo');
      console.log(newIncomingMsg, 'new message');
      setNewMsgObj(newIncomingMsg);
      //   setMessages([
      //     ...messages,
      //     {
      //       sender: { _id: newIncomingMsg.sender },
      //       content: newIncomingMsg.content,
      //       chat: selectedConversation,
      //       _id: newIncomingMsg._id,
      //     },
      //   ]);
    });
  }, [Socket]);
  useEffect(() => {
    searchConvo();
  }, [search]);

  const handleConversationClick = (conversationId) => {
    setSelectedConversation(conversationId);
  };

  const handleSendMessage = async (messageText) => {
    // Send the message to the selected conversation
    // Update the 'messages' state with the new message
    console.log("button clicked")
    const userId = localStorage.getItem('userId');
    const newMessage = {
      sender: {
        _id: userId,
      },
      type: file ? 'file' : 'text',
      content: messageText,
      chat: selectedConversation,
    };
  
    if (file) {
      newMessage.audio = file
    };
    console.log(messageText, "inside msg text");
    const sentMsg = await sendMessage(selectedConversation, file ? file.name : messageText, file || null)
      .then((res) => {
        setMessages([...messages, newMessage]);
        setFile();
        // const res =
        Socket.emit('sendMessage', {
          chat: selectedConversation,
          content: messageText,
          sender: userId,
          _id: res?._id,
        });
        setMessageSent(true);
        // setNewMessage('');
      })
      .catch((err) => {
        console.log(err);
      });
    // if (scrollRef.current) {
    //   scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    // }
  };

  return (
    <Container maxWidth="lg">
      <Helmet>
        <title>Chat</title>
      </Helmet>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Paper elevation={3} className="conversation-list-paper">
            <ConversationList
              conversations={conversations}
              onConversationClick={(value) => handleConversationClick(value)}
              selectedConversation={selectedConversation}
              setConvoData={(data) => setConvoData(data)}
              search={search}
              setSearch={(value) => setSearch(value)}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={12}>
          <Paper elevation={3} className="chat-box-paper">
            {selectedConversation && (
              <ChatBox
                file={file}
                setFile={(value) => setFile(value)}
                messages={messages}
                newMsgSent={(value) => setMessageSent(value)}
                onSendMessage={(value) => handleSendMessage(value)}
                selectedConvoId={selectedConversation}
              />
            )}
          </Paper>
         {conversations && conversations.length <=0 && <p className='text-center' style={{textAlign:"center"}}>No chat Available</p>}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChatPage;
