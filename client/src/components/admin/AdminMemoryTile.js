import { React, useState, useEffect} from 'react'
import {v4 as uuidv4} from 'uuid'
import { handleGet } from '../../services/requests-service';
//child component for each memory
export const AdminMemoryTile = (props) => {
  const {m, deleteMemory, deleteComment, deleteImage} = props;
  const [showComments, setShowComments] = useState(false); //show and hide comment view
  const [showImage, setShowImage] = useState(false);
  const [image, setImage] = useState(null)
  const handleDelete = () => {
    deleteMemory(m.uuid)
  }
  const [comments, setComments] = useState([])
  const getComments = async() => {
    const endpoint = `comments?memory_uuid=${m.uuid}`
    await handleGet(endpoint, setComments)
  }

  const getImage = async() => {
    const endpoint = `images?memory_uuid=${m.uuid}`
    await handleGet(endpoint, setImage)
  }

  useEffect(() => {
    getComments();
    getImage();
  }, [])
  if(image) {
    return (
      <section className='admin-memory'>
          <h4>Name: {m.name}</h4>
          <h4>Special Occasion: {m.occasion}</h4>
          <h4>Experience: {m.experience}</h4>
          <h4>Likes: {m.num_likes}</h4>
          <button onClick = {handleDelete}>Delete (Admin)</button>
          <button onClick ={() => setShowComments(!showComments)}>{showComments ? `Hide ${String.fromCharCode(8593)}` : `View Comments (${comments.length}) ${String.fromCharCode(8595)}`}</button>
          {showComments ? <AdminCommentsView m = {m} getComments={getComments} comments={comments} deleteComment={deleteComment}/> : null}
          <button onClick ={() => {
            setShowImage(!showImage);
            setShowComments(false)
          }}>{showImage ? `Hide ${String.fromCharCode(8593)}` : `View Image ${String.fromCharCode(8595)}`}</button>
          {showImage ? <AdminImageView m={m} image={image} getImage={getImage} deleteImage={deleteImage}/> : null}
      </section>
    )
  } else {
    return (
      <section className='admin-memory'>
          <h4>Name: {m.name}</h4>
          <h4>Special Occasion: {m.occasion}</h4>
          <h4>Experience: {m.experience}</h4>
          <h4>Likes: {m.num_likes}</h4>
          <button onClick = {handleDelete}>Delete (Admin)</button>
          <button onClick ={() => setShowComments(!showComments)}>{showComments ? `Hide ${String.fromCharCode(8593)}` : `View Comments (${comments.length}) ${String.fromCharCode(8595)}`}</button>
          {showComments ? <AdminCommentsView comments={comments} getComments={getComments} deleteComment={deleteComment}/> : null}
      </section>
    )
  }
  
}

//child component for each memory's comments
const AdminCommentsView = (props) => {
  const {comments, getComments, deleteComment} = props;
  const handleDelete = (com) => {
    deleteComment(com.uuid, getComments)
  }
  if(comments.length === 0) {
    return (
      <section className='admin-comments-container'>
        <h4>No comments yet.</h4>
      </section>
    )
  } else {
    return (
      <section className='admin-comments-container'>
        <h4>Comments</h4>
        <ul className='admin-comments-list'>
          {
            comments.map(com => {
              return (
                <li key={uuidv4()}>{com.commenter_name.display_name}: {com.comment_text} <button onClick={() => handleDelete(com)}>Delete Comment (admin)</button></li>
              )
            })
          }
        </ul>
      </section>
    )
  
  }
}

const AdminImageView = (props) => {
  const {m, image, getImage, deleteImage} = props;
  const handleDelete = () => {
    deleteImage(m.uuid, getImage)
  }
  return (
    <section className='admin-image-view'>
      <img src = {image.image_url} alt={image.image_caption}/>
      <h4>{image.image_caption}</h4>
      <button onClick={handleDelete}>Delete Image</button>
    </section>
    
  )

}
  
