import { React, useState, useRef, useEffect} from 'react'
import {v4 as uuidv4} from 'uuid'
import { handleGet, handlePost } from '../../services/requests-service';
import ReCAPTCHA from "react-google-recaptcha"
import "../../styles/memories.css"
export const CommentsView = (props) => {
  const recaptchaRef = useRef();
  const {m, commentUser, setCommentUser, submitComment} = props;
  const [comments, setComments] = useState([])
  const getComments = async() => {
    const endpoint = `comments?memory_uuid=${m.uuid}`
    await handleGet(endpoint, setComments)
  }
  useEffect(() => {
    getComments();
  }, [])
  const clearRecaptcha = () => {
    setRecaptchaValue(null);
  }
  window.interval = setInterval(() => clearRecaptcha(), 90 * 1000)
  const user = sessionStorage.getItem("user_uuid")
  const SITE_KEY = '6LffBlMpAAAAADK37hlL29ERh8ba5EMhRtPCli6o'
  const recaptchaId1 = uuidv4();
  const recaptchaId2 = uuidv4();
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [newComment, setNewComment] = useState({
    memory_uuid: m.uuid,
    user_uuid: user,
    comment_text: ""
  })
  const verifyRecaptcha = async() => {
    const token = recaptchaValue;
    const recaptchaEndpoint = `recaptcha`
    const recaptchaBody = {
      recaptcha_token: token,
    }
    const recaptchaResponse = await handlePost(recaptchaEndpoint, recaptchaBody)
    const recaptchaData = await recaptchaResponse.data;
    if(recaptchaData.human) {
      return true;
    } else {
      return false;
    }
  }
  const handleSubmit = async() => {
    //if they hit submit but haven't entered a comment, don't do anything
    if(newComment.comment_text === "") { 
      return;
    } else {
      if(user === null) {
        //only require recaptcha if user is not created yet
        const isHuman = await verifyRecaptcha()
        if(isHuman) {
          //ensures memory_uuid and user_uuid are sent in each payload
          newComment.memory_uuid = m.uuid;
          newComment.user_uuid = user
          submitComment(newComment, commentUser, setNewComment, getComments, setRecaptchaValue)
          //reset all recaptchas using their id to prevent timeout
          recaptchaRef.current.reset(recaptchaId1)
          recaptchaRef.current.reset(recaptchaId2);
          
        } else {
          alert("You are a bot!")
        }
      } else {
        //ensures memory_uuid and user_uuid are sent in each payload
        newComment.memory_uuid = m.uuid;
        newComment.user_uuid = user
        submitComment(newComment, commentUser, setNewComment, getComments, setRecaptchaValue)
      }
      
      
    }
    
  }
  const handleChange = (name, value) => {
    setNewComment({...newComment, [name]:value})
  }
  const handleUserChange = (value) => {
    setCommentUser(value)
  }
  if(comments.length === 0) {
    //don't include recaptcha if temporary user already created
    if(user !== null) {
      return (
        <section className='comments-container'>
          <section className='no-comments-container'>
            <h4>No comments yet, be the first to comment!</h4>
          </section>
          <section className='new-comment'>
            <span>Display name: <input type="text" value={commentUser} name="commentUser" onChange={(e) => handleUserChange(e.target.value)} /></span>
            <span>Comment: <input type="text" name="comment_text" value={newComment.comment_text} onChange={(e) => handleChange(e.target.name, e.target.value) }/></span>
            <button className='interaction-btn submit-comment-btn' onClick = {handleSubmit}>Post comment</button>
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
          <span>Display name: <input type="text" value={commentUser} name="commentUser" onChange={(e) => handleUserChange(e.target.value)} /></span>
          <span>Comment: <input type="text" name="comment_text" value={newComment.comment_text} onChange={(e) => handleChange(e.target.name, e.target.value) }/></span>
          <ReCAPTCHA size="compact" ref={recaptchaRef} id={recaptchaId1} sitekey={SITE_KEY} type="image" onChange={(val) => setRecaptchaValue(val)}/>
          <button disabled={!recaptchaValue} className='interaction-btn submit-comment-btn' onClick = {handleSubmit}>Post comment</button>
        </section>
      </section>
    )
  }
    
  } else {
    if(user !== null) {
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
            <span>Display name: <input type="text" value={commentUser} name="commentUser" onChange={(e) => handleUserChange(e.target.value)} /></span>
            <span>Comment: <input type="text" name="comment_text" value={newComment.comment_text} onChange={(e) => handleChange(e.target.name, e.target.value) }/></span>
            <button className='interaction-btn submit-comment-btn' onClick = {handleSubmit}>Post comment</button>
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
            <span>Display name: <input type="text" value={commentUser} name="commentUser" onChange={(e) => handleUserChange(e.target.value)} /></span>
            <span>Comment: <input type="text" name="comment_text" value={newComment.comment_text} onChange={(e) => handleChange(e.target.name, e.target.value) }/></span>
            <ReCAPTCHA size="compact" ref={recaptchaRef} id={recaptchaId2} sitekey={SITE_KEY} type="image" onChange={(val) => setRecaptchaValue(val)}/>
            <button disabled={!recaptchaValue} className='interaction-btn submit-comment-btn' onClick = {handleSubmit}>Post comment</button>
          </section>
        </section>
      )
    }
  }
}