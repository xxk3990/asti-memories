import '../styles/memories.css'
import { React, useState, useEffect, memo} from 'react'
import { handleGet, handlePost, handlePut } from '../services/requests-service'
import {Snackbar} from '@mui/material'
import {v4 as uuidv4} from 'uuid'
import { MemoryTile } from './child-components/MemoryTile'

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
  /* 
    This method – and the submitComment fn below it – is called from the ViewComments child-component 
    in MemoryTile.js. The parameters come from there. 
    Had to call them here (rather than inside that file) because on success both call getMemories().
  */
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


  const submitComment = async (comment, setNewComment, getComments) => {
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

