const {S3Client, putObjectCommand} = require("@aws-sdk/client-s3")
const {
    v4: uuidv4
} = require('uuid')
const models = require('../models');
const { Upload } = require("@aws-sdk/lib-storage");
const formidable = require("formidable")

const Transform = require('stream').Transform;
const bucketName = process.env.IMAGE_BUCKET_NAME;
const bucketRegion = process.env.IMAGE_BUCKET_REGION;
const bucketAccessKey = process.env.IMAGE_BUCKET_ACCESS_KEY;
const bucketSecretKey = process.env.IMAGE_BUCKET_SECRET_KEY;


const parseImage = async (req) => {
    return new Promise((resolve, reject) => {
        let options = {
            maxFileSize: 100 * 1024 * 1024, //100 MBs converted to bytes,
            allowEmptyFiles: false
        }

        const form = formidable(options);
        
        form.parse(req, (err, fields, files) => {});
        form.on('error', error => {
            reject(error.message)
        })
        
        form.on('data', data => {
            if (data.name === "successUpload") {
                resolve(data.value);
            }
        })

        form.on('fileBegin', (formName, file) => {

            file.open = async function () {
                this._writeStream = new Transform({
                    transform(chunk, encoding, callback) {
                        callback(null, chunk)
                    }
                })

                this._writeStream.on('error', e => {
                    form.emit('error', e)
                });
                new Upload({
                    client: new S3Client({
                        credentials: {
                            accessKeyId: bucketAccessKey,
                            secretAccessKey: bucketSecretKey,
                        },
                        region: bucketRegion
                    }),
                    params: {
                        ACL: 'public-read',
                        Bucket,
                        Key: `${req.body.image_name}`,
                        Body: this._writeStream
                    },
                    tags: [], // optional tags
                    queueSize: 4, // optional concurrency configuration
                    partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
                    leavePartsOnError: false, // optional manually handle dropped parts
                }).done()
                .then(data => {
                    form.emit('data', { name: "complete", value: data });
                }).catch((err) => {
                    form.emit('error', err);
                })
                
                
            }

        })
    })
}

module.exports = {parseImage}