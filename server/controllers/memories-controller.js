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
            const likes = await models.Like.findAll({
                where: {
                    'memory_uuid': posts[i].uuid
                },
                raw: true
            })
            const op = await models.User.findOne({ where: {'uuid': posts[i].user_uuid}})
            posts[i].name = op.display_name; //add OP's display name to post info
            if (likes.length !== 0) {
                likes.map(like => {
                    //add list of people who liked a post to the FE object
                    posts[i].liked_by = [like.user_uuid]
                    console.log(posts)
                })
            } else {
                posts[i].liked_by = []
            }
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

    }
}

const likeMemory = async (req, res) => {
    const memoryToLike = await models.Memory.findOne({
        where: {
            'uuid': req.body.memory_uuid
        }
    })
    const matchingUser = await models.User.findOne({ where: {'uuid': memoryToLike.user_uuid}})
    models.sequelize.transaction(async () => {
        memoryToLike.num_likes = req.body.num_likes;
        await memoryToLike.save();
        const newLike = {
            uuid: uuidv4(),
            memory_uuid: req.body.memory_uuid,
            user_uuid: matchingUser.uuid
        }
        models.Like.create(newLike)
        return res.status(200).send()
    })
}

module.exports = {
    getMemories,
    createMemory,
    likeMemory
}