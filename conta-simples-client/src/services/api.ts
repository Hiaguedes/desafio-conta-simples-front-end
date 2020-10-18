import axios from 'axios';

const api = axios.create({
    baseURL: 'http://contasimples.mocklab.io'

})

export default api;