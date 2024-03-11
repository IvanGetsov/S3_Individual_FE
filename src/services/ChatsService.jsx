import axios from "axios";

const create = data =>{
    return axios.post(`/chats`, data)
}

const get = id => {
    return axios.get(`/chats/${id}`);
  };

  const checkChatExistence = (advertId, senderId, recipientId) => {
    return axios.get(`/chats/exists`, {
      params: {
        advertId,
        senderId,
        recipientId,
      },
    });
  };

  const getChatByAdvertAndUsers = (advertId, senderId, recipientId) => {
    return axios.get(`/chats/getByAdvertAndUsers`, {
      params: {
        advertId,
        senderId,
        recipientId,
      },
    });
  };

  const getUsersChats = (userId) => {
    return axios.get(`/chats/user/${userId}`);
  };

const ChatsService = {
    create,
    get,
    checkChatExistence,
    getChatByAdvertAndUsers,
    getUsersChats
}

export default ChatsService;
