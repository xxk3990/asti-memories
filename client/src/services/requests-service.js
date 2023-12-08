export const handleGet = async (endpoint, setDataInComponent) => {
    const url = `http://localhost:3000/${endpoint}`
    await fetch(url, {
        method: 'GET',
    }).then(response => response.json(),
    []).then(responseData => {
        //The data for the component is the main setXXX variable (examples: setWorlds, setLocations)
        return setDataInComponent(responseData); //set it equal to data from API
    })
}

export const handlePost = (endpoint, body) => {
    const url = `http://localhost:3000/${endpoint}`;
    const requestParams = {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json',
            //"Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(body)
    }
    return fetch(url, requestParams)
}

export const handlePut = async (endpoint, body) => {
    const url = `http://localhost:3000/${endpoint}`;
    const requestParams = {
        method: "PUT",
        headers: {
            "Content-Type": 'application/json',
            //"Authorization": `Bearer ${token}` 
        },
        // credentials: 'include',
        body: JSON.stringify(body)
    }
    return fetch(url, requestParams)
}