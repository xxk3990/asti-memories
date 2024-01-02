/* preloaded fixtures */
const memoryUser = {
    uuid: "4d6ae111-1fd1-4905-bfb3-ee74f9a42017",
    display_name: "Firstname L"
}

const commentUser = {
    uuid: "d1d07745-c89b-4a4a-9ace-0ec848cc1c5d",
    display_name: "Lastname F"
}

const preloadedMemory = {
    uuid: "cbd211ad-1596-416d-aa7e-d6041428058b",
    user_uuid: "4d6ae111-1fd1-4905-bfb3-ee74f9a42017", //uses uuid of preloaded memory user
    occasion: "Yes, date",
    experience: "I went on a date there!",
    num_likes: 0
}

module.exports = {
    memoryUser,
    commentUser,
    preloadedMemory
}