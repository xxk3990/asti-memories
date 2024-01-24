const {
    S3Client,
    PutObjectCommand,
    GetObjectCommand
} = require("@aws-sdk/client-s3")
const {
    v4: uuidv4
} = require('uuid')
const models = require('../models');


const getImageForMemory = async(req, res) => {
    const image = await models.Image.findOne(({where: {"memory_uuid" : req.query.memory_uuid}}))
    if(!image) {
        return res.status(204).send()
    } else {
        return res.status(200).send(image)
    }
}

module.exports = {
    getImageForMemory
}