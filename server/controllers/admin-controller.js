const cookie = require("cookie-parser")
const {
    v4: uuidv4
} = require('uuid')
const models = require('../models')
const jwt = require('jsonwebtoken')
const process = require("process")
const bcrypt = require("bcryptjs");
const {
    S3Client,
    DeleteObjectCommand
} = require("@aws-sdk/client-s3")


const saltRounds = 10;

const createAdminAccount = async (req, res) => {
    if (!req.body.display_name || !req.body.email || !req.body.password) {
        return res.status(400).json("Unable to create account.")
    } else {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(req.body.password.toString(), salt)
        const newAdmin = {
            uuid: uuidv4(),
            display_name: req.body.display_name,
            email: req.body.email,
            password: hash,
        }
        models.Admin.create(newAdmin);
        return res.status(201).send()
    }

}

const adminLogin = async (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json("Missing required info.")
    } else {
        const matchingAdmin = await models.Admin.findOne({
            where: {
                'email': req.body.email,
            },
            raw: true
        })
        if (matchingAdmin) {
            const passwordValid = await bcrypt.compare(req.body.password, matchingAdmin.password)
            if (passwordValid) {
                const tokenTime = 1800000
                const secret = process.env.SECRET; //grab secret
                const token = jwt.sign({
                    id: matchingAdmin.uuid,
                }, secret, {
                    algorithm: "HS256",
                    expiresIn: "30 minutes",
                }) //set session up
                const newUser = {
                    uuid: uuidv4(),
                    display_name: matchingAdmin.display_name,
                }
                const dataForFE = {
                    admin_uuid: matchingAdmin.uuid,
                    user_uuid: newUser.uuid
                }
                await models.User.create(newUser) //create new temp user on login so admins can like and comment
                return res.cookie("token", token, {
                    httpOnly: true,
                    secure: false,
                    maxAge: tokenTime, //30 min
                }).status(200).send(dataForFE)

            } else {
                return res.status(401).json("Login info is incorrect")
            }

        } else {
            return res.status(401).json("Login info is incorrect")
        }
    }


}

const adminDeleteMemory = async (req, res) => {
    try {
        models.sequelize.transaction(async () => {
            await models.Memory.destroy({
                where: {
                    'uuid': req.query.memory_uuid
                }
            })
            
            await models.Comment.destroy({
                where: {
                    'memory_uuid': req.query.memory_uuid
                }
            })
            const image = await models.Image.findOne(({where: {"memory_uuid" : req.query.memory_uuid}, raw: true}))
            if(image) {
                const bucketName = process.env.IMAGE_BUCKET_NAME;
                const bucketRegion = `us-east-2`
                const bucketAccessKey = process.env.IMAGE_BUCKET_ACCESS_KEY;
                const bucketSecretKey = process.env.IMAGE_BUCKET_SECRET_KEY;
                const credentials = {
                    accessKeyId: bucketAccessKey,
                    secretAccessKey: bucketSecretKey,
                }
                const s3 = new S3Client({
                    region: bucketRegion,
                    credentials: credentials,
                })
                //remove from both S3 and DB
                const commandInput = {
                    Bucket: bucketName,
                    Key: image.image_key
                }
                const command = new DeleteObjectCommand(commandInput)
                await s3.send(command);
                await models.Image.destroy({
                    where: {
                        'memory_uuid': req.query.memory_uuid
                    }
                })
            }
            
            return res.status(200).send();
        })
    } catch {
        return res.status(400).send();
    }


}

const adminDeleteComment = async (req, res) => {
    await models.Comment.destroy({
        where: {
            "uuid": req.query.comment
        }
    })
    return res.status(200).send();
}

const adminDeleteImage = async (req, res) => {
    const bucketName = process.env.IMAGE_BUCKET_NAME;
    const bucketRegion = `us-east-2`
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
    if(image) {
        //remove from both S3 and DB
        const commandInput = {
            Bucket: bucketName,
            Key: image.image_key
        }
        const command = new DeleteObjectCommand(commandInput)
        await s3.send(command);
        await models.Image.destroy({where: {'memory_uuid' : req.query.memory_uuid}})
        return res.status(200).send();
    } else {
        return res.status(204).send();
    }
}

const getUnapprovedMemories = async(req, res) => {
    const memories = await models.Memory.findAll({
        where: {'approved': false},
    });
    if (memories.length !== 0) {
        const posts = [...memories]
        for (let i = 0; i < posts.length; i++) {
            const op = await models.User.findOne({
                where: {
                    'uuid': posts[i].user_uuid,
                }
            })
            posts[i].name = op.display_name; //add OP's display name to post info
        }
        return res.status(200).json(posts);
    } else {
        return res.status(204).send([])
    }
}

const approveMemory = async(req, res) => {
    const memory = req.body.memory_uuid;
    const memoryToApprove = await models.Memory.findOne({
        where: {
            'uuid': memory,
            'approved': false
        },
    })
    memoryToApprove.approved = true;
    await memoryToApprove.save();
    return res.status(201).send();
}

module.exports = {
    createAdminAccount,
    adminLogin,
    adminDeleteMemory,
    adminDeleteComment,
    adminDeleteImage,
    getUnapprovedMemories,
    approveMemory
}