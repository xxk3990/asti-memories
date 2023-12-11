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
            const comments = await models.Comment.findAll({
                where: {
                    'memory_uuid': posts[i].uuid
                },
                raw: true
            })
            const op = await models.User.findOne({
                where: {
                    'uuid': posts[i].user_uuid
                }
            })
            const frontEndComments = []
            posts[i].name = op.display_name; //add OP's display name to post info
            if (comments.length !== 0) {
                for(const com of comments) {
                    const commentUser = await models.User.findOne({
                        where: {
                            'uuid': com.user_uuid
                        }
                    })
                    const postComment = {
                        commenter_name: commentUser.display_name,
                        comment_text: com.comment_text
                    }
                    frontEndComments.push({...postComment})
                    //add list of people who commented on a post to the FE object
                    posts[i].comments = frontEndComments;
                    console.log(posts)
                }
            } else {
                posts[i].comments = []
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

const addComment = async (req, res) => {
    const comment = req.body.comment;
    try {
        const newComment = {
            uuid: uuidv4(),
            memory_uuid: comment.memory_uuid,
            user_uuid: comment.user_uuid,
            comment_text: comment.comment_text
        }
        await models.Comment.create(newComment);
        return res.status(200).send();
    } catch {
        return res.status(400).send();
    }
}

module.exports = {
    getMemories,
    createMemory,
    likeMemory,
    addComment
}