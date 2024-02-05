import { React, useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom';
import { handlePost } from '../../services/requests-service';
import AWS from "aws-sdk"
import {Snackbar} from '@mui/material'
import "../../styles/gallery-uploader.css"

export default function GalleryImageUploader() {
    const imageRef = useRef();
    const captionRef = useRef();
    const bucketName = process.env.REACT_APP_GALLERY_IMAGES_BUCKET;
    const bucketRegion = `us-east-1` //different to memory images region
    const bucketAccessKey = process.env.REACT_APP_IMAGE_BUCKET_ACCESS_KEY;
    const bucketSecretKey = process.env.REACT_APP_IMAGE_BUCKET_SECRET_KEY;
    const [caption, setCaption] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [imageToUpload, setImageToUpload] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        //prevents access to this page without logging in!
        if(sessionStorage.getItem("admin_uuid") === null) {
            navigate('/memories')
        }
    })
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
        await imageResponse.on("error", (e) => {
            alert("Error in image upload!")
        }).promise()
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
                    setCaption("")
                    setOpenSnackbar(false);
                    setSnackbarMessage("")
                    captionRef.current.value = "";
                    imageRef.current.value = null;
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
                    Upload an image to the gallery: <input type ="file" ref={imageRef} name='image' className='user-input-image' onChange={e => setImageToUpload(e.target.files[0])} />
                </span>
                <span className='responder-image'>
                    <label for="gallery-img-caption">Add Caption:</label> <input type="text" ref={captionRef} id="gallery-img-caption" name="caption" onChange={e => setCaption(e.target.value)}/>
                </span>
                <button className='submit-btn' onClick={submitImageToDB}>Submit</button>
            </section>
        </div>
    )
}