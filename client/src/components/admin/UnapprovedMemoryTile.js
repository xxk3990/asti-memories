import { React, useState, useEffect} from 'react'
import { handleGet } from '../../services/requests-service'
import "../../styles/approval.css"
export const UnapprovedMemoryTile = (props) => {
    const [image, setImage] = useState()
    const {um, approveMemory, deleteMemory} = props;
    const handleApprove = () => {
        approveMemory(um.uuid);
    }
    const getImage = async() => {
        const endpoint = `images?memory_uuid=${um.uuid}`
        await handleGet(endpoint, setImage)
    }
    const handleDelete = () => {
        deleteMemory(um.uuid);
    }
    useEffect(() => {
        getImage();
    }, []);
    if(image) {
        return (
            <section className='unapproved-memory'>
                <h4>Name: {um.name}</h4>
                <h4>Special Occasion: {um.occasion}</h4>
                <h4>Experience: {um.experience}</h4>
                <h4>Likes: {um.num_likes}</h4>
                <button onClick = {handleApprove}>Approve (Admin)</button>
                <button onClick = {handleDelete}>Delete (Admin)</button>
                <ApproveImageView image={image}/>
            </section>
        )
    } else {
        return (
            <section className='unapproved-memory'>
                <h4>Name: {um.name}</h4>
                <h4>Special Occasion: {um.occasion}</h4>
                <h4>Experience: {um.experience}</h4>
                <h4>Likes: {um.num_likes}</h4>
                <button onClick = {handleApprove}>Approve (Admin)</button>
                <button onClick = {handleDelete}>Delete (Admin)</button>
            </section>
        )
    }
    
}

const ApproveImageView = (props) => {
    const image = props.image;
    return (
        <img className='image-preview' src={image.image_url} alt={image.image_caption}/>
    )
}
