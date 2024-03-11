import axios from 'axios';

  const get = id => {
    return axios.get(`/users/${id}`);
  };

  const getUserByAccessToken = accessToken => {
    return axios.get(`users/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  };
  
  const create = data => {
    return axios.post(`/users`, data);
  };
  
  const update = (id, data) => {
    return axios.put(`/users/${id}`, data);
  };

  const remove = id => {
    return axios.delete(`/users${id}`);
  };

  const updateEmail = (id, email) => {
    return axios.put(`/users/${id}/update-email`, null, {
      params: {
        email: email
      }
    });
  };
  
  const updatePassword = (id, currentPassword, newPassword) => {
    return axios.put(`/users/${id}/update-password`, null, {
      params: {
        currentPassword: currentPassword,
        newPassword: newPassword
      }
    });
  };

  const updateProfilePicture = (id, pictureString) => { 
    return axios.put(`/users/${id}/update-profile-picture`, {
        picture: pictureString
    });
  };

  const UserService = {
    get,
    getUserByAccessToken,
    create,
    update,
    remove,
    updateEmail,
    updatePassword,
    updateProfilePicture
  };

  export default UserService;