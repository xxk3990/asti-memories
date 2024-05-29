const models = require('../models');
const {
    v4: uuidv4
} = require('uuid')

const getEvents = async (req, res) => {
    const events = await models.Event.findAll({raw: true})
    return res.status(200).json(events);
}

module.exports = {
    getEvents
}