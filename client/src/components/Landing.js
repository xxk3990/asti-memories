import '../styles/landing.css'
import {React, useState, useEffect} from 'react'
import {handlePost} from '../services/requests-service'
import { useNavigate } from 'react-router-dom'
import {Snackbar} from '@mui/material'
import {useForm} from "react-hook-form"
export default function Landing() {
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm()
    useEffect(() => {
        document.title = "Asti Memories"
    })
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const submitMemory = async(data) => {
        const endpont = `memories`;
        const userID = sessionStorage.getItem("user_uuid")
        const requestBody = {
            user_uuid: userID,
            name: data.name,
            occasion: data.occasion,
            experience: data.experience
        }
        try {
            const response = await handlePost(endpont, requestBody);
            console.log("POST response:", response)
            const serverData = await response.data;
            console.log("response data:", serverData)
            if(response.status === 200 || response.status === 201) {
                if(userID === null) {
                    sessionStorage.setItem("user_uuid", serverData.user_uuid)
                }
                setOpenSnackbar(true);
                setSnackbarMessage("Memory added successfully!")
                setTimeout(() => {
                    setOpenSnackbar(false);
                    setSnackbarMessage("")
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
            <section className = "restaurant-info">
                <h4>The <em>Asti</em> was an Italian Restaurant in New York City famous for the opera tunes sung in the restaurant. It was located in Downtown Manhattan, New York City, and was open from 1924-2000.</h4>
            </section>
            <section>
                <h4>Have a memory of the <em>Asti</em> Restaurant you'd like to share? Posts that are unrelated to the <em>Asti</em>Restaurant will be deleted by an admin. </h4>
                <form className='memory-form' onSubmit={handleSubmit(submitMemory)}>
                    <span className='memory-form-question' id="responder-name">Your display name (SFW): 
                        <input type="text" name="name" className='user-input' {...register("name", { required: true})} />
                    </span>
                    <span className='memory-form-question' id="responder-occasion">Was your visit to the <em>Asti</em> a special occasion (birthday, date, anniversary, rehearsal dinner, etc.)? If no, put "no" in the response field. 
                        <input type="text" name="occasion" className='user-input' {...register("occasion", { required: true})} />
                    </span>
                    <span className='memory-form-question' id="responder-experience">Describe your experience! 
                        <textarea name="experience" className='user-input' {...register("experience", { required: true})}></textarea>
                    </span>
                    {errors.exampleRequired && <span>This field is required</span>}
                    <button type="submit">Submit</button>
                </form>
            </section>
        </div>
    )
}