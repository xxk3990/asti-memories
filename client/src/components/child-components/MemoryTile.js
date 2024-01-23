import { React, useState, useEffect} from 'react'
import {v4 as uuidv4} from 'uuid'
import { handleGet } from '../../services/requests-service';
import axios from 'axios';
const NODE_URL = process.env.REACT_APP_NODE_LOCAL || process.env.REACT_APP_NODE_PROD
//child component for each memory
export const MemoryTile = (props) => {
  const m = props.m;
  const likePost = props.likePost;
  const [likeDisabled, setLikeDisabled] = useState(false)
  const [showComments, setShowComments] = useState(false); //show and hide comment view
  const submitComment = props.submitComment;
  const handleClick = () => {
    likePost(m);
    setLikeDisabled(!likeDisabled)
  }
  const [comments, setComments] = useState([])
  const getComments = async() => {
    const endpoint = `comments?memory_uuid=${m.uuid}`
    await handleGet(endpoint, setComments)
  }
  console.log("comments:", comments)
  return (
    <section className='memory'>
        <h4>Name: {m.name}</h4>
        <h4>Special Occasion: {m.occasion}</h4>
        <h4>Experience: {m.experience}</h4>
        <h4>Likes: {m.num_likes}</h4>
        <button className='interaction-btn' onClick = {handleClick} disabled={likeDisabled}>Like</button>
        <button className='interaction-btn' onClick ={() => {
          getComments()
          setShowComments(!showComments);
        }}>{showComments ? `Hide ${String.fromCharCode(8593)}` : `View Comments ${String.fromCharCode(8595)}`}</button>
        {showComments ? <ViewComments m = {m} getComments={getComments} comments={comments} submitComment={submitComment} /> : null}
    </section>
  )
}

//child component for each memory's comments
const ViewComments = (props) => {
    const m = props.m;
    const submitComment = props.submitComment;
    const comments = props.comments;
    const getComments = props.getComments
    const user = sessionStorage.getItem("user_uuid")
    
    const [commentUser, setCommentUser] = useState("");
    const checkForUser = async() => {
      if(user !== null) {
        const checkUserEndpoint = `users?user_uuid=${user}`
        const url = `${NODE_URL}/${checkUserEndpoint}`
        await axios.get(url).then(response => {
          const data = response.data;
          if(data.display_name) {
            setCommentUser(data.display_name)
          }
        })
      }
    }

    useEffect(() => {
      checkForUser();
    }, [])
    
    const [newComment, setNewComment] = useState({
      memory_uuid: m.uuid,
      user_uuid: user,
      comment_text: ""
    })
    const handleSubmit = () => {
      //if they hit submit but haven't entered a comment, don't do anything
      if(newComment.comment_text === "") { 
        return;
      } else {
        //ensures memory_uuid and user_uuid are sent in each payload
        newComment.memory_uuid = m.uuid;
        newComment.user_uuid = user
        submitComment(newComment, commentUser, setCommentUser, setNewComment, getComments)
      }
    }
    const handleChange = (name, value) => {
      setNewComment({...newComment, [name]:value})
    }
    const handleUserChange = (value) => {
      setCommentUser(value)
    }
    //TODO: ADD reCAPTCHA TO PUBLIC COMMENT FORM
    if(comments.length === 0) {
      return (
        <section className='comments-container'>
          <h4>No comments yet, be the first to comment!</h4>
          <section className='new-comment'>
            <span>Display name: <input type="text" value={commentUser} name="commentUser" onChange={(e) => handleUserChange(e.target.value)} /></span>
            <span>Comment: <input type="text" name="comment_text" value={newComment.comment_text} onChange={(e) => handleChange(e.target.name, e.target.value) }/></span>
            <button className='interaction-btn submit-comment-btn' onClick = {handleSubmit}>Post comment</button>
          </section>
        </section>
      )
    } else {
      return (
        <section className='comments-container'>
          <h4 className='comments-count'>Comments ({comments.length})</h4>
          <section className='comments-list-container'>
            <ul className='comments-list'>
              {
                comments.map(com => {
                  return (
                    <li key={uuidv4()}>{com.commenter_name.display_name}: {com.comment_text}</li>
                  )
                })
              }
            </ul>
          </section>
          <section className='new-comment'>
            <span>Display name: <input type="text" value={commentUser} name="commentUser" onChange={(e) => handleUserChange(e.target.value)} /></span>
            <span>Comment: <input type="text" name="comment_text" value={newComment.comment_text} onChange={(e) => handleChange(e.target.name, e.target.value) }/></span>
            <button className='interaction-btn submit-comment-btn' onClick = {handleSubmit}>Post comment</button>
          </section>
        </section>
      )
    
    }
}
  
