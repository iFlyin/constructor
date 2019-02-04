import axios from 'axios';

export default axios.create({
   baseURL: 'http://172.16.1.48:9101/constructor/api/',
});