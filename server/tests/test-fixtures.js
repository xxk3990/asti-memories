const prefixes = require("./preloaded-fixtures")
/* POST test fixtures */
const test_memory = {
    user_uuid: prefixes.memory_user.uuid, //uses uuid of memory user
    occasion: "no",
    experience: "experience",
    num_likes: 0
}

const memory_new_like_good = {
    memory_uuid: prefixes.preloaded_memory_with_comment.uuid,
    num_likes: prefixes.preloaded_memory_with_comment.num_likes + 1
}

const memory_new_like_bad = { //memory_uuid not provided
    num_likes: prefixes.preloaded_memory_with_comment.num_likes + 1
}

const test_comment = {
    memory_uuid: prefixes.preloaded_memory_with_comment.uuid, //uses uuid of preloaded memory with comment
    user_uuid: prefixes.comment_user.uuid, //uses uuid of preloaded comment user
    comment_text: "hi!"
}

const admin_good = {
    display_name: "test",
    email: "test@test.com",
    password: "test",
}

const admin_no_name = { //no display_name provided
    email: "test@test.com",
    password: "test",
}

const admin_no_email = { //no email provided
    password: "test",
    display_name: "test",
}

const admin_no_password = { //no password provided
    email: "test@test.com",
    display_name: "test",
}

const admin_login_good = {
    email: prefixes.preloaded_admin.email,
    password: prefixes.preloaded_admin.password
}

const admin_login_unauthorized_email = {
    email: "test1@test.com",
    password: prefixes.preloaded_admin.password
}

const admin_login_unauthorized_password = {
    email: prefixes.preloaded_admin.email,
    password: "test1"
}

module.exports = {
    test_memory,
    memory_new_like_good,
    memory_new_like_bad,
    test_comment,
    admin_good,
    admin_no_name,
    admin_no_email,
    admin_no_password,
    admin_login_good,
    admin_login_unauthorized_email,
    admin_login_unauthorized_password
}