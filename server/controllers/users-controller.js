const {
    v4: uuidv4
} = require('uuid')
const models = require('../models');

/*
    This method allows the app to autofill the temp user's display_name on the various forms if 
    they've already submitted one of the forms such as commenting or submitting a memory.
*/
const checkForUser = async(req, res) => {
    const userid = req.query.user_uuid
    const getUser = await models.User.findOne({where: {"uuid": userid}, raw: true})
    if(getUser === null) {
        return res.status(204).send()
    } else { 
        console.log("getuser:", getUser)
        return res.status(200).json({
            display_name: getUser.display_name
        })
    }
}

const createTemporaryUser = async(req, res) => {
    const newUser = {
        uuid: uuidv4(),
        display_name: req.body.name,
    }
    await models.User.create(newUser);

    return res.status(201).json({
        user_uuid: newUser.uuid
    })
}

module.exports = {checkForUser, createTemporaryUser}