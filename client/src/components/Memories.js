import '../styles/memories.css'
import { React, useState, useEffect, memo} from 'react'
import { handleGet, handlePost, handlePut } from '../services/requests-service'
import {Snackbar} from '@mui/material'
import {v4 as uuidv4} from 'uuid'

export default function Memories() {
  const [memories, setMemories] = useState([]);
  
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("")

  const getMemories = async() => {
    const endpoint = `memories`
    await handleGet(endpoint, setMemories)
  }
  useEffect(() => {
    document.title = "Asti Memories"
    getMemories();
  }, [])
  
  const likePost = async(memory) => {
    const endpoint = `memories`;
    const requestBody = {
      memory_uuid: memory.uuid,
      num_likes: memory.num_likes + 1,
    }
    const response = await handlePut(endpoint, requestBody)
    if(response.status === 200 || response.status === 201) {
      getMemories();
    } else {
      alert("post like failed.")
    }
  }
  const submitComment = async (comment, setNewComment) => {
    const endpoint = `comments`
    const requestBody = {
      comment: comment
    }
    try {
      const response = await handlePost(endpoint, requestBody)
      if(response.status === 200) {
        setOpenSnackbar(true);
        setSnackbarMessage("Comment added successfully!")
        setTimeout(() => {
          setOpenSnackbar(false);
          setSnackbarMessage("")
          //clear comment form on comment submit success
          setNewComment({
            memory_uuid: "",
            user_uuid: "",
            comment_text: "",
          });
          getMemories()
        }, 1500)
                
      } else {
        alert("Comment could not be saved, try again.")
      }
    } catch {
      alert("comment could not be added.")
    }
  } 
  if(memories.length === 0) {
    return (
      <div className="Memories">
        <Snackbar open={openSnackbar} autoHideDuration={1500} message={snackbarMessage} anchorOrigin={{horizontal: "center", vertical:"top"}}/>
        <section className='memories-grid'>
          <h4>No memories yet.</h4>
        </section>
      </div>
    );
  } else {
    console.log(memories)
    return (
      <div className="Memories">
        <Snackbar open={openSnackbar} autoHideDuration={1500} message={snackbarMessage} anchorOrigin={{horizontal: "center", vertical:"top"}}/>
        <section className='memories-grid'>
          {memories.map(m => {
            return <MemoryTile m={m} likePost={likePost} submitComment={submitComment}/>
          })}
        </section>
      </div>
    );
  }
 
}


const MemoryTile = (props) => {
  const m = props.m;
  const likePost = props.likePost;
  const [likeDisabled, setLikeDisabled] = useState(false)
  const [showComments, setShowComments] = useState(false); //show and hide comment view
  const submitComment = props.submitComment;
  const handleClick = () => {
    likePost(m);
    setLikeDisabled(!likeDisabled)
  }
  if(m.num_likes === 0) {
    return (
      <section className='memory'>
        <h4>Name: {m.name}</h4>
        <h4>Special Occasion: {m.occasion}</h4>
        <h4>Experience: {m.experience}</h4>
        <h4>Likes: {m.num_likes}</h4>
        <button onClick = {handleClick}>+</button>
      </section>
    )
  } else {
    return (
      <section className='memory'>
        <h4>Name: {m.name}</h4>
        <h4>Special Occasion: {m.occasion}</h4>
        <h4>Experience: {m.experience}</h4>
        <h4>Likes: {m.num_likes}</h4>
        <button onClick = {handleClick} disabled={likeDisabled}>+</button>
        <button onClick ={() => setShowComments(!showComments)}>{showComments ? `Hide ${String.fromCharCode(8593)}` : `View Comments (${m.comments.length}) ${String.fromCharCode(8595)}`}</button>
        {showComments ? 
        <ViewComments
          m = {m}
          submitComment={submitComment} 
        /> 
        : null}
      </section>
    )
  }
}



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


