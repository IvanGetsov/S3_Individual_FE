import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import UserService from '../services/UserService';
import AdvertService from '../services/AdvertsService';

const UpdateAdvertModal = ({ show, handleClose, handleUpdateAdvert, selectedAdvert }) => {
  const [userId, setUserId] = useState(null);
  const [advertData, setAdvertData] = useState({
    carOwner: {
      id: 0,
    },
    car: {
      brand: '',
      model: '',
      yearOfConstruction: undefined,
      colour: '',
      kilometers: undefined,
      picture: null,
    },
    availableFrom: undefined,
    maximumAvailableDays: undefined,
    pricePerDay: undefined,
  });

  const [advertImage, setAdvertImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
          const response = await UserService.getUserByAccessToken(accessToken);
          setUserId(response.data.id);

          setAdvertData((prevData) => ({
            ...prevData,
            carOwner: {
              id: response.data.id,
            },
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();

    if (selectedAdvert) {
      setAdvertData({
        carOwner: {
          id: selectedAdvert.carOwner.id,
        },
        car: {
          brand: selectedAdvert.car.brand,
          model: selectedAdvert.car.model,
          yearOfConstruction: selectedAdvert.car.yearOfConstruction || undefined,
          colour: selectedAdvert.car.colour,
          kilometers: selectedAdvert.car.kilometers || undefined,
          picture: selectedAdvert.car.picture || null,
        },
        availableFrom: selectedAdvert.availableFrom || undefined,
        maximumAvailableDays: selectedAdvert.maximumAvailableDays || undefined,
        pricePerDay: selectedAdvert.pricePerDay || undefined,
      });
    }
  }, [selectedAdvert]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdvertData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setAdvertImage(base64String);
      };

      reader.readAsDataURL(file);
    }
  };


  const handleSave = async () => {
    if (advertImage) {
      const updatedPicture = advertImage;

      setAdvertData((prevData) => ({
        ...prevData,
        picture: updatedPicture,
      }));

      try {
        const response = await AdvertService.updatePicture(selectedAdvert.id, updatedPicture);
        console.log('Advert picture updated successfully:', response);
      } catch (error) {
        console.error('Error updating advert picture:', error);
      }
    }
    await handleUpdateAdvert(advertData);

    handleClose();
  };

  const handleCarChange = (e) => {
    const { name, value } = e.target;
    setAdvertData((prevData) => ({
      ...prevData,
      car: {
        ...prevData.car,
        [name.split('.')[1]]: value,
      },
    }));
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Advert</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBrand">
            <Form.Label>Car Brand</Form.Label>
            <Form.Control
              type="text"
              disabled
              placeholder="Enter car brand"
              name="car.brand"
              value={advertData.car.brand}
              onChange={handleCarChange}
            />
          </Form.Group>
          <Form.Group controlId="formModel">
            <Form.Label>Car Model</Form.Label>
            <Form.Control
              type="text"
              disabled
              placeholder="Enter car model"
              name="car.model"
              value={advertData.car.model}
              onChange={handleCarChange}
            />
          </Form.Group>
          <Form.Group controlId="formYearOfConstruction">
            <Form.Label>Year of Construction</Form.Label>
            <Form.Control
              type="number"
              disabled
              placeholder="Enter year of construction"
              name="car.yearOfConstruction"
              value={advertData.car.yearOfConstruction || ''}
              onChange={handleCarChange}
            />
          </Form.Group>
          <Form.Group controlId="formColour">
            <Form.Label>Car Colour</Form.Label>
            <Form.Control
              type="text"
              disabled
              placeholder="Enter car colour"
              name="car.colour"
              value={advertData.car.colour}
              onChange={handleCarChange}
            />
          </Form.Group>
          <Form.Group controlId="formKilometers">
            <Form.Label>Kilometers</Form.Label>
            <Form.Control
              type="number"
              disabled
              placeholder="Enter kilometers"
              name="car.kilometers"
              value={advertData.car.kilometers || ''}
              onChange={handleCarChange}
            />
          </Form.Group>
          <Form.Group controlId="formAvailableFrom">
            <Form.Label>Available From</Form.Label>
            <Form.Control
              type="date"
              name="availableFrom"
              value={advertData.availableFrom || ''}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formMaxDays">
            <Form.Label>Maximum Available Days</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter maximum available days"
              name="maximumAvailableDays"
              value={advertData.maximumAvailableDays || ''}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formPricePerDay">
            <Form.Label>Price Per Day</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter price per day"
              name="pricePerDay"
              value={advertData.pricePerDay || ''}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formPicture">
            <Form.Label>Advert Picture</Form.Label>
            <Form.Control type="file" onChange={handleImageChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateAdvertModal;
