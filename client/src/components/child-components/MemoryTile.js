import { React, useState, useEffect} from 'react'
import {v4 as uuidv4} from 'uuid'
import { handleGet, handlePost } from '../../services/requests-service';
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha"
import "../../styles/memories.css"
import AWS from "aws-sdk"
const NODE_URL = process.env.REACT_APP_NODE_LOCAL || process.env.REACT_APP_NODE_PROD
//child component for each memory
export const MemoryTile = (props) => {
 
  const m = props.m;
  const likePost = props.likePost;
  const [image, setImage] = useState();
  const [likeDisabled, setLikeDisabled] = useState(false)
  const [showComments, setShowComments] = useState(false); //show and hide comment view
  const [showImage, setShowImage] = useState(false);
  const submitComment = props.submitComment;
  const handleClick = () => {
    likePost(m);
    setLikeDisabled(!likeDisabled)
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
  console.log("comments:", comments)
  return (
    <section className='memory'>
        <h4>Name: {m.name}</h4>
        <h4>Special Occasion: {m.occasion}</h4>
        <h4>Experience: {m.experience}</h4>
        <h4>Likes: {m.num_likes}</h4>
        <button className='interaction-btn' onClick = {handleClick} disabled={likeDisabled}>Like</button>
        <button className='interaction-btn' onClick ={() => {
          getComments()
          setShowComments(!showComments);
        }}>{showComments ? `Hide ${String.fromCharCode(8593)}` : `View Comments ${String.fromCharCode(8595)}`}</button>
        {showComments ? <CommentsView m = {m} getComments={getComments} comments={comments} submitComment={submitComment} /> : null}

        <button className='interaction-btn' onClick ={() => {
          getImage()
          setShowImage(!showImage);
        }}>{showImage ? `Hide ${String.fromCharCode(8593)}` : `View Images ${String.fromCharCode(8595)}`}</button>
        {showImage ? <ImageView image={image} /> : null}
    </section>
  )
}

//child component for each memory's comments
const CommentsView = (props) => {
  const m = props.m;
  const submitComment = props.submitComment;
  const comments = props.comments;
  const getComments = props.getComments
  const user = sessionStorage.getItem("user_uuid")
  
  const [commentUser, setCommentUser] = useState("");
  const SITE_KEY = '6LffBlMpAAAAADK37hlL29ERh8ba5EMhRtPCli6o'
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const checkForUser = async() => {
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

  useEffect(() => {
    checkForUser();
  }, [])
  
  const [newComment, setNewComment] = useState({
    memory_uuid: m.uuid,
    user_uuid: user,
    comment_text: ""
  })
  const handleSubmit = async() => {
    const token = recaptchaValue;
    const recaptchaEndpoint = `recaptcha`
    const recaptchaBody = {
      recaptcha_token: token,
    }
    const recaptchaResponse = await handlePost(recaptchaEndpoint, recaptchaBody)
    const recaptchaData = await recaptchaResponse.data;
    if(recaptchaData.human) {
      //if they hit submit but haven't entered a comment, don't do anything
      if(newComment.comment_text === "") { 
        return;
      } else {
        //ensures memory_uuid and user_uuid are sent in each payload
        newComment.memory_uuid = m.uuid;
        newComment.user_uuid = user
        submitComment(newComment, commentUser, setCommentUser, setNewComment, getComments)
      }
    } else {
      alert("You are a bot!")
    }
    
  }
  const handleChange = (name, value) => {
    setNewComment({...newComment, [name]:value})
  }
  const handleUserChange = (value) => {
    setCommentUser(value)
  }
  //TODO: ADD reCAPTCHA TO PUBLIC COMMENT FORM
  if(comments.length === 0) {
    return (
      <section className='comments-container'>
        <h4>No comments yet, be the first to comment!</h4>
        <section className='new-comment'>
          <span>Display name: <input type="text" value={commentUser} name="commentUser" onChange={(e) => handleUserChange(e.target.value)} /></span>
          <span>Comment: <input type="text" name="comment_text" value={newComment.comment_text} onChange={(e) => handleChange(e.target.name, e.target.value) }/></span>
          <ReCAPTCHA sitekey={SITE_KEY} type="image" onChange={(val) => setRecaptchaValue(val)}/>
          <button disabled={!recaptchaValue} className='interaction-btn submit-comment-btn' onClick = {handleSubmit}>Post comment</button>
        </section>
      </section>
    )
  } else {
    return (
      <section className='comments-container'>
        <h4 className='comments-count'>Comments ({comments.length})</h4>
        <section className='comments-list-container'>
          <ul className='comments-list'>
            {
              comments.map(com => {
                return (
                  <li key={uuidv4()}>{com.commenter_name.display_name}: {com.comment_text}</li>
                )
              })
            }
          </ul>
        </section>
        <section className='new-comment'>
          <span>Display name: <input type="text" value={commentUser} name="commentUser" onChange={(e) => handleUserChange(e.target.value)} /></span>
          <span>Comment: <input type="text" name="comment_text" value={newComment.comment_text} onChange={(e) => handleChange(e.target.name, e.target.value) }/></span>
          <ReCAPTCHA sitekey={SITE_KEY} type="image" onChange={(val) => setRecaptchaValue(val)}/>
          <button disabled={!recaptchaValue} className='interaction-btn submit-comment-btn' onClick = {handleSubmit}>Post comment</button>
        </section>
      </section>
    )
  
  }
}

const ImageView = (props) => {
  const image = props.image;
  console.log("image:", image)
  if(!image) {
    return (
      <section className='images-view'>
        No image uploaded with this post
      </section>
    )
  } else {
    console.log(image)
    return (
      <section className='images-view'>
        <img src = {image.image_url} alt={image.image_caption}/>
        <h4>{image.image_caption}</h4>
      </section>
    )
  }
  
}
  
