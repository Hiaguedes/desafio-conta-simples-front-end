import axios from 'axios';

const api = axios.create({
    baseURL: 'http://contasimples.mocklab.io',//coloca a url do mock
    headers: { 
        'Content-Type': 'application/json',//requisito o json
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET'//sem esses headers a aplicação horas funciona horas não
    }

})

export default api;

//com /empresas eu pego todas as informacoes das empresas e com empresas/:id eu pego informacao daquela empresa especifica

//com transacoes pego todas as transacoes de todas as empresas e com transacoes/:id pego as transacoes daquela empresa especifica