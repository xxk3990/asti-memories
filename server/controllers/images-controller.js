const {
    S3Client,
    GetObjectCommand
} = require("@aws-sdk/client-s3")
const {
    v4: uuidv4
} = require('uuid')
const models = require('../models');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require('crypto')

const getImageForMemory = async(req, res) => {
    const bucketName = process.env.IMAGE_BUCKET_NAME;
    const bucketRegion = process.env.IMAGE_BUCKET_REGION;
    const bucketAccessKey = process.env.IMAGE_BUCKET_ACCESS_KEY;
    const bucketSecretKey = process.env.IMAGE_BUCKET_SECRET_KEY;
    const credentials = {
        accessKeyId: bucketAccessKey,
        secretAccessKey: bucketSecretKey,
    }
    const image = await models.Image.findOne(({where: {"memory_uuid" : req.query.memory_uuid}, raw: true}))
    const s3 = new S3Client({
        bucketRegion,
        credentials: credentials,
    })
    if(!image) {
        return res.status(204).send()
    } else {
        image.image_url = await getSignedUrl(s3, new GetObjectCommand({
            Bucket: bucketName,
            Key: image.image_name
        }))
        return res.status(200).send(image)
    }
}

const createUniqueFileName = async(req, res) => {
    //create random image file name using crypto
    const uniquename = crypto.randomBytes(32).toString('hex')
    return res.status(200).json({
        unique_name: uniquename //send back to FE
    })
}

module.exports = {
    getImageForMemory,
    createUniqueFileName
}