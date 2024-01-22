import { React, useState, useEffect} from 'react'
import {v4 as uuidv4} from 'uuid'
import { handleGet } from '../../services/requests-service';
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
        <button onClick = {handleClick} disabled={likeDisabled}>Like</button>
        <button onClick ={() => {
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
        submitComment(newComment, setNewComment, getComments)
      }
    }
    const handleChange = (name, value) => {
      setNewComment({...newComment, [name]:value})
    }
    if(comments.length === 0) {
      return (
        <section className='comments-container'>
          <h4>No comments yet, be the first to comment!</h4>
          <span className='new-comment'>
            <input type="text" name="comment_text" value={newComment.comment_text} onChange={(e) => handleChange(e.target.name, e.target.value)}/>
            <button onClick = {handleSubmit}>Post comment</button>
          </span>
        </section>
      )
    } else {
      return (
        <section className='comments-container'>
          <h4>Comments ({comments.length})</h4>
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
            <input type="text" name="comment_text" value={newComment.comment_text} onChange={(e) => handleChange(e.target.name, e.target.value) }/>
            <button onClick = {handleSubmit}>Post comment</button>
          </section>
        </section>
      )
    
    }
}
  
