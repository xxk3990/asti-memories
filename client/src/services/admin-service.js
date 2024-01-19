import axios from 'axios'
const NODE_URL = process.env.REACT_APP_NODE_LOCAL || process.env.REACT_APP_NODE_PROD
export const handleAdminLogin = async (endpoint, body) => {
    const url = `${NODE_URL}/${endpoint}`
    axios.defaults.withCredentials = true; //required otherwise the login would not create cookie!
    const headers = {
        "Content-Type": 'application/json'
    }
    return await axios.post(url, body, {
    }, {
        headers: headers,
        withCredentials: true
    })
}

export const handleAdminDelete = async(endpoint) => {
    const url = `${NODE_URL}/${endpoint}`
    const requestParams = {
        method: 'DELETE',
        headers: {
            "Content-Type": 'application/json',
            //"Authorization": `Bearer ${token}` 
        },
        credentials: 'include',
    }
    return fetch(url, requestParams)
}