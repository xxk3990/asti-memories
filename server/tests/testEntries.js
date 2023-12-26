const memory1 = {
    user_uuid: "ffb566eb-f584-4a77-b5bf-e548471865ab",
    occasion: "no",
    experience: "experience",
    num_likes: 0
}

const comment1 = {
    memory_uuid: "d05dc23b-33d1-464b-92ff-7f5a18ac3d09",
    user_uuid: "ffb566eb-f584-4a77-b5bf-e548471865ab",
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
    memory1,
    comment1,
    admin1,
    admin2,
    admin3,
    admin4
}