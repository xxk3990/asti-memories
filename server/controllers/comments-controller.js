const {
    v4: uuidv4
} = require('uuid')
const models = require('../models');

const getComments = async (req, res) => {
    const comments = await models.Comment.findAll({
        where: {
            'memory_uuid': req.query.memory_uuid
        },
        include: {
            model: models.User,
            attributes: ["display_name"],
            as: "commenter_name"
        },
    })
    return res.status(200).send(comments)
}

const addComment = async (req, res) => {
    const comment = req.body.comment;
    if(!comment) {
        return res.status(400).json("Unable to post comment.");
    } else {
        try {
            const newComment = {
                uuid: uuidv4(),
                memory_uuid: comment.memory_uuid,
                user_uuid: comment.user_uuid,
                comment_text: comment.comment_text
            }
            await models.Comment.create(newComment);
            return res.status(201).send();
        } catch {
            return res.status(400).send();
        }
    }
    
}

module.exports = {
    addComment,
    getComments
}