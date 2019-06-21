import axios from 'axios';

const api = axios.create({
    baseURL: 'https://chat-api-fast-chat.herokuapp.com/'
})

export default api;