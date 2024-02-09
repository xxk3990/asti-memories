import { React, useState, useRef, useEffect} from 'react'
import {v4 as uuidv4} from 'uuid'
import { handleGet, handlePost } from '../../services/requests-service';
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha"
import "../../styles/memories.css"
const NODE_URL = process.env.REACT_APP_NODE_LOCAL || process.env.REACT_APP_NODE_PROD
//child component for each memory
export const MemoryTile = (props) => {
 
  const m = props.m;
  const likePost = props.likePost;
  const [image, setImage] = useState();
  const [likeDisabled, setLikeDisabled] = useState(false)
  const [showComments, setShowComments] = useState(false); //show and hide comment view
  const [showImage, setShowImage] = useState(false); //show and hide image view
  const [commentUser, setCommentUser] = useState("");

  let likeAmt;
  let commentAmt;
  const submitComment = props.submitComment;
  const handleClick = () => {
    likePost(m, setLikeDisabled);
  }

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

  if(m.occasion === "") {
    m.occasion = "n/a"
  }


  if(m.num_likes === 0) {
    likeAmt = 0;
    //format like amount shown to user using local variable if it exceeds a thousand
  } else if(m.num_likes % 1000 === 0) { //for when it is exactly 1000, 2000, etc
    likeAmt = ''
    likeAmt = `${m.num_likes / 1000}k` //just show the number plus k. 1k, 2k, 3k etc.
  } else if(m.num_likes > 1000) {
    likeAmt = ''
    likeAmt = `${Number(m.num_likes / 1000).toFixed(2)}k` //add additional decimal places for higher than 1k
  } else {
    likeAmt = m.num_likes;
  }

  //do the same client-side formatting for comments length
  if(comments.length === 0) {
    commentAmt = '';
    commentAmt = 0;
  } else if(comments.length % 1000 === 0) {
    commentAmt = ''
    commentAmt = `${comments.length / 100}k`
  } else if(comments.length > 1000) {
    commentAmt = '';
    commentAmt = `${Number(comments.length).toFixed(2)}k`
  } else {
    commentAmt = '';
    commentAmt = comments.length;
  }
  const user = sessionStorage.getItem("user_uuid")

  //only show "view image" button if an image is associated with the memory
  if(image) {
    return (
      <section className='memory'>
        <p className='memory-prop'>Name: {m.name}</p>
        <p className='memory-prop'>Special Occasion: {m.occasion}</p>
        <p className='memory-prop'>Experience: {m.experience}</p>
        <p className='memory-prop'>Likes: {likeAmt}</p>
        <button className='interaction-btn like-btn' onClick = {handleClick} disabled={likeDisabled}>Like</button>
        <button className='interaction-btn' onClick ={() => {
          checkForUser();
          setShowComments(!showComments);
          setShowImage(false);
        }}>{showComments ? `Hide ${String.fromCharCode(8593)}` : `View Comments (${commentAmt}) ${String.fromCharCode(8595)}`}</button>
        {showComments ? <CommentsView m = {m} commentUser={commentUser} setCommentUser={setCommentUser} getComments={getComments} comments={comments} submitComment={submitComment}/> : null}

        <button className='interaction-btn' onClick ={() => {
          setShowImage(!showImage);
          setShowComments(false)
        }}>{showImage ? `Hide ${String.fromCharCode(8593)}` : `View Image ${String.fromCharCode(8595)}`}</button>
        {showImage ? <ImageView image={image} /> : null}
      </section>
    ) 
  } else {
    return (
      <section className='memory'>
        <p className='memory-prop'>Name: {m.name}</p>
        <p className='memory-prop'>Special Occasion: {m.occasion}</p>
        <p className='memory-prop'>Experience: {m.experience}</p>
        <p className='memory-prop'>Likes: {likeAmt}</p>
        <button className='interaction-btn like-btn' onClick = {handleClick} disabled={likeDisabled}>Like</button>
        <button className='interaction-btn' onClick ={() => {
          checkForUser();
          setShowComments(!showComments);
        }}>{showComments ? `Hide ${String.fromCharCode(8593)}` : `View Comments (${commentAmt}) ${String.fromCharCode(8595)}`}</button>
        {showComments ? <CommentsView m = {m} commentUser={commentUser} setCommentUser={setCommentUser} getComments={getComments} comments={comments} submitComment={submitComment}/> : null}
      </section>
    )
  }
 
  
}

//child component for each memory's comments
const CommentsView = (props) => {
  //TODO: FIX RECAPTCHA TIMING OUT IF YOU OPEN AND CLOSE A COMMENT VIEW WITHOUT SUBMITTING.
  const recaptchaRef = useRef();
  const {m, commentUser, setCommentUser, submitComment, comments, getComments} = props;

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


  const clearRecaptcha = () => {
    setRecaptchaValue(null);
   // recaptchaRef.current.reset(recaptchaId)
  }
  setInterval(() => clearRecaptcha(), 90 * 1000)
  const handleSubmit = async() => {
    //if they hit submit but haven't entered a comment, don't do anything
    if(newComment.comment_text === "") { 
      return;
    } else {
      const token = recaptchaValue;
      const recaptchaEndpoint = `recaptcha`
      const recaptchaBody = {
        recaptcha_token: token,
      }
      const recaptchaResponse = await handlePost(recaptchaEndpoint, recaptchaBody)
      const recaptchaData = await recaptchaResponse.data;
      if(recaptchaData.human) {
        //ensures memory_uuid and user_uuid are sent in each payload
        newComment.memory_uuid = m.uuid;
        newComment.user_uuid = user
        submitComment(newComment, commentUser, setNewComment, getComments, setRecaptchaValue)
        //reset recaptcha using its id
        recaptchaRef.current.reset(recaptchaId1)
        recaptchaRef.current.reset(recaptchaId2);
        
      } else {
        alert("You are a bot!")
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
  } else {
    return (
      <section className='comments-container'>
        <h4 className='comments-count'>Comments</h4>
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
          <ReCAPTCHA size="compact" ref={recaptchaRef} id={recaptchaId2} sitekey={SITE_KEY} type="image" onChange={(val) => setRecaptchaValue(val)}/>
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
  
