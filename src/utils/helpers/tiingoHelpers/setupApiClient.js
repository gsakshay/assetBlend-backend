const axios = require('axios')
const constants = require('../../constants/index')

console.log("constants",constants)
const baseURL = constants.TIINGO_BASE_URL
const timeout = 50000;
const authToken = constants.API_TOKEN; 

const apiClient = axios.create({
  baseURL,
  timeout,
  headers: {
    'Authorization': `Token ${authToken}`,
    'Content-Type': 'application/json',
  },
});


// apiClient.interceptors.request.use(request => {
//   console.log('Starting Request', request)
//   return request
// })

// // Response interceptor
// apiClient.interceptors.response.use(response => {
//   console.log('Response:', response.data)
//   return response
// }, error => {
//   console.error('Error Response:', error.response.data)
//   return Promise.reject(error)
// })

module.exports = apiClient