import styles from '../styles/memory-form.css'
import {React, useState, useEffect, useRef} from 'react'
import {handleGet, handlePost} from '../services/requests-service'
import { useNavigate } from 'react-router-dom'
import {Snackbar} from '@mui/material'
import {useForm} from "react-hook-form"
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
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [formUser, setFormUser] = useState("")
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm()
    const user = sessionStorage.getItem("user_uuid")
    const checkForUser = async() => {
        //if the user already created a temp user (via commenting for example), grab temp display_name
        if(user !== null) {
            const checkUserEndpoint = `users?user_uuid=${user}`
            const url = `${NODE_URL}/${checkUserEndpoint}`
            await axios.get(url).then(response => {
                const data = response.data;
                if(data.display_name) {
                    setFormUser(data.display_name)
                }
            })
        }
    }
    useEffect(() => {
        checkForUser();
    })
    let randomizedFileName = ""
    const randomizeFileName = async() => {
        //this endpoint generates a random unique file name for the user's image.
        const url = `${NODE_URL}/randomize`
        await axios.get(url).then(response => {
            randomizedFileName = response.data.randomized_name
        })
    }

    

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

        const s3Object = new AWS.S3({
            credentials: credentials, //authenticate s3 connection
            params: { Bucket: bucketName },
            region: bucketRegion,
        });

        const imagePayload = {
            Bucket: bucketName,
            Key: `${randomizedFileName}.${filextension[1]}`, //add it to end of randomized image name
            Body: imageToUpload,
            // ContentType
        };
        
        const imageResponse = s3Object.putObject(imagePayload);
        await imageResponse.on('success', (e) => {
            console.log(e)
        }).promise();
        console.log("image response:", imageResponse)
        //add .on error
    }

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
                image_key: '',
                image_caption: caption
            }
            if(imageToUpload != null) {
                await uploadToS3()
                const filextension = imageToUpload.type.split('/');
                //set image name to fully randomized name
                requestBody.image_key = `${randomizedFileName}.${filextension[1]}` 
            } else {
                requestBody.image_key = null;
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
            <section>
                <h1 className='form-title'>Share Your Experience at the <em>Asti!</em></h1>
                
                <form className='memory-form' onSubmit={handleSubmit(submitMemory)}>
                    <span className='memory-form-question' id="responder-name"><label for ="name">Enter a name to use while on the site: </label>
                        <input type="text" name="name" id = "name" className='user-input' {...register("name", { required: true})} defaultValue={formUser === "" ? "" : formUser}/>
                        {formUser === "" ? errors.name && <span className='required-note'>This field is required</span> : ''}
                    </span>
                    <span className='memory-form-question' id="responder-occasion"><label for ="occasion">(Optional) Was your visit to the <em> Asti </em> a special occasion (birthday, date, anniversary, rehearsal dinner, etc.)?</label>
                        <input type="text" name="occasion" id="occasion" className='user-input' {...register("occasion")} />
                    </span>
                    <span className='memory-form-question' id="responder-experience"><label for="experience">Describe your experience! </label>
                        <textarea id ="experience" name="experience" className='user-input' {...register("experience", { required: true})}></textarea>
                        {errors.experience && <span className='required-note'>This field is required</span>}
                    </span>
                    <span className='responder-image'>
                        (Optional) Upload an image with a caption! <input type ="file" name='image' className='user-input-image' onChange={e => setImageToUpload(e.target.files[0])} />
                    </span>
                    <span className='responder-image'>
                        <label for="caption">Add Caption:</label> <input type="text" id="caption" name="caption" onChange={e => setCaption(e.target.value)}/>   
                    </span>
                    <h4 className='anonymous-note'>To keep things anonymous, we do not require a proper login. When you close this tab in your browser, all temporary user info will be forgotten. If you uploaded an image, its file name will be replaced with a randomized one.</h4>
                    <h4 className='instructions'> Posts that are unrelated to the <em>Asti</em> Restaurant will be deleted by an admin.</h4>
                    <ReCAPTCHA sitekey={SITE_KEY} type="image" onChange={(val) => setRecaptchaValue(val)}/>
                    <button disabled={!recaptchaValue} className='submit-btn'>Submit</button>
                </form>
            </section>
        </div>
    )
}