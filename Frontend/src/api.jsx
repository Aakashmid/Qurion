
// import { TOKEN } from './Components/constants';

// const api = axios.create({
//     baseURL: import.meta.env.VITE_BACKEND_URL,
//     // baseURL: 'http://127.0.0.1:8000/api/',
//     headers: {
//         'Content-Type': 'application/json',
//     }
// });


// api.interceptors.request.use(  // modify  requuest before sending ,adding authoriazation token if token exist
//     (config) => {
//         const token = localStorage.getItem(TOKEN);
//         if (token) {
//             config.headers.Authorization = `Token ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );




import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // e.g. https://api.myapp.com
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // always send cookies
});




export default api