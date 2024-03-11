import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import AdvertService from '../services/AdvertsService';
import UserService from '../services/UserService';
import { useNavigate } from 'react-router-dom';
import CreateAdvertModal from '../components/CreateAdvertModal';
import UpdateAdvertModal from '../components/UpdateAdvertModal';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../styles/UserAdvertsPage.css';

const UserAdvertsPage = () => {
  const initialAdvertState = {
    id: 0,
    carOwner: {
      id: 0,
    },
    car: {
      brand: '',
      model: '',
      yearOfConstruction: undefined,
      colour: '',
      kilometers: undefined,
      picture: '',
    },
    availableFrom: undefined,
    maximumAvailableDays: undefined,
    pricePerDay: undefined,
  };

  const [adverts, setAdverts] = useState([]);
  const [originalAdverts, setOriginalAdverts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedAdvert, setSelectedAdvert] = useState(initialAdvertState);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
          const response = await UserService.getUserByAccessToken(accessToken);
          setUser(response.data);

          AdvertService.getAdvertsByUserId(response.data.id)
            .then((advertsResponse) => {
              setOriginalAdverts(advertsResponse.data);
              setAdverts(advertsResponse.data);
            })
            .catch((advertsError) => {
              console.error('Error fetching user adverts:', advertsError);
            });
        }
      } catch (userError) {
        console.error('Error fetching user details:', userError);
      }
    };

    fetchUserData();
  }, []);

  const handleCreateAdvert = (advertData) => {
    AdvertService.create(advertData)
      .then((response) => {
        console.log('Advert created successfully:', response.data);
        fetchAndSetAdverts();
      })
      .catch((error) => {
        console.error('Error creating advert:', error);
      });

    handleCloseCreateModal();
  };

  const handleUpdateAdvert = (advertData) => {
    AdvertService.update(selectedAdvert.id, advertData)
      .then((response) => {
        console.log('Advert updated successfully:', response.data);
        fetchAndSetAdverts();
      })
      .catch((error) => {
        console.error('Error updating advert:', error);
      });

    handleCloseUpdateModal();
  };

  const handleDeleteAdvert = (advertId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this advert?");
    if (isConfirmed) {
      AdvertService.remove(advertId)
        .then(() => {
          console.log(`Advert with ID ${advertId} deleted successfully`);
          const updatedAdverts = adverts.filter((advert) => advert.id !== advertId);
          setAdverts(updatedAdverts);
        })
        .catch((error) => {
          console.error(`Error deleting advert with ID ${advertId}:`, error);
        });
    }
  };

  const fetchAndSetAdverts = () => {
    AdvertService.getAdvertsByUserId(user.id)
      .then((advertsResponse) => {
        setAdverts(advertsResponse.data);
      })
      .catch((advertsError) => {
        console.error('Error fetching user adverts:', advertsError);
      });
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedAdvert(initialAdvertState);
  };

  const handleCreateAdvertClick = () => {
    setShowCreateModal(true);
  };

  const handleEditAdvert = (advert) => {
    setSelectedAdvert(advert);
    setShowUpdateModal(true);
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
    const filteredAdverts = originalAdverts.filter(
      (advert) => advert.pricePerDay >= value[0] && advert.pricePerDay <= value[1]
    );
    setAdverts(filteredAdverts);
  };

  return (
    <div className="user-adverts-container container mt-4">
      <h2 className="mt-5">User Adverts Page</h2>

      <div className="mb-4">
        <p>Price Range:</p>
        <Slider range min={0} max={1000} value={priceRange} onChange={handlePriceChange} />
        <p>
          Selected Price Range: ${priceRange[0]} - ${priceRange[1]}
        </p>
      </div>

      <div className="d-flex justify-content-end mb-3">
        <Button
          variant="primary"
          size="sm"
          onClick={handleCreateAdvertClick}
          className="create-advert-button"
        >
          Create Advert
        </Button>
      </div>

      <div className="row">
        {adverts.map((advert) => (
          <div key={advert.id} className="col-md-12 mb-4">
            <Card className="mb-3 custom-card">
              <Card.Body>
                <div className="row g-0">
                  <div className="col-md-2">
                    <img
                      src={advert.picture ? `data:image/png;base64,${JSON.parse(advert.picture).picture}` : "/src/Images/default_car.png"}
                      alt="Placeholder"
                      className="advert-image"
                    />
                  </div>
                  <div className="col-md-10">
                    <div className="card-body">
                      <h5 className="card-title">
                        {advert.car.brand} {advert.car.model}
                      </h5>
                      <p className="card-text">Price per Day: {advert.pricePerDay}</p>
                      <div className="d-flex justify-content-between">
                        <Button variant="success" size="sm" onClick={() => handleEditAdvert(advert)}>
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteAdvert(advert.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <CreateAdvertModal
        show={showCreateModal}
        handleClose={handleCloseCreateModal}
        handleCreateAdvert={handleCreateAdvert}
      />

      <UpdateAdvertModal
        show={showUpdateModal}
        handleClose={handleCloseUpdateModal}
        handleUpdateAdvert={handleUpdateAdvert}
        selectedAdvert={selectedAdvert}
      />
    </div>
  );
};

export default UserAdvertsPage;
