const prefixes = require("./preloaded-fixtures")
const {
    v4: uuidv4
} = require('uuid')
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

const user_image_good = {
    memory_uuid: prefixes.memory_user.uuid,
    user_uuid: prefixes.memory_user.uuid,
    image_key: 'random.jpg',
    image_caption: 'test caption',
    source_bucket: 'photos.astimemories.com'
}

const gallery_image_good = {
    memory_uuid: uuidv4(),
    user_uuid: uuidv4(),
    image_key: 'random.jpg',
    image_caption: 'test caption',
    source_bucket: 'gallery.astimemories.com'
}

const gallery_image_no_key = {
    memory_uuid: uuidv4(),
    user_uuid: prefixes.memory_user.uuid,
    image_caption: 'test caption',
    source_bucket: 'gallery.astimemories.com'
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
    user_image_good,
    gallery_image_good,
    gallery_image_no_key,
    admin_good,
    admin_no_name,
    admin_no_email,
    admin_no_password,
    admin_login_good,
    admin_login_unauthorized_email,
    admin_login_unauthorized_password
}