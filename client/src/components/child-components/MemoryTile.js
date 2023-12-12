import { React, useState} from 'react'
import {v4 as uuidv4} from 'uuid'

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
    return (
        <section className='memory'>
            <h4>Name: {m.name}</h4>
            <h4>Special Occasion: {m.occasion}</h4>
            <h4>Experience: {m.experience}</h4>
            <h4>Likes: {m.num_likes}</h4>
            <button onClick = {handleClick} disabled={likeDisabled}>Like</button>
            <button onClick ={() => setShowComments(!showComments)}>{showComments ? `Hide ${String.fromCharCode(8593)}` : `View Comments (${m.comments.length}) ${String.fromCharCode(8595)}`}</button>
            {showComments ? <ViewComments m = {m} submitComment={submitComment} /> : null}
        </section>
    )
}

//child component for each memory's comments
const ViewComments = (props) => {
    const m = props.m;
    const submitComment = props.submitComment;
    const [newComment, setNewComment] = useState({
      memory_uuid: m.uuid,
      user_uuid: sessionStorage.getItem("user_uuid"),
      comment_text: ""
    })
    const handleSubmit = () => {
      //if they hit submit but haven't entered a comment, don't do anything
      if(newComment.comment_text === "") { 
        return;
      } else {
        submitComment(newComment, setNewComment)
      }
    }
    const handleChange = (name, value) => {
      setNewComment({...newComment, [name]:value})
    }
    if(m.comments.length === 0) {
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
          <h4>Comments</h4>
          <ul className='comments-list'>
            {
              m.comments.map(com => {
                return (
                  <li key={uuidv4()}>{com.commenter_name}: {com.comment_text}</li>
                )
              })
            }
          </ul>
          <span className='new-comment'>
            <input type="text" name="comment_text" value={newComment.comment_text} onChange={(e) => handleChange(e.target.name, e.target.value) }/>
            <button onClick = {handleSubmit}>Post comment</button>
          </span>
        </section>
      )
    
    }
}
  
