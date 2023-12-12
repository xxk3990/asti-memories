import axios from 'axios'

export const handleGet = async (endpoint, setDataInComponent) => {
    const url = `http://localhost:3000/${endpoint}`
    await axios.get(url, {
        method: 'GET',
    }).then(response => {
        //The data for the component is the main setXXX variable (examples: setWorlds, setLocations)
        return setDataInComponent(response.data); //set it equal to data from API
    })
}

export const handlePost = async (endpoint, body) => {
    const url = `http://localhost:3000/${endpoint}`;
    return await axios.post(url, body)
}

export const handlePut = async (endpoint, body) => {
    const url = `http://localhost:3000/${endpoint}`;
    return await axios.put(url, body)
}