import * as React from 'react'
import {useState, useEffect} from 'react'
import {v4 as uuidv4} from 'uuid'
import { handleGet } from '../../services/requests-service';
import "../../styles/memories.css"
import axios from 'axios'
export const CommentsView = (props: {m: any, commentUser: string, setCommentUser: any, submitComment: any}) => {
  const {m, commentUser, setCommentUser, submitComment} = props;
  const NODE_URL = process.env.REACT_APP_NODE_LOCAL || process.env.REACT_APP_NODE_PROD
  const [comments, setComments] = useState<any>([])
  const getComments = async() => {
    const endpoint = `comments?memory_uuid=${m.uuid}`
    await handleGet(endpoint, setComments)
  }
  useEffect(() => {
    getComments();
    checkForUser();
  }, [])
  const handleChange = (name: string, value: string) => {
    setNewComment({...newComment, [name]:value})
  }
  const user = sessionStorage.getItem("user_uuid")
  const [newComment, setNewComment] = useState({
    memory_uuid: m.uuid,
    user_uuid: user,
    comment_text: ""
  })
  
  const checkForUser = async() => {
    //if the user already created a temp user (via the form for example), grab temp display_name
    if(user !== null) {
      const checkUserEndpoint = `users?user_uuid=${user}`
      const url = `${NODE_URL}/${checkUserEndpoint}`
      await axios.get(url).then(response => {
        const data = response.data;
        if(data.display_name) {
          setCommentUser(data.display_name)
        }
      })
    }
  }

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    //if they hit submit but haven't entered a comment, don't do anything
    e.preventDefault();
    if(newComment.comment_text === "") { 
      return;
    } else {
      //ensures memory_uuid and user_uuid are sent in each payload
      newComment.memory_uuid = m.uuid;
      newComment.user_uuid = user
      submitComment(newComment, commentUser, setNewComment, getComments)
    }
  }

  if(comments.length === 0) {
    //don't show post comment form if temporary user not created
    if(user === null) {
      return (
        <section className='comments-container'>
          <section className='no-comments-container'>
            <h4>No comments Yet! To post a comment, fill out the form above to create a temporary user for yourself.</h4>
          </section>
        </section>
      )
    } else {
      return (
        <section className='comments-container'>
          <section className='no-comments-container'>
            <h4>No comments yet, be the first to comment!</h4>
          </section>
          <section className='new-comment'>
            <form onSubmit={(e) => handleSubmit(e)} className='comment-form'>
              <span>Display name: {commentUser}</span>
              <span>Comment: <input type="text" name="comment_text" value={newComment.comment_text} onChange={(e) => handleChange(e.target.name, e.target.value) }/></span>
              <button className='interaction-btn submit-comment-btn'>Post comment</button>
            </form>
          </section>
        </section>
      )
    }
  } else {
    if(user === null) {
      return (
        <section className='comments-container'>
          <h4 className='comments-count'>Comments</h4>
          <section className='comments-list-container'>
            <ul className='comments-list'>
              {
                comments.map(com => {
                  return (
                    <li key={uuidv4()}>
                      <h4>{com.commenter_name.display_name}</h4>
                      <p className='comment-text'>{com.comment_text}</p>
                    </li>
                  )
                })
              }
            </ul>
          </section>
          <section className='new-comment'> 
            <h4>To post a comment, fill out the form above to create a temporary user for yourself.</h4>
          </section>
        </section>
      )
    } else {
      return (
        <section className='comments-container'>
          <h4 className='comments-count'>Comments</h4>
          <section className='comments-list-container'>
            <ul className='comments-list'>
              {
                comments.map(com => {
                  return (
                    <li key={uuidv4()}>
                      <h4>{com.commenter_name.display_name}</h4>
                      <p className='comment-text'>{com.comment_text}</p>
                    </li>
                  )
                })
              }
            </ul>
          </section>
          <section className='new-comment'>
            <form className='comment-form' onSubmit={(e) => handleSubmit(e)}>
              <span>Display name: {commentUser}</span>
              <span>Comment: <input type="text" name="comment_text" value={newComment.comment_text} onChange={(e) => handleChange(e.target.name, e.target.value) }/></span>
              <button className='interaction-btn submit-comment-btn'>Post comment</button>
            </form>
          </section>
        </section>
      )
    }
    
  }
}