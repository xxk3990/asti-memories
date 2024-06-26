const {
    S3Client,
    GetObjectCommand
} = require("@aws-sdk/client-s3")
const models = require('../models');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require('crypto')
const {
    v4: uuidv4
} = require('uuid')

const galleryBucket = process.env.GALLERY_IMAGES_BUCKET;
//this file handles all requests for files such as images and audio.

//get audio file from s3 for home page
const getAudioFromS3 = async(req, res) => {
    const bucketAccessKey = process.env.IMAGE_BUCKET_ACCESS_KEY;
    const bucketSecretKey = process.env.IMAGE_BUCKET_SECRET_KEY;
    const audioBucket = process.env.AUDIO_FILE_BUCKET;
    const audioKey = process.env.AUDIO_FILE_KEY;
    const credentials = {
        accessKeyId: bucketAccessKey,
        secretAccessKey: bucketSecretKey,
    }
    const s3 = new S3Client({
        region: 'us-east-2',
        credentials: credentials,
    })
    const signedURL = await getSignedUrl(s3, new GetObjectCommand({
        Bucket: audioBucket,
        Key: audioKey
    }))

    return res.status(200).send(signedURL)
}

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
        region: bucketRegion,
        credentials: credentials,
    })
    if(!image) {
        return res.status(204).send()
    } else {
        image.image_url = await getSignedUrl(s3, new GetObjectCommand({
            Bucket: bucketName,
            Key: image.image_key
        }))
        return res.status(200).send(image)
    }
}

const saveGalleryImage = async(req, res) => {
    if(!req.body.image_key) {
        return res.status(400).send()
    } else {
        /*
            These images are not part of a memory and are not associated with a user,
            so the memory_uuid and user_uuid can be new UUIDs. 
        */
        const newImage = {
            uuid: uuidv4(),
            memory_uuid: uuidv4(),
            user_uuid: uuidv4(),
            image_key: req.body.image_key,
            image_caption: req.body.image_caption,
            source_bucket: galleryBucket //gallery.astimemories.com
        }
        await models.Image.create(newImage)
        return res.status(201).send()
    }
}

const getGalleryImages = async (req, res) => {
    const bucketAccessKey = process.env.IMAGE_BUCKET_ACCESS_KEY;
    const bucketSecretKey = process.env.IMAGE_BUCKET_SECRET_KEY;
    const galleryBucketRegion = process.env.GALLERY_BUCKET_REGION;
    const credentials = {
        accessKeyId: bucketAccessKey,
        secretAccessKey: bucketSecretKey,
    }
    //get all images coming from bucket gallery.astimemories.com and NOT bucket photos.astimemories.com
    const images = await models.Image.findAll({where: {"source_bucket": galleryBucket}, raw: true})
    if(images.length === 0) {
        return res.status(204).send();
    } else {
        const imgs = [...images]
        const s3 = new S3Client({
            region: galleryBucketRegion,
            credentials: credentials,
        })
        for(const img of imgs) {
            img.image_url = await getSignedUrl(s3, new GetObjectCommand({
                Bucket: galleryBucket,
                Key: img.image_key
            }))
        }
        return res.status(200).send(imgs)
    }
}

const createUniqueFileName = async(req, res) => {
    //create random image file name using crypto
    const randName = crypto.randomBytes(32).toString('hex')
    return res.status(200).json({
        randomized_name: randName //send back to FE
    })
}



module.exports = {
    getAudioFromS3,
    getImageForMemory,
    saveGalleryImage,
    getGalleryImages,
    createUniqueFileName
}