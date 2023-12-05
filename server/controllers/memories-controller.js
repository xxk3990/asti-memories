const {
    v4: uuidv4
} = require('uuid')
const models = require('../models')

const getMemories = async (req, res) => {
    const memories = await models.Memory.findAll();
    if(memories.length !== 0) {
        return res.status(200).send(memories)
    } else {
        return res.send([])
    }
}

const createMemory = async (req, res) => {
    const newMemory = {
        uuid: uuidv4(),
        name: req.body.name,
        occasion: req.body.occasion,
        experience: req.body.experience,
        num_likes: 0
    }

    await models.Memory.create(newMemory)
    return res.status(200).send(newMemory);
}

module.exports = {getMemories, createMemory}