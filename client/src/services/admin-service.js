import axios from 'axios'

export const handleAdminLogin = async (url, body) => {
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
    const url = `http://localhost:3000/${endpoint}`
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