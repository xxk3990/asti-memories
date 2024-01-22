import '../styles/landing.css'
import {React, useState, useEffect, useRef} from 'react'
import {handlePost} from '../services/requests-service'
import { useNavigate } from 'react-router-dom'
import {Snackbar} from '@mui/material'
import {useForm} from "react-hook-form"
import astiFront from "../images-static/asti-front.jpeg"
import ReCAPTCHA from "react-google-recaptcha"
export default function Landing() {
    const SITE_KEY = '6LffBlMpAAAAADK37hlL29ERh8ba5EMhRtPCli6o'
    const [recaptchaValue, setRecaptchaValue] = useState(null);
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
    console.log(astiFront)

    const submitMemory = async(data) => {
        const token = recaptchaValue;
        const recaptchaEndpoint = `recaptcha`
        const recaptchaBody = {
            recaptcha_token: token,
        }
        const recaptchaResponse = await handlePost(recaptchaEndpoint, recaptchaBody)
        const recaptchaData = await recaptchaResponse.data;
        if(recaptchaData.human) {
            const endpont = `memories`;
            const userID = sessionStorage.getItem("user_uuid")
            const requestBody = {
                user_uuid: userID,
                name: data.name,
                occasion: data.occasion,
                experience: data.experience,
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
                        setRecaptchaValue("")
                        navigate("/memories")
                    }, 1500)
                    
                    } else {
                    alert("Memory could not be saved, try again.")
                }
            } catch {
                alert("Memory could not be saved, try again.")
            }
        } else {
            alert("You are a bot.")
        }
        
    }
    return (
        <div className='Landing'>
           
            <Snackbar open={openSnackbar} autoHideDuration={1500} message={snackbarMessage} anchorOrigin={{horizontal: "center", vertical:"top"}}/>
            <section className = "restaurant-info">
                <h3 className='asti-verbiage'>The <em>Asti</em>, a landmark New York City restaurant, brought opera from the uptown stage to
                    the downtown dinner table from 1924 to 2000. Located in Greenwhich Village, back in
                    the day when “the Village” was the creative heart of Manhattan, the Asti was known as
                    the home of the singing waiters and the go-to hotspot to discover budding opera talents
                    who then went on to illustrious careers. Founder Adolfo Mariani, a baritone himself,
                    creaed the Asti with the idea that opera was not only for the elite. He was convinced,
                    that served up with dinner, famous arias, duets, rousing choruses and a dose of
                    audience participation anyone could and would become an opera lover. And they did.</h3>
                    <img className='asti-front-img' src={astiFront} alt="asti-front"/>
                    <h3 className='asti-verbiage'>
                        This is Angela Mariani, Adolfo’s youngest daughter, and my life’s goal has been to write
                        a memoir about the Asti. 25 years have passed since the Asti closed, memories fade,
                        including my own, and by sharing, you will help bring the Asti story to life.
                        Whatever you choose to share will remain anonymous and you are not required to
                        provide any personal information. Below are some prompts but please feel free to share
                        in any way that inspires you.
                    </h3>
            </section>
          
            <section>
                <h3 className='instructions'>Have a memory of the <em>Asti</em> Restaurant you'd like to share? Your posts may appear anonymously in an upcoming book about the restaurant! </h3>
                <h4 className='instructions'> Posts that are unrelated to the <em>Asti</em> Restaurant will be deleted by an admin.</h4>
                <form className='memory-form' onSubmit={handleSubmit(submitMemory)}>
                    <span className='memory-form-question' id="responder-name">Your display name (SFW): 
                        <input type="text" name="name" className='user-input' {...register("name", { required: true})} />
                        {errors.name && <span className='required-note'>This field is required</span>}
                    </span>
                    <span className='memory-form-question' id="responder-occasion">Was your visit to the&nbsp;<em> Asti </em>&nbsp;a special occasion (birthday, date, anniversary, rehearsal dinner, etc.)? If no, put "no" in the response field. 
                        <input type="text" name="occasion" className='user-input' {...register("occasion", { required: true})} />
                        {errors.occasion && <span className='required-note'>This field is required</span>}
                    </span>
                    <span className='memory-form-question' id="responder-experience">Describe your experience! 
                        <textarea name="experience" className='user-input' {...register("experience", { required: true})}></textarea>
                        {errors.experience && <span className='required-note'>This field is required</span>}
                    </span>
                    <ReCAPTCHA sitekey={SITE_KEY} type="image" onChange={(val) => setRecaptchaValue(val)}/>
                    <button disabled={!recaptchaValue} className='submit-btn'>Submit</button>
                </form>
            </section>
        </div>
    )
}