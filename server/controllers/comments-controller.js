const {
    v4: uuidv4
} = require('uuid')
const models = require('../models');


const getNumberOfComments = async(req, res) => {
    const comments = await models.Comment.findAll({where: {'memory_uuid': req.query.memory_uuid}, raw:true})
    return res.status(200).json(comments.length)
}

const getComments = async (req, res) => {   
    if(!req.query.memory_uuid) {
        return res.status(404).json("Memory not found.")
    } else {
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
        if(comments.length !== 0) {
            return res.status(200).send(comments)
        } else {
            return res.status(204).json({})
        }
    }
    
    
    
}

const addComment = async (req, res) => {
    const comment = req.body.comment;
    if(!comment) {
        return res.status(400).json("Unable to post comment.");
    } else {
        if(comment.user_uuid === null) {
            try {
                const newComment = {
                    uuid: uuidv4(),
                    memory_uuid: comment.memory_uuid,
                    user_uuid: req.body.user_uuid,
                    comment_text: comment.comment_text
                }
                await models.Comment.create(newComment);
                return res.status(201).json({
                    new_user_uuid: newUser.uuid
                });
            } catch {
                return res.status(400).send("unable to post comment.")
            }
            
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
    
}

module.exports = {
    addComment,
    getComments,
    getNumberOfComments
}