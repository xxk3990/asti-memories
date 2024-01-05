
/* preloaded fixtures */
const memory_user = {
    uuid: "4d6ae111-1fd1-4905-bfb3-ee74f9a42017",
    display_name: "Firstname L"
}

const comment_user = {
    uuid: "d1d07745-c89b-4a4a-9ace-0ec848cc1c5d",
    display_name: "Lastname F"
}

const preloaded_memory_with_comment = { //this one gets an associated comment
    uuid: "cbd211ad-1596-416d-aa7e-d6041428058b",
    user_uuid: "4d6ae111-1fd1-4905-bfb3-ee74f9a42017", //uses uuid of preloaded memory user
    occasion: "Yes, birthday",
    experience: "I celebrated my birthday there!",
    num_likes: 0
}

const preloaded_memory_without_comment = { //no associated comment so 204 path can be tested on comments
    uuid: "4f6ee234-28e7-4279-9340-adf8566f711d",
    user_uuid: "4d6ae111-1fd1-4905-bfb3-ee74f9a42017", //uses uuid of preloaded memory user
    occasion: "Yes, rehearsal",
    experience: "My wife and I did our rehearsal dinner there!",
    num_likes: 0
}

const preloaded_comment = {
    uuid: "3d0e2b2e-9656-4c31-94ab-5f841f0245b0",
    memory_uuid: "cbd211ad-1596-416d-aa7e-d6041428058b",
    user_uuid: "d1d07745-c89b-4a4a-9ace-0ec848cc1c5d",
    comment_text: "Love this!"
}

const preloaded_admin = {
    uuid: "579cd2c6-2b4b-4805-8720-7b55a2e16810",
    email: "test0@test.com",
    password: "test0",
    display_name: "testF testL"
}

module.exports = {
    memory_user,
    comment_user,
    preloaded_memory_with_comment,
    preloaded_memory_without_comment,
    preloaded_comment,
    preloaded_admin
}