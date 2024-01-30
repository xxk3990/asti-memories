const {
    v4: uuidv4
} = require('uuid')
const models = require('../models');

const getMemories = async (req, res) => {
    const memories = await models.Memory.findAll({
        raw: true
    });
    if (memories.length !== 0) {
        const posts = [...memories]
        for (let i = 0; i < posts.length; i++) {
            const op = await models.User.findOne({
                where: {
                    'uuid': posts[i].user_uuid
                }
            })
            posts[i].name = op.display_name; //add OP's display name to post info
        }
        return res.status(200).json(posts);
    } else {
        return res.status(204).send([])
    }
}

const createMemory = async (req, res) => {
    const user = req.body.user_uuid;
    if(user === undefined) {
        return res.status(400).json("Memory creation failed.");
    } else {
        try {
            models.sequelize.transaction(async () => {
                if (user === null) {
                    if(req.body.image_key === null) {
                        const newUser = {
                            uuid: uuidv4(),
                            display_name: req.body.name,
                        }
                        await models.User.create(newUser);
                        const newMemory = {
                            uuid: uuidv4(),
                            user_uuid: newUser.uuid,
                            occasion: req.body.occasion,
                            experience: req.body.experience,
                            num_likes: 0
                        }
                        await models.Memory.create(newMemory)
                        return res.status(201).json({
                            newMemory: newMemory,
                            user_uuid: newUser.uuid,
                        });
                    } else {
                        //create new user if no user_uuid was provided
                        const newUser = {
                            uuid: uuidv4(),
                            display_name: req.body.name,
                        }
                        await models.User.create(newUser);
                        const newMemory = {
                            uuid: uuidv4(),
                            user_uuid: newUser.uuid,
                            occasion: req.body.occasion,
                            experience: req.body.experience,
                            num_likes: 0
                        }
                        await models.Memory.create(newMemory)
    
                        //if they uploaded an image, save it!
                        const newImage = {
                            uuid: uuidv4(),
                            memory_uuid: newMemory.uuid,
                            user_uuid: newUser.uuid,
                            image_key: req.body.image_key,
                            image_caption: req.body.image_caption,
                            source_bucket: process.env.IMAGE_BUCKET_NAME //photos.astimemories.com
                        }
                        await models.Image.create(newImage)
                        return res.status(201).json({
                            newMemory: newMemory,
                            user_uuid: newUser.uuid,
                        });
                    }
                    
                    
                } else {
                    if(req.body.image_key === null) {
                        const newMemory = {
                            uuid: uuidv4(),
                            user_uuid: user,
                            occasion: req.body.occasion,
                            experience: req.body.experience,
                            num_likes: 0
                        }
                        await models.Memory.create(newMemory)
                        return res.status(201).json({
                            newMemory: newMemory,
                            user_uuid: user,
                        });
                    } else {
                        const newMemory = {
                            uuid: uuidv4(),
                            user_uuid: user,
                            occasion: req.body.occasion,
                            experience: req.body.experience,
                            num_likes: 0
                        }
                        await models.Memory.create(newMemory)
                        const newImage = {
                            uuid: uuidv4(),
                            memory_uuid: newMemory.uuid,
                            user_uuid: user,
                            image_key: req.body.image_key,
                            image_caption: req.body.image_caption,
                            source_bucket: process.env.IMAGE_BUCKET_NAME //photos.astimemories.com
                        }
                        await models.Image.create(newImage)
                        return res.status(201).json({
                            newMemory: newMemory,
                            user_uuid: user,
                        });
                    }
                }
            })
        } catch {
            return res.status(400).json("Memory creation failed.");
        }
    }
  
}

const likeMemory = async (req, res) => {
    if(!req.body.memory_uuid) {
        return res.status(404).json("Memory does not exist.")
    } else {
        const memoryToLike = await models.Memory.findOne({
            where: {
                'uuid': req.body.memory_uuid
            },
        })
        memoryToLike.num_likes = req.body.num_likes;
        await memoryToLike.save();
        return res.status(200).send()
    }
}



module.exports = {
    getMemories,
    createMemory,
    likeMemory,
}