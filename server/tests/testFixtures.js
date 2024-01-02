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

/* POST test fixtures */
const memory1 = {
    user_uuid: "4d6ae111-1fd1-4905-bfb3-ee74f9a42017", //uses uuid of memory user
    occasion: "no",
    experience: "experience",
    num_likes: 0
}

const comment1 = {
    memory_uuid: "cbd211ad-1596-416d-aa7e-d6041428058b", //uses uuid of preloaded memory
    user_uuid: "d1d07745-c89b-4a4a-9ace-0ec848cc1c5d", //uses uuid of comment user
    comment_text: "hi!"
}

const admin1 = {
    display_name: "test",
    email: "test@test.com",
    password: "test",
}

const admin2 = { //no display_name provided
    email: "test@test.com",
    password: "test",
}

const admin3 = { //no email provided
    password: "test",
    display_name: "test",
}

const admin4 = { //no password provided
    email: "test@test.com",
    display_name: "test",
}

module.exports = {
    memoryUser,
    commentUser,
    preloadedMemory,
    memory1,
    comment1,
    admin1,
    admin2,
    admin3,
    admin4
}