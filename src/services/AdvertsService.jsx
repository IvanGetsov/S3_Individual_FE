import axios from 'axios';

  const get = id => {
    return axios.get(`/adverts/${id}`);
  };

  const create = data => {
    return axios.post(`/adverts`, data);
  };
  
  const update = (id, data) => {
    return axios.put(`/adverts/${id}`, data);
  };

  const remove = id => {
    return axios.delete(`/adverts/${id}`);
  };

  const getAdvertsByBrand = (brand) => {
    return axios.get(`/adverts/by-brand/${brand}`);
  };

  const getAdvertsByUserId = (userId) => {
    return axios.get(`/adverts/by-user/${userId}`);
  };

  const updatePicture = (id, pictureString) => { 
    return axios.put(`/adverts/${id}/update-picture`, {
        picture: pictureString
    });
  };

  const getAveragePriceByBrand = brand => {
    return axios.get(`/adverts/average-price/${brand}`);
  };

  const AdvertService = {
    get,
    create,
    update,
    remove,
    getAdvertsByBrand,
    getAdvertsByUserId,
    updatePicture,
    getAveragePriceByBrand
  };

  export default AdvertService;