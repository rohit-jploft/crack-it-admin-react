import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import { AvatarGroup, ListItemButton } from '@mui/material';

const ConversationList = ({ conversations, onConversationClick, selectedConversation, setConvoData, search, setSearch }) => {

  const handleConversationClick = (conversationId) => {
    onConversationClick(conversationId);
  };

  //   const filteredConversations = conversations.filter((conversation) =>
  //     conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
  //   );

  return (
    <div className="conversation-list" style={{ padding: '10px' }}>
      <TextField
        fullWidth
        label="Search Conversations"
        variant="outlined"
        margin="normal"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <List>
        {conversations.map((conversation) => (
          <ListItemButton
            key={conversation._id}
            onClick={() => {
              handleConversationClick(conversation._id);
              setConvoData(conversation);
            }}
            className={`conversation-item custom-selected-list-item ${
              conversation._id === selectedConversation ? 'active' : ''
            }`}
            style={{ cursor: 'pointer' }}
            selected={conversation._id === selectedConversation}
          >
            <ListItemAvatar>
             <AvatarGroup total={3}>
             <Avatar alt={conversation.name} src={conversation.avatar} />
             </AvatarGroup>
            </ListItemAvatar>
            <ListItemText
              primary={`${conversation.participants[0].firstName} , ${conversation.participants[1].firstName}`}
              
            />
          </ListItemButton>
        ))}
      </List>
    </div>
  );
};

export default ConversationList;
