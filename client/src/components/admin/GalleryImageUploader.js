import { React, useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import {v4 as uuidv4} from 'uuid'
import { handleGet, handlePost } from '../../services/requests-service';
import axios from 'axios';
import AWS from "aws-sdk"
import {Snackbar} from '@mui/material'
import "../../styles/gallery-uploader.css"

export default function GalleryImageUploader() {
    const bucketName = process.env.REACT_APP_GALLERY_IMAGES_BUCKET;
    const bucketRegion = `us-east-1` //different to memory images region
    const bucketAccessKey = process.env.REACT_APP_IMAGE_BUCKET_ACCESS_KEY;
    const bucketSecretKey = process.env.REACT_APP_IMAGE_BUCKET_SECRET_KEY;
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const navigate = useNavigate();
    useEffect(() => {
        //prevents access to this page without logging in!
        if(sessionStorage.getItem("admin_uuid") === null) {
            navigate('/memories')
        }
    })
    
    const [imageToUpload, setImageToUpload] = useState(null);
    const [caption, setCaption] = useState("");
    const credentials = {
        accessKeyId: bucketAccessKey,
        secretAccessKey: bucketSecretKey,
    }
    
    const uploadToS3 = async() => {
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
            Key: imageToUpload.name,
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

    const submitImageToDB = async() => {
        try {
            await uploadToS3();
            const endpoint = `gallery`
            const requestBody = {
                image_key: imageToUpload.name,
                image_caption: caption
            }
            const response = await handlePost(endpoint, requestBody)
            if(response.status === 201) {
                setOpenSnackbar(true);
                setSnackbarMessage("Gallery upload successful!")
                setTimeout(() => {
                    setOpenSnackbar(false);
                    setSnackbarMessage("")
                }, 1500)
                
            } else {
                alert("Image could not be uploaded, try again.")
            }
        } catch {
            alert("Unable to upload.")
        }
    }
        
    return (
        <div className='GalleryImageUploader'>
            <h1>Upload to Gallery</h1>
            <Snackbar open={openSnackbar} autoHideDuration={1500} message={snackbarMessage} anchorOrigin={{horizontal: "center", vertical:"top"}}/>
            <section className='gallery-form'>
                <span className='responder-image'>
                    Upload an image to the gallery: <input type ="file" name='image' className='user-input-image' onChange={e => setImageToUpload(e.target.files[0])} />
                </span>
                <span className='responder-image'>
                    <label for="caption">Add Caption:</label> <input type="text" id="caption" name="caption" onChange={e => setCaption(e.target.value)}/>
                </span>
                <button className='submit-btn' onClick={submitImageToDB}>Submit</button>
            </section>
        </div>
    )
}