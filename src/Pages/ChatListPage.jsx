import React, { useEffect, useState } from 'react';
import ChatsService from '../services/ChatsService';
import UserService from '../services/UserService';
import AdvertsService from '../services/AdvertsService';
import '../styles/ChatListPage.css';

const ChatListPage = () => {
  const [user, setUser] = useState(null);
  const [userChats, setUserChats] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');

    if (accessToken) {
      UserService.getUserByAccessToken(accessToken)
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
        });
    }
  }, []);

  useEffect(() => {
    if (user && user.id) {
      ChatsService.getUsersChats(user.id)
        .then((response) => {
          setUserChats(response.data);
        })
        .catch((error) => {
          console.error('Error fetching user chats:', error);
        });
    }
  }, [user]);

  const [adverts, setAdverts] = useState([]);

  useEffect(() => {
    // Fetch advert details for each chat
    const fetchAdvertDetails = async () => {
      const advertDetails = await Promise.all(
        userChats.map(async (chat) => {
          if (chat.advert && chat.advert.id) {
            const response = await AdvertsService.get(chat.advert.id);
            return response.data;
          }
          return null;
        })
      );

      setAdverts(advertDetails);
    };

    fetchAdvertDetails();
  }, [userChats]);

  return (
    <div className="chat-list-container">
      <h2>Your Chats</h2>
      {userChats.length > 0 ? (
        <ul>
          {userChats.map((chat, index) => (
            <li key={chat.id} className="chat-item">
              <div className="picture-container">
                {adverts[index] && adverts[index].picture ? (
                  <img
                    src={`data:image/png;base64,${JSON.parse(adverts[index].picture).picture}`}
                    alt="Advert"
                    className="advert-picture"
                  />
                ) : (
                  <img
                    src="/src/Images/default_car.png"
                    alt="Default Advert Image"
                    className="advert-picture"
                  />
                )}
              </div>
              <div className="chat-content">
                {adverts[index] && (
                  <>
                    <span className="chat-title">{adverts[index].car.brand} {adverts[index].car.model}</span>
                    <p className="owner-name">Car Owner: {adverts[index].carOwner.name}</p>
                  </>
                )}
                <a href={`/chat/${chat.id}`} className="chat-button">Go to chat</a>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-chats-message">No chats available</p>
      )}
    </div>
  );
};


export default ChatListPage;
