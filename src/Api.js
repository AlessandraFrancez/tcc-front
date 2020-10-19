import Axios from 'axios';

const api = Axios.create({
    baseURL: 'http://localhost:3010/api',
})

export default api;