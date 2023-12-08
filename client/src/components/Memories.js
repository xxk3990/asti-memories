import '../styles/memories.css'
import { React, useState, useEffect} from 'react'
import { handleGet, handlePost, handlePut } from '../services/requests-service'
import {Snackbar} from '@mui/material'

export default function Memories() {
  const [memories, setMemories] = useState([]);
  const [newMemory, setNewMemory] = useState({
    name: '',
    occasion: '',
    experience: '',
  })
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
  const handleChange = (name, value) => {
    setNewMemory({...newMemory, [name]:value})
  }
  const submitMemory = async() => {
    const endpont = `memories`;
    const userID = sessionStorage.getItem("user_uuid")
    const requestBody = {
      user_uuid: userID,
      name: newMemory.name,
      occasion: newMemory.occasion,
      experience: newMemory.experience
    }
    try {
      const response = await handlePost(endpont, requestBody);
      console.log("POST response:", response)
      const data = await response.json();
      if(response.status === 200 || response.status === 201) {
        setMemories([...memories, data.newMemory]);
        if(userID === null) {
            sessionStorage.setItem("user_uuid", data.user_uuid)
        }
        setOpenSnackbar(true);
        setSnackbarMessage("Memory added successfully!")
        setTimeout(() => {
            setOpenSnackbar(false);
            setSnackbarMessage("")
            setNewMemory({
              name: '',
              occasion: '',
              experience: ''
            })
        }, 1500)
        getMemories();
      } else {
        alert("Memory could not be saved, try again.")
      }
    } catch {
      alert("Memory could not be saved, try again.")
    }
    
  }
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
  if(memories.length === 0) {
    return (
      <div className="Memories">
        <Snackbar open={openSnackbar} autoHideDuration={1500} message={snackbarMessage} anchorOrigin={{horizontal: "center", vertical:"top"}}/>
        <section className='memories-grid'>
          <h4>No memories yet.</h4>
        </section>
        <section className='memory-form'>
          <h4>Have a memory of the Asti Restaurant you'd like to share? </h4>
          <span className='memory-form-question' id="responder-name">Your name (First name and last initial only): 
            <input type="text" name="name" className='user-input' value={newMemory.name} onChange={e => handleChange(e.target.name, e.target.value)} />
          </span>
          <span className='memory-form-question' id="responder-occasion">Was your visit to the Asti a special occasion (birthday, date, anniversary, rehearsal dinner, etc.)? If no, put "no" in the response field. 
            <input type="text" name="occasion" className='user-input' value={newMemory.occasion} onChange={e => handleChange(e.target.name, e.target.value)} />
          </span>
          <span className='memory-form-question' id="responder-experience">Describe your experience! 
            <textarea name="experience" className='user-input' value={newMemory.experience} onChange={e => handleChange(e.target.name, e.target.value)}></textarea>
          </span>
          <button type="button" onClick={submitMemory}>Submit</button>
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
            return <MemoryTile m={m} likePost={likePost}/>
          })}
        </section>
        <section className='memory-form'>
          <h4>Have a memory of the Asti Restaurant you'd like to share? </h4>
          <span className='memory-form-question' id="responder-name">Your name (First name and last initial only): 
            <input type="text" name="name" className='user-input' value={newMemory.name} onChange={e => handleChange(e.target.name, e.target.value)} />
          </span>
          <span className='memory-form-question' id="responder-occasion">Was your visit to the Asti a special occasion (birthday, date, anniversary, rehearsal dinner, etc.)? If no, put "no" in the response field. 
            <input type="text" name="occasion" className='user-input' value={newMemory.occasion} onChange={e => handleChange(e.target.name, e.target.value)} />
          </span>
          <span className='memory-form-question' id="responder-experience">Describe your experience! 
            <textarea name="experience" className='user-input' value={newMemory.experience} onChange={e => handleChange(e.target.name, e.target.value)}></textarea>
          </span>
          <button type="button" onClick={submitMemory}>Submit</button>
        </section>
      </div>
    );
  }
 
}


const MemoryTile = (props) => {
  const m = props.m;
  const likePost = props.likePost;
  const handleClick = () => {
    likePost(m);
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
    for(const user of m.liked_by) {
      console.log("like:",user)
      const sessionUser = sessionStorage.getItem("user_uuid")
      if(user === sessionUser) {
        return (
          <section className='memory'>
            <h4>Name: {m.name}</h4>
            <h4>Special Occasion: {m.occasion}</h4>
            <h4>Experience: {m.experience}</h4>
            <h4>Likes: {m.num_likes}</h4>
            <button onClick = {handleClick} disabled>+</button>
          </section>
        )
      } else {
        return (
          <section className='memory'>
            <h4>Name: {m.name}</h4>
            <h4>Special Occasion: {m.occasion}</h4>
            <h4>Experience: {m.experience}</h4>
            <h4>Likes: {m.num_likes}</h4>
            <button onClick = {handleClick}>+</button>
          </section>
        )
      }
    }
  }
}
