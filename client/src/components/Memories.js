import '../styles/memories.css'
import { React, useState, useEffect, useMemo} from 'react'
import { handlePost, handlePut } from '../services/requests-service'
import {Snackbar} from '@mui/material'
import { MemoryTile } from './child-components/MemoryTile'
import axios from 'axios'
import { Pagination } from './child-components/Pagination'
import TextField from "@mui/material/TextField";
import { debounce } from "../utils"

export default function Memories() {
  const [memories, setMemories] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [sortedByNewest, setSortedByNewest] = useState(true); //starts out true because this is default
  const [sortedByOldest, setSortedByOldest] = useState(false);
  const [sortedBylikes, setSortedByLikes] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [defaultSortBtnText, setDefaultSortBtnText] = useState("Newest First (default)");
  const user = sessionStorage.getItem("user_uuid")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchInput, setSearchInput] = useState("");
  let PageSize = 8;
  
  const getMemories = async(sortMethod) => {
    const NODE_URL = process.env.REACT_APP_NODE_LOCAL || process.env.REACT_APP_NODE_PROD
    const url = `${NODE_URL}/memories`
    await axios.get(url).then(response => {
      if(response.data) {
        switch(sortMethod) {
          case "newest": {
            setMemories(response.data.sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt)))
            break;
          } 
          case 'oldest' : {
            setMemories(response.data.sort((x, y) => new Date(x.createdAt) - new Date(y.createdAt)))
            break;
          }
          case 'likes': {
            setMemories(response.data.sort((x, y) => new Date(y.num_likes) - new Date(x.num_likes)))
            break;
          }
          default: {
            setMemories(response.data)
            break;
          }
        }
        
      } else {
        setMemories([])
      }
      
    })
    
   
  }

  useEffect(() => {
    document.title = "Asti Memories"
    
    if(sortedByNewest && !sortedBylikes && !sortedByOldest) {
      getMemories("newest");
    }
    if(sortedBylikes && !sortedByNewest && !sortedByOldest) {
      getMemories("likes")
    }
    if(sortedByOldest && !sortedByNewest && !sortedBylikes) {
      getMemories("oldest")
    }
  }, [])
  
  const searchForMemoryToDelete = (e) => {
    setCurrentPage(1)
    setSearchInput(e.target.value);
  }

  const debouncedSearch = useMemo(() => debounce(searchForMemoryToDelete, 250), [])

  const filteredMemories = memories.filter(m => m.name.toLowerCase().includes(searchInput.toLowerCase().trim()));
  const memoriesPerPage = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return filteredMemories.slice(firstPageIndex, lastPageIndex)
  }, [currentPage, filteredMemories])

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
        getMemories('newest');
      }
      if(sortedBylikes && !sortedByNewest && !sortedByOldest) {
        getMemories('likes');
      }
      if(sortedByOldest && !sortedByNewest && !sortedBylikes) {
        getMemories('oldest');
      }
    }
  }

  const sortByLikes = () => {
    getMemories('likes')
    setSortedByNewest(false)
    setDefaultSortBtnText("Newest First")
    setSortedByLikes(true);
    setSortedByOldest(false)
  }

  const sortByNewest = () => {
    getMemories('newest')
    //indicate to the user that this is the default setting
    setDefaultSortBtnText("Newest First (default)") 
    setSortedByNewest(true)
    setSortedByLikes(false);
    setSortedByOldest(false);
  }

  const sortByOldest = () => {
    getMemories('oldest')
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
        <section className='textfield-container'>
          <p>Check the activity on your shared memory</p>
          <TextField 
          onChange = {debouncedSearch}
          className="memory-search-field"
          label='Search Memories by Name'
          sx={{
          //Below code is for changing color of TextField elements
            "& .MuiFormLabel-root": {
              color: 'darkred',
              fontFamily: 'Noto Sans'
            },
            "& .css-1ff8729-MuiInputBase-root-MuiFilledInput-root:hover:not(.Mui-disabled, .Mui-error):before": {
              borderBottom: '1px solid darkred'
            },
            "& .css-o943dk-MuiFormLabel-root-MuiInputLabel-root.Mui-focused": {
              color: 'darkred',
            },
            "& .css-1ff8729-MuiInputBase-root-MuiFilledInput-root:before": {
              borderBottom: '1px solid darkred'
            },
            "& .css-1ff8729-MuiInputBase-root-MuiFilledInput-root:after": {
              borderBottom: '1px solid darkred'
            }
          }}
          variant="filled"
         />
        
        </section>
        
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

