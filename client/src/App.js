import logo from './logo.svg';
import './App.css';
import { React, useState, useEffect} from 'react'
import { handleGet, handlePost } from './services/requests-service';
import {Snackbar} from '@mui/material'

function App() {
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
    const requestBody = {
      name: newMemory.name,
      occasion: newMemory.occasion,
      experience: newMemory.experience
    }
    try {
      const response = await handlePost(endpont, requestBody);
      console.log("POST response:", response)
      const data = await response.json();
      if(response.status === 200 || response.status === 201) {
        setMemories([...memories, data]);
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
  if(memories.length === 0) {
    return (
      <div className="App">
        <Snackbar open={openSnackbar} autoHideDuration={1500} message={snackbarMessage} anchorOrigin={{horizontal: "center", vertical:"top"}}/>
        <section className='gallery'>
          <h4>Image gallery goes here later</h4>
        </section>
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
    return (
      <div className="App">
        <Snackbar open={openSnackbar} autoHideDuration={1500} message={snackbarMessage} anchorOrigin={{horizontal: "center", vertical:"top"}}/>
        <section className='gallery'>
          <h4>Image gallery goes here later</h4>
        </section>
        <section className='memories-grid'>
          {memories.map(m => {
            return <MemoryTile m={m}/>
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
  return (
    <section className='memory'>
      <h4>Name: {m.name}</h4>
      <h4>Special Occasion: {m.occasion}</h4>
      <h4>Experience: {m.experience}</h4>
    </section>
  )
}

export default App;
