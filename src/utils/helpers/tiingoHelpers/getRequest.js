const customError = require('../../errors/customError');
const apiClient = require('../tiingoHelpers/setupApiClient')

module.exports = async function fetchTiingoData(endpoint, parameters={}) {
    const queryString = Object.keys(parameters).length > 0 
    ? Object.entries(parameters)
    .map(([key, value]) => `${key}=${value}`)
    .join('&') : '';

    // Construct the complete URL
    const urlQuery = queryString==='' ? `${endpoint}` : `${endpoint}?${queryString}`;
    console.log("URLLLLL", urlQuery)
    try{
        const response = await apiClient.get(urlQuery)
        return response.data
    }catch(error){
        if(error.response.status === 400){
            console.log("In 400 ERROR ", urlQuery)
            throw new customError("No Permission", 400, 'warn')
        }
        throw error
    }
}