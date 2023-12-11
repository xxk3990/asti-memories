import '../styles/landing.css'
import {React, useState, useEffect} from 'react'
import {handlePost} from '../services/requests-service'
import { useNavigate } from 'react-router-dom'
import {Snackbar} from '@mui/material'
export default function Landing() {
    const [newMemory, setNewMemory] = useState({
        name: '',
        occasion: '',
        experience: '',
    })
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("")
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
                    navigate("/memories")
                }, 1500)
                
                } else {
                alert("Memory could not be saved, try again.")
            }
        } catch {
            alert("Memory could not be saved, try again.")
        }
    }
    return (
        <div className='Landing'>
            <Snackbar open={openSnackbar} autoHideDuration={1500} message={snackbarMessage} anchorOrigin={{horizontal: "center", vertical:"top"}}/>
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
    )
}