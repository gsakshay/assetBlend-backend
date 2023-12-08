const apiClient = require('../tiingoHelpers/setupApiClient')

module.exports = async function fetchTiingoData(endpoint, parameters={}) {
    const queryString = Object.keys(parameters).length > 0 
    ? Object.entries(parameters)
    .map(([key, value]) => `${key}=${value}`)
    .join('&') : '';

    // Construct the complete URL
    const urlQuery = queryString==='' ? `${endpoint}` : `${endpoint}?${queryString}`;
    try{
        const response = await apiClient.get(urlQuery)
        return response.data
    }catch(error){
        throw error
    }
}