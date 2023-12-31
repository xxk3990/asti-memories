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
        return res.send([])
    }
}

const createMemory = async (req, res) => {
    try {
        models.sequelize.transaction(async () => {
            const user = req.body.user_uuid;
            if (user === null) {
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
                return res.status(200).json({
                    newMemory: newMemory,
                    user_uuid: newUser.uuid,
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
                return res.status(200).json({
                    newMemory: newMemory,
                    user_uuid: user,
                });
            }


        })
    } catch {
        return res.status(400).send();
    }
}

const likeMemory = async (req, res) => {
    const memoryToLike = await models.Memory.findOne({
        where: {
            'uuid': req.body.memory_uuid
        },
    })
    if (memoryToLike !== null) {
        memoryToLike.num_likes = req.body.num_likes;
        await memoryToLike.save();
        return res.status(200).send()
    } else {
        return res.status(400).send()
    }
}



module.exports = {
    getMemories,
    createMemory,
    likeMemory,
}