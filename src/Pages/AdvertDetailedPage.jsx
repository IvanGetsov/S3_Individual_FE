import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdvertService from '../services/AdvertsService';
import ChatsService from '../services/ChatsService';
import UserService from '../services/UserService';
import '../styles/AdvertDetailsPage.css';

function AdvertDetailPage() {
  const [chat, setChat] = useState()
  const [user, setUser] = useState(null);
  const { advertId } = useParams();
  const [advert, setAdvert] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');

    if (accessToken) {
      UserService.getUserByAccessToken(accessToken)
        .then((response) => {
          setUser(response.data);
        });
    }

    if (advertId) {
      AdvertService.get(advertId)
        .then((response) => {
          setAdvert(response.data);
          console.log(response);
        })
        .catch((error) => {
          console.error('Error fetching advert details:', error);
        });
    } 
  }, [advertId]);

  if (!advert) {
    return <p>Loading...</p>;
  }
  
  const handleContactClick = async () => {
    const senderId = user.id; 
    const recipientId = advert.carOwner.id;
  
    try {
      const response = await ChatsService.checkChatExistence(advertId, senderId, recipientId);
      const chatExists = response.data;
  
      if (chatExists) {
        console.log('Chat already exists');

        const chatResponse = await ChatsService.getChatByAdvertAndUsers(advertId, senderId, recipientId);
        const chat = chatResponse.data;

        navigate(`/chat/${chat.id}`);
      } else {
        navigate('/firstMessage', { state: { advert: advert } });
      }
    } catch (error) {
      console.error('Error checking chat existence or fetching chat:', error);
    }
  };
  

  return (
    <div className="container mt-4">
      <h2 className="mt-5">Advert Details</h2>
      <div className="advert-details-container">
        <div className="picture-container">
          <img
            src={advert.picture ? `data:image/png;base64,${JSON.parse(advert.picture).picture}` : "/src/Images/default_car.png"}
            alt="Car Image"
            className="card-img-top"
          />
        </div>
        <div className="advert-details">
          <h5 className="card-title">
            {advert.car.brand} {advert.car.model}
          </h5>
          <p className="card-text">Price per Day: ${advert.pricePerDay}</p>
          <p>Available From: {advert.availableFrom}</p>
          <p>Maximum Available Days: {advert.maximumAvailableDays}</p>

          <div className="owner-section mt-4">
            <div className="profile-picture-container">
              {advert.carOwner && (
                <>
                  {advert.carOwner.picture ? (
                    <img
                      src={`data:image/png;base64,${JSON.parse(advert.carOwner.picture).picture}`}
                      alt="User Profile"
                      className="profilePictureAdvert rounded-circle"
                    />
                  ) : (
                    <img
                      src="/src/Images/profilePicture.png"
                      alt="Default Profile"
                      className="profilePictureAdvert rounded-circle"
                    />
                  )}
                </>
              )}
            </div>
            <div className="owner-info">
              <p className="user-name">Owner: {advert.carOwner.name}</p>
              <button onClick={handleContactClick} className="btn btn-primary">Contact</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdvertDetailPage;
