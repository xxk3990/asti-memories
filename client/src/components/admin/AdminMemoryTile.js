import { React, useState, useEffect} from 'react'
import {v4 as uuidv4} from 'uuid'
import { handleGet } from '../../services/requests-service';
//child component for each memory
export const AdminMemoryTile = (props) => {
  const m = props.m;
  const [showComments, setShowComments] = useState(false); //show and hide comment view
  const deleteMemory = props.deleteMemory;
  const deleteComment = props.deleteComment;
  const handleDelete = () => {
    deleteMemory(m.uuid)
  }
  const [comments, setComments] = useState([])
  const getComments = async() => {
    const endpoint = `comments?memory_uuid=${m.uuid}`
    await handleGet(endpoint, setComments)
  }
  useEffect(() => {
    getComments();
  }, [])
  return (
    <section className='memory'>
        <h4>Name: {m.name}</h4>
        <h4>Special Occasion: {m.occasion}</h4>
        <h4>Experience: {m.experience}</h4>
        <h4>Likes: {m.num_likes}</h4>
        <button onClick = {handleDelete}>Delete (Admin)</button>
        <button onClick ={() => setShowComments(!showComments)}>{showComments ? `Hide ${String.fromCharCode(8593)}` : `View Comments (${comments.length}) ${String.fromCharCode(8595)}`}</button>
        {showComments ? <ViewComments m = {m} getComments={getComments} comments={comments} deleteComment={deleteComment}/> : null}
    </section>
  )
}

//child component for each memory's comments
const ViewComments = (props) => {
    const m = props.m;
    const comments = props.comments;
    const getComments = props.getComments;
    const deleteComment = props.deleteComment;
    const handleDelete = (com) => {
      deleteComment(com.uuid, getComments)
    }
    if(comments.length === 0) {
      return (
        <section className='comments-container'>
          <h4>No comments yet.</h4>
        </section>
      )
    } else {
      return (
        <section className='comments-container'>
          <h4>Comments</h4>
          <ul className='comments-list'>
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
  
