import '../styles/memories.css'
import { React, useState, useEffect, useMemo} from 'react'
import { handlePost, handlePut } from '../services/requests-service'
import {Snackbar} from '@mui/material'
import { MemoryTile } from './child-components/MemoryTile'
import axios from 'axios'
import { Pagination } from './child-components/Pagination'
export default function Memories() {
  <link rel="stylesheet" href="../../styles/memories.css"/>
  const [memories, setMemories] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [sortedByNewest, setSortedByNewest] = useState(true); //starts out true because this is default
  const [sortedByOldest, setSortedByOldest] = useState(false);
  const [sortedBylikes, setSortedByLikes] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [defaultSortBtnText, setDefaultSortBtnText] = useState("Newest First (default)");
  const user = sessionStorage.getItem("user_uuid")
  const [currentPage, setCurrentPage] = useState(1)
  let PageSize = 8;
  
  const getMemoriesByNewest = async() => {
    const NODE_URL = process.env.REACT_APP_NODE_LOCAL || process.env.REACT_APP_NODE_PROD
    const url = `${NODE_URL}/memories`
    await axios.get(url).then(response => {
      if(response.data) {
        setMemories(response.data.sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt)))
      } else {
        setMemories([])
      }
      
    })
  }

  const getMemoriesByOldest = async() => {
    const NODE_URL = process.env.REACT_APP_NODE_LOCAL || process.env.REACT_APP_NODE_PROD
    const url = `${NODE_URL}/memories`
    await axios.get(url).then(response => {
      if(response.data) {
        setMemories(response.data.sort((x, y) => new Date(x.createdAt) - new Date(y.createdAt)))
      } else {
        setMemories([])
      }
    })
  } 

  const getMemoriesByLike = async() => {
    //make the request again but keep the sorting by likes active
    const NODE_URL = process.env.REACT_APP_NODE_LOCAL || process.env.REACT_APP_NODE_PROD
    const url = `${NODE_URL}/memories`
    await axios.get(url).then(response => {
      if(response.data) {
        setMemories(response.data.sort((x, y) => y.num_likes - x.num_likes))
      } else {
        setMemories([])
      }
    })
  }
  useEffect(() => {
    document.title = "Asti Memories"
    if(sortedByNewest && !sortedBylikes && !sortedByOldest) {
      getMemoriesByNewest();
    }
    if(sortedBylikes && !sortedByNewest && !sortedByOldest) {
      getMemoriesByLike();
    }
    if(sortedByOldest && !sortedByNewest && !sortedBylikes) {
      getMemoriesByOldest();
    }
  }, [])
  

  const memoriesPerPage = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return memories.slice(firstPageIndex, lastPageIndex)
  }, [currentPage, memories])

  const likePost = async(memory, setLikeDisabled) => {
    const endpoint = `memories`;
    const requestBody = {
      memory_uuid: memory.uuid,
      num_likes: memory.num_likes + 1,
    }
    const response = await handlePut(endpoint, requestBody)
    if(response.status === 200 || response.status === 201) {
      setLikeDisabled(true)
      //sort the array based on whatever the current sort method is
      if(sortedByNewest && !sortedBylikes && !sortedByOldest) {
        getMemoriesByNewest();
      }
      if(sortedBylikes && !sortedByNewest && !sortedByOldest) {
        getMemoriesByLike();
      }
      if(sortedByOldest && !sortedByNewest && !sortedBylikes) {
        getMemoriesByOldest();
      }
    }
  }

  const sortByLikes = () => {
    getMemoriesByLike();
    setSortedByNewest(false)
    setDefaultSortBtnText("Newest First")
    setSortedByLikes(true);
    setSortedByOldest(false)
  }

  const sortByNewest = () => {
    getMemoriesByNewest();
    //indicate to the user that this is the default setting
    setDefaultSortBtnText("Newest First (default)") 
    setSortedByNewest(true)
    setSortedByLikes(false);
    setSortedByOldest(false);
  }

  const sortByOldest = () => {
    getMemoriesByOldest();
    setSortedByOldest(true)
    setSortedByNewest(false)
    setSortedByLikes(false)
    setDefaultSortBtnText("Newest First")
  }

  /* 
    This method is called from the ViewComments child-component in MemoryTile.js. 
    The parameters come from there. 
    I wanted to call them here (rather than inside that file) because I wanted the snackbar to work for comments.
  */
  const submitComment = async (comment, commentUser, setNewComment, getComments) => {
    console.log('comment:',comment)
    const endpoint = `comments`
    const requestBody = {
      comment: comment,
      user_display_name: commentUser
    }
  
    try {
      const response = await handlePost(endpoint, requestBody)
      if(response.status === 200 || response.status === 201) {
        const serverData = await response.data;
        setOpenSnackbar(true);
        setSnackbarMessage("Comment added successfully!")
        if(user === null) {
          sessionStorage.setItem("user_uuid", serverData.new_user_uuid)
        }
        
        setTimeout(() => {
          setOpenSnackbar(false);
          setSnackbarMessage("")
          //clear comment form on comment submit success
          setNewComment({
            comment_text: "",
          });
          getComments(); //call get comments GET request method declared in memoryTile.js and passed in here
        }, 1500)
                
      } else {
        alert("Comment could not be saved, try again.")
      }
    } catch {
      alert("comment could not be added.")
    }
  
  } 
  if(memories.length === 0) {
    return (
      <div className="Memories">
        <Snackbar open={openSnackbar} autoHideDuration={1500} message={snackbarMessage} anchorOrigin={{horizontal: "center", vertical:"top"}}/>
        <section className='memories-grid'>
          <h4>No memories yet.</h4>
        </section>
      </div>
    );
  } else {
    return (
      <div className="Memories">
        <h1 className="memories-page-title">Shared Memories of the <em>Asti</em></h1>
        <Snackbar open={openSnackbar} autoHideDuration={1500} message={snackbarMessage} anchorOrigin={{horizontal: "center", vertical:"top"}}/>
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={memories.length} 
          pageSize={PageSize}
          onPageChange={page => setCurrentPage(page)}
        />
        <section className='sorting-btns'>
          <h3 className='sort-instructions'>Sort by</h3>
          <button disabled={sortedByNewest} className='sort-btn date-btn' onClick = {sortByNewest}>{defaultSortBtnText}</button>
          <button disabled={sortedByOldest} className='sort-btn date-btn' onClick = {sortByOldest}> Oldest First</button>
          <button disabled={sortedBylikes} className='sort-btn like-btn' onClick = {sortByLikes}>Most Likes</button>
        </section>
        
        <section className='memories-grid'>
          {memoriesPerPage.map(m => {
            return <MemoryTile key={m.uuid} m={m} likePost={likePost} submitComment={submitComment}/>
          })}
        </section>
      </div>
    );
  }
 
}

