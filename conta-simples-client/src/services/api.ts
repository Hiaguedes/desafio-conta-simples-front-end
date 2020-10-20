import axios from 'axios';

const api = axios.create({
    baseURL: 'http://contasimples.mocklab.io',
    headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET'
    }

})

export default api;