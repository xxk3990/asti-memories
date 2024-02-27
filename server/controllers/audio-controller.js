const {
    S3Client,
    GetObjectCommand
} = require("@aws-sdk/client-s3")
const models = require('../models');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");


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

module.exports = {getAudioFromS3}
