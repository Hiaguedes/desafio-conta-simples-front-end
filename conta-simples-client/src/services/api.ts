import axios from 'axios';

const api = axios.create({
    baseURL: 'http://contasimples.mocklab.io',
    headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://contasimples.mocklab.io',
    }

})

export default api;