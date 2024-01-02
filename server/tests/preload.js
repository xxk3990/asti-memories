const models = require("../models")
const preFixtures = require("./preloadedFixtures")

const preload = async() => {
    await models.User.create(preFixtures.memoryUser)
    await models.User.create(preFixtures.commentUser)
    await models.Memory.create(preFixtures.preloadedMemory);
}

module.exports = {preload};