const models = require("../models")
const prefixes = require("./preloaded-fixtures")
const bcrypt = require("bcrypt");

const preload = async() => {
    await preload_users();
    await preload_memories();
    await preload_comment();
    await preload_admin();
}

const preload_users = async() => {
    await models.User.create(prefixes.memory_user)
    await models.User.create(prefixes.comment_user)
}
   

const preload_memories = async() => {
    await models.Memory.create(prefixes.preloaded_memory_with_comment);
    await models.Memory.create(prefixes.preloaded_memory_without_comment);
}

const preload_comment = async() => {
    await models.Comment.create(prefixes.preloaded_comment);
}

const preload_admin = async() => {
    const saltRounds = 10;
    //salting and hashing of test password required here to test unauthorized paths
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(prefixes.preloaded_admin.password, salt)
    const test_admin = {
        uuid: prefixes.preloaded_admin.uuid,
        email: prefixes.preloaded_admin.email,
        display_name: prefixes.preloaded_admin.display_name,
        password: hash
    }
    await models.Admin.create(test_admin)
}

module.exports = {preload};