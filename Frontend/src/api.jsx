
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


// // Interceptor for handling server errors
// api.interceptors.response.use(
//   response => response,
//   error => {
//     // Redirect to /server-error on 5xx or network error
//     if (
//       (!error.response || error.response.status >= 500) &&
//       window.location.pathname !== "/server-error"
//     ) {
//       window.location.href = "/server-error";
//     }
//     return Promise.reject(error);
//   }
// );



export default api