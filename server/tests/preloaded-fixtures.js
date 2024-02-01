const {
    v4: uuidv4
} = require('uuid')
/* preloaded fixtures */
const memory_user = {
    uuid: uuidv4(),
    display_name: "Firstname L"
}

const comment_user = {
    uuid: uuidv4(),
    display_name: "Lastname F"
}

const preloaded_memory_with_comment = { //this one gets an associated comment
    uuid: uuidv4(),
    user_uuid: memory_user.uuid, //uses uuid of preloaded memory user
    occasion: "Yes, birthday",
    experience: "I celebrated my birthday there!",
    num_likes: 0
}

const preloaded_memory_without_comment = { //no associated comment so 204 path can be tested on comments
    uuid: uuidv4(),
    user_uuid: memory_user.uuid, //uses uuid of preloaded memory user
    occasion: "Yes, rehearsal",
    experience: "My wife and I did our rehearsal dinner there!",
    num_likes: 0
}

const preloaded_comment = {
    uuid: uuidv4(),
    memory_uuid: preloaded_memory_with_comment.uuid, //preloaded_memory_with_comment.uuid
    user_uuid: comment_user.uuid,
    comment_text: "Love this!"
}

const preloaded_memory_image = {
    uuid: uuidv4(),
    memory_uuid: preloaded_memory_without_comment.uuid,
    user_uuid: memory_user.uuid,
    image_key: "uploadedimagetest.jpg",
    image_caption: "uploaded image test",
    source_bucket: "photos.astimemories.com"
}

const preloaded_gallery_image = {
    uuid: uuidv4(),
    memory_uuid: uuidv4(),
    user_uuid: uuidv4(),
    image_key: "galleryimagetest.jpg",
    image_caption: "gallery image test",
    source_bucket: "gallery.astimemories.com"
}

const preloaded_admin = {
    uuid: uuidv4(),
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
    preloaded_memory_image,
    preloaded_gallery_image,
    preloaded_admin
}