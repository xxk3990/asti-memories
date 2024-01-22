const {
    v4: uuidv4
} = require('uuid')
const models = require('../models');

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

module.exports = {checkForUser}