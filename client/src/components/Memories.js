import '../styles/memories.css'
import { React, useState, useEffect, memo} from 'react'
import { handlePost, handlePut } from '../services/requests-service'
import {Snackbar} from '@mui/material'
import { MemoryTile } from './child-components/MemoryTile'
import axios from 'axios'
export default function Memories() {
  <link rel="stylesheet" href="../../styles/memories.css"/>
  const [memories, setMemories] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const user = sessionStorage.getItem("user_uuid")

  const getMemories = async() => {
    const NODE_URL = process.env.REACT_APP_NODE_LOCAL || process.env.REACT_APP_NODE_PROD
    const url = `${NODE_URL}/memories`
    await axios.get(url).then(response => {
      if(response.data) {
        setMemories(response.data.sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt)))
      } else {
        setMemories([])
      }
      
    })
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

  /* 
    This method is called from the ViewComments child-component in MemoryTile.js. 
    The parameters come from there. 
    I wanted to call them here (rather than inside that file) because I wanted the snackbar to work for comments.
  */
  const submitComment = async (comment, commentUser, setCommentUser, setNewComment, getComments) => {
    console.log('comment:',comment)
    const endpoint = `comments`
    const requestBody = {
      comment: comment,
      user_display_name: commentUser
    }
    try {
      const response = await handlePost(endpoint, requestBody)
      if(response.status === 200 || response.status === 201) {
        const serverData = await response.data;
        setOpenSnackbar(true);
        setSnackbarMessage("Comment added successfully!")
        if(user === null) {
          sessionStorage.setItem("user_uuid", serverData.new_user_uuid)
        }
        setTimeout(() => {
          setOpenSnackbar(false);
          setSnackbarMessage("")
          //clear comment form on comment submit success
          setNewComment({
            comment_text: "",
          });
          setCommentUser("")
          getComments(); //call get comments GET request method declared in memoryTile.js and passed in here
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
        <h1>Shared Memories</h1>
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

