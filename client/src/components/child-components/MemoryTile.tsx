import {useState, useEffect} from 'react'
import { handleGet, handlePost } from '../../services/requests-service';
import axios from 'axios';
import "../../styles/memories.css"
import { CommentsView } from './CommentsView';
import { ImageView } from './ImageView';
const NODE_URL = process.env.REACT_APP_NODE_LOCAL || process.env.REACT_APP_NODE_PROD
//child component for each memory
export const MemoryTile = (props: { m: any; likePost: any; submitComment: any; }) => {
 
  const m = props.m;
  const likePost = props.likePost;
  const [image, setImage] = useState<any>();
  const [likeDisabled, setLikeDisabled] = useState<boolean>(false)
  const [showComments, setShowComments] = useState<boolean>(false); //show and hide comment view
  const [showImage, setShowImage] = useState<boolean>(false); //show and hide image view
  const [commentUser, setCommentUser] = useState<string>("");
  const [commentsLength, setCommentsLength] = useState<number>(0)
  let likeAmt: any
  let commentAmt: any
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
  
  const getImage = async() => {
    const endpoint = `images?memory_uuid=${m.uuid}`
    await handleGet(endpoint, setImage)
  }
  const getCommentsCount = async() => {
    const endpoint = `commentCount?memory_uuid=${m.uuid}`
    await handleGet(endpoint, setCommentsLength)
  }
  useEffect(() => {
    getCommentsCount()
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
  if(commentsLength === 0) {
    commentAmt = '';
    commentAmt = 0;
  } else if(commentsLength % 1000 === 0) {
    commentAmt = ''
    commentAmt = `${commentsLength / 100}k`
  } else if(commentsLength > 1000) {
    commentAmt = '';
    commentAmt = `${Number(commentsLength).toFixed(2)}k`
  } else {
    commentAmt = '';
    commentAmt = commentsLength;
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
        {showComments ? <CommentsView m = {m} commentUser={commentUser} setCommentUser={setCommentUser} submitComment={submitComment}/> : null}

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
        {showComments ? <CommentsView m = {m} commentUser={commentUser} setCommentUser={setCommentUser} submitComment={submitComment}/> : null}
      </section>
    )
  }
 
  
}

  
