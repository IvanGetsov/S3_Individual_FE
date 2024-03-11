import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatsService from '../services/ChatsService'
import UserService from '../services/UserService';
import MessageService from '../services/MessagesService';

const FirstMessagePage = () => {
const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

    useEffect(()=>{
        const accessToken = localStorage.getItem('access_token');

    if (accessToken) {
      UserService.getUserByAccessToken(accessToken)
        .then((response) => {
          setUser(response.data);
        });
    }
    }, [])



  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      advert: {
        id: location.state?.advert.id
      }
    };

  
    const result = await ChatsService.create(data);
    const chatId = result.data.id;
  
    const newMessage = {
      chat: {
        id: chatId,
      },
      sender: {
        id: user.id,
      },
      recipient: {
        id: location.state?.advert.carOwner.id,
      },
      text: message,
    };



  
    await MessageService.create(newMessage);
  
    navigate(`/chat/${chatId}`);
    setMessage('');
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={handleInputChange}
        placeholder="Type your message..."
        rows={10}
        cols={50}
      />
      <br />
      <button type="submit">Send Message</button>
    </form>
  );
};

export default FirstMessagePage;
