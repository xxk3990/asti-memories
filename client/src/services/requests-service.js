import axios from 'axios'
const NODE_URL = process.env.REACT_APP_NODE_LOCAL || process.env.REACT_APP_NODE_PROD
export const handleGet = async (endpoint, setDataInComponent) => {
    const url = `${NODE_URL}/${endpoint}`
    await axios.get(url, {
        method: 'GET',
    }).then(response => {
        //The data for the component is the main setXXX variable (example: setMemories)
        return setDataInComponent(response.data); //set it equal to data from API
    })
}

export const handlePost = async (endpoint, body) => {
    const url = `${NODE_URL}/${endpoint}`;
    return await axios.post(url, body)
}

export const handlePut = async (endpoint, body) => {
    const url = `${NODE_URL}/${endpoint}`;
    return await axios.put(url, body)
}