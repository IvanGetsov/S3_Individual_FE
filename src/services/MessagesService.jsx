import axios from "axios";

const create = data =>{
    return axios.post(`/messages`, data)
}

const MessageService = {
    create
}

export default MessageService;