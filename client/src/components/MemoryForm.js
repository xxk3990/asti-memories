import '../styles/memory-form.css'
import {React, useState, useEffect, useRef} from 'react'
import {handleGet, handlePost} from '../services/requests-service'
import { useNavigate } from 'react-router-dom'
import {Snackbar} from '@mui/material'
import {useForm} from "react-hook-form"
import astiFront from "../images-static/asti-front.jpeg"
import ReCAPTCHA from "react-google-recaptcha"
import AWS from "aws-sdk"
import axios from 'axios'
export default function MemoryForm() {
    const NODE_URL = process.env.REACT_APP_NODE_LOCAL || process.env.REACT_APP_NODE_PROD
    const bucketName = process.env.REACT_APP_IMAGE_BUCKET_NAME;
    const bucketRegion = process.env.REACT_APP_IMAGE_BUCKET_REGION;
    const bucketAccessKey = process.env.REACT_APP_IMAGE_BUCKET_ACCESS_KEY;
    const bucketSecretKey = process.env.REACT_APP_IMAGE_BUCKET_SECRET_KEY;
    const SITE_KEY = '6LffBlMpAAAAADK37hlL29ERh8ba5EMhRtPCli6o'
    const [recaptchaValue, setRecaptchaValue] = useState(null);
    const [imageToUpload, setImageToUpload] = useState(null);
    const [caption, setCaption] = useState("");

    let randomizedFileName = ""
    const randomizeFileName = async() => {
        //this endpoint generates a random unique file name for the user's image.
        const url = `${NODE_URL}/randomize`
        await axios.get(url).then(response => {
            randomizedFileName = response.data.randomized_name
        })
    }

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm()

    useEffect(() => {
        document.title = "Asti Memories"
        randomizeFileName()
    })

    const credentials = {
        accessKeyId: bucketAccessKey,
        secretAccessKey: bucketSecretKey,
    }
    
    const uploadToS3 = async() => {
        console.log("random file name:", randomizedFileName)
        const filextension = imageToUpload.type.split('/'); //get second half of mimetype
        AWS.config.update({
            accessKeyId: bucketAccessKey,
            secretAccessKey: bucketSecretKey,
        });

        const s3 = new AWS.S3({
            credentials: credentials,
            params: { Bucket: bucketName },
            region: bucketRegion,
        });

        const params = {
            Bucket: bucketName,
            Key: `${randomizedFileName}.${filextension[1]}`, //add it to end of randomized image name
            Body: imageToUpload,
            // ContentType
        };
        
        const upload = s3.putObject(params);
        await upload.on('success', (e) => {
            console.log(e)
        }).promise();
    }

    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("")

    const submitMemory = async(data) => {
        const token = recaptchaValue;
        const recaptchaEndpoint = `recaptcha`
        const recaptchaBody = {
            recaptcha_token: token,
        }
        const recaptchaResponse = await handlePost(recaptchaEndpoint, recaptchaBody)
        const recaptchaData = await recaptchaResponse.data;
        if(recaptchaData.human) {
            const userID = sessionStorage.getItem("user_uuid")
            const requestBody = {
                user_uuid: userID,
                name: data.name,
                occasion: data.occasion,
                experience: data.experience,
                image_name: '',
                image_caption: caption
            }
            if(imageToUpload != null) {
                await uploadToS3()
                const filextension = imageToUpload.type.split('/');
                //set image name to fully randomized name
                requestBody.image_name = `${randomizedFileName}.${filextension[1]}` 
            } else {
                requestBody.image_name = null;
            }
            const endpont = `memories`;
            
            try {
                const response = await handlePost(endpont, requestBody);
                const serverData = await response.data;
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
                        randomizedFileName = "" //reset random file name just in case
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
        <div className='MemoryForm'>
           
            <Snackbar open={openSnackbar} autoHideDuration={1500} message={snackbarMessage} anchorOrigin={{horizontal: "center", vertical:"top"}}/>
            <section className = "restaurant-info">
                <h3 className='asti-verbiage'>The <em>Asti</em>, a landmark New York City restaurant, brought opera from the uptown stage to
                    the downtown dinner table from 1924 to 2000. Located in Greenwich Village, back in
                    the day when “the Village” was the creative heart of Manhattan, the Asti was known as
                    the home of the singing waiters and the go-to hotspot to discover budding opera talents
                    who then went on to illustrious careers. Founder Adolfo Mariani, a baritone himself,
                    created the Asti with the idea that opera was not only for the elite. He was convinced,
                    that served up with dinner, famous arias, duets, rousing choruses and a dose of
                    audience participation anyone could and would become an opera lover. And they did.</h3>
                    <img className='asti-front-img' src={astiFront} alt="asti-front"/>
                    <h3 className='asti-verbiage'>
                        This is Angela Mariani, Adolfo’s youngest daughter, and my life’s goal has been to write
                        a memoir about the Asti. 25 years have passed since the Asti closed, memories fade,
                        including my own, and by sharing, you will help bring the Asti story to life.
                        Whatever you choose to share will remain anonymous and you are not required to
                        provide any personal information.
                    </h3>
            </section>
          
            <section>
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
                    <span className='memory-form-question responder-image'>(Optional) Upload an image with a caption!
                        <h5 className='anonymous-note'>To keep this anonymous, your image file name will be replaced with a randomized name. </h5>
                        <input type ="file" name='image' className='user-input' onChange={e => setImageToUpload(e.target.files[0])} />
                        Add Caption: <input type="text" name="caption" onChange={e => setCaption(e.target.value)}/>
                    </span>

                    <ReCAPTCHA sitekey={SITE_KEY} type="image" onChange={(val) => setRecaptchaValue(val)}/>
                    <button disabled={!recaptchaValue} className='submit-btn'>Submit</button>
                </form>
            </section>
        </div>
    )
}