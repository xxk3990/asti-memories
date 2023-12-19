import '../../styles/manage-memories.css'
import { React, useState, useEffect, memo} from 'react'
import { handleGet } from '../../services/requests-service'
import {Snackbar} from '@mui/material'
import {useNavigate} from "react-router-dom"
import { AdminMemoryTile } from './AdminMemoryTile'
import {handleAdminDelete} from "../../services/admin-service"

export default function  ManageMemories() {
  
    const [memories, setMemories] = useState([]);
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const getMemories = async() => {
        const adminID = sessionStorage.getItem("admin_uuid");
        if(adminID === null || adminID === "" || adminID === undefined) {
            navigate("/memories") //redirect if no admin_uuid is set
        } else {
            const endpoint = "memories"
            await handleGet(endpoint, setMemories)
        }
    }
    useEffect(() => {
        getMemories()
    }, [])

    const deleteMemory = async(memory_uuid) => {
        const endpoint = `memories?memory=${memory_uuid}`
        const response = await handleAdminDelete(endpoint)
        if(response.status === 200) {
            setOpenSnackbar(true);
            setSnackbarMessage("Memory deleted successfully!")
            setTimeout(() => {
                setOpenSnackbar(false);
                setSnackbarMessage("")
                getMemories()
            }, 1500)
        }
    }
    const deleteComment = async(comment_uuid, getComments) => {
        const endpoint = `comments?comment=${comment_uuid}`
        const response = await handleAdminDelete(endpoint)
        if(response.status === 200) {
            getComments();
            setOpenSnackbar(true);
            setSnackbarMessage("Comment deleted successfully!")
            setTimeout(() => {
                setOpenSnackbar(false);
                setSnackbarMessage("")
            }, 1500)
        }
    }
    return (
        <div className='ManageMemories'>
            <Snackbar open={openSnackbar} autoHideDuration={2000} message={snackbarMessage} anchorOrigin={{horizontal: "center", vertical:"top"}}/>
            <h1>Manage All Memories and Comments.</h1>
           <section className='memories-grid'>
                {memories.map(m => {
                    return <AdminMemoryTile m={m} deleteMemory={deleteMemory} deleteComment={deleteComment}/>
                })}
            </section>
        </div>
    )
}

