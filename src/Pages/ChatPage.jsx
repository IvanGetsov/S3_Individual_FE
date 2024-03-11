import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import { v4 as uuidv4 } from 'uuid';
import ChatsService from '../services/ChatsService';
import MessageService from '../services/MessagesService';
import UserService from '../services/UserService';
import AdvertsService from '../services/AdvertsService';
import '../styles/ChatPage.css';

const ChatPage = () => {
  const [user, setUser] = useState(null);
  const [stompClient, setStompClient] = useState();
  const [message, setMessage] = useState('');
  const [messagesReceived, setMessagesReceived] = useState([]);
  const { chatId } = useParams();
  const [chat, setChat] = useState();
  const [advert, setAdvert] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');

    if (accessToken) {
      UserService.getUserByAccessToken(accessToken).then((response) => {
        setUser(response.data);
      });
    }

    setupStompClient();
    loadMessages();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messagesReceived]);

  useEffect(() => {
    if (chat && chat.advert && chat.advert.id) {
      fetchAdvert(chat.advert.id);
    }
  }, [chat]);



  const setupStompClient = () => {
    const stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      stompClient.subscribe('/topic/publicmessages', (data) => {
        onMessageReceived(data);
      });

      stompClient.subscribe(`/user/${chatId}/queue/inboxmessages`, (data) => {
        onMessageReceived(data);
      });
    };

    stompClient.activate();
    setStompClient(stompClient);
  };

  const loadMessages = async () => {
    try {
      const response = await ChatsService.get(chatId);
      const chatData = response.data;
      const existingMessages = chatData.messages || [];
      setMessagesReceived(existingMessages);
      setChat(chatData);

    } catch (error) {
      console.error('Error fetching chat:', error);
    }
  };

  const onMessageReceived = (data) => {
    const message = JSON.parse(data.body);
    setMessagesReceived((prevMessages) => [...prevMessages, message]);  
  };

  const sendMessage = async () => {
      const userId1 = messagesReceived.length > 0 && messagesReceived[0]?.sender?.id;
      const userId2 = messagesReceived.length > 0 && messagesReceived[0]?.recipient?.id;

      let recipientId = 0;
      let senderId = user.id;
      if (userId1 === user.id) {
        recipientId = userId2;
      } else if (userId2 === user.id) {
        recipientId = userId1;
      }

      const payload = { id: uuidv4(), chatId: chatId, sender: { id: senderId }, text: message };

      try {
        stompClient.publish({
          destination: `/app/send`,
          body: JSON.stringify(payload),
        });

      const newMessage = {
        chat: { id: chatId },
        sender: { id: senderId },
        recipient: { id: recipientId },
        text: message,
      };

      await MessageService.create(newMessage);

      await setMessage('');
    } catch (error) {
      console.error('Error sending or saving message:', error);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fetchAdvert = async (advertId) => {
    try {
      const response = await AdvertsService.get(advertId);
      setAdvert(response.data);
    } catch (error) {
      console.error('Error fetching advert:', error);
    }
  };

  return (
    <div className="page-content page-container vw-100">
      <div className="padding">
        <div className="row container d-flex justify-content-center">
          <div className="col-md-15">
            <div className="card card-bordered chat-container">
              <div className="card-header">
                {advert && (
                  <>
                    <img
                      className="advert-picture"
                      src={advert.picture ? `data:image/png;base64,${JSON.parse(advert.picture).picture}` : "/src/Images/default_car.png"}
                      alt="Car Image"
                    />
                    <h4 className="card-title">{advert.car.brand} {advert.car.model}</h4>
                  </>
                )}
              </div>
              <div className="ps-container ps-theme-default ps-active-y chat-content" id="chat-content">
                {messagesReceived.map((msg, index) => (
                  <div
                    key={index}
                    className={`d-flex media-chat ${msg.sender.id === user.id ? 'media-chat-reverse' : ''}`}
                  >
                    {msg.sender.picture && (
                      <img
                        className="avatar me-3"
                        src={`data:image/png;base64,${JSON.parse(msg.sender.picture).picture}`}
                        alt="..."
                      />
                    )}
                    {!msg.sender.picture && (
                      <img
                        src="/src/Images/profilePicture.png"
                        alt="Default Profile"
                        className="avatar me-3 rounded-circle"
                      />
                    )}
                    <div className="media-body">
                      <p>{msg.text}</p>
                    </div>
                    {/* {msg.sender.id === user.id && senderPicture && (
                      <img
                        className="avatar ms-3"
                        src={`data:image/png;base64,${JSON.parse(senderPicture).picture}`}
                        alt="..."
                      />
                    )}
                    {msg.sender.id === user.id && !senderPicture && (
                      <img
                        src="/src/Images/profilePicture.png"
                        alt="Default Profile"
                        className="avatar me-3 rounded-circle"
                      />
                    )} */}
                  </div>
                ))}
                <div ref={messagesEndRef}></div>
              </div>
              <div className="publisher bt-1 border-light">
                <textarea
                  className="publisher-input"
                  placeholder="Write something"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button className="btn btn-primary" onClick={sendMessage}>Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
