import "../../styles/manage-memories.css"
import { React, useState, useEffect, useMemo} from 'react'
import { handleGet } from '../../services/requests-service'
import {Snackbar} from '@mui/material'
import {useNavigate} from "react-router-dom"
import { AdminMemoryTile } from './AdminMemoryTile'
import {handleAdminDelete} from "../../services/admin-service"
import TextField from "@mui/material/TextField";
import { debounce } from "../../utils"
export default function  ManageMemories() {
    <link rel="stylsheet" href="../../styles/manage-memories.css"/>
    const [memories, setMemories] = useState([]);
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [searchInput, setSearchInput] = useState("");
    const getMemories = async() => {
        const adminID = sessionStorage.getItem("admin_uuid");
        if(adminID === null || adminID === "" || adminID === undefined) {
            navigate("/memories") //redirect if no admin_uuid is set
        } else {
            const endpoint = `memories`
            await handleGet(endpoint, setMemories)
        }
    }

    useEffect(() => {
        getMemories()
    }, [])

  
    const searchForMemoryToDelete = (e) => {
        setSearchInput(e.target.value);
    }

    const debouncedSearch = useMemo(() => debounce(searchForMemoryToDelete, 250), [])

    const filteredMemories = memories.filter(m => m.name.toLowerCase().includes(searchInput.toLowerCase().trim()));

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
    if(memories.length === 0) {
        return (
            <div className='ManageMemories'>
                <TextField 
                    onChange = {debouncedSearch}
                    className="search-field"
                    label='Search for Memory to delete'
                    sx={{
                    //Below code is for changing color of TextField elements
                        "& .MuiFormLabel-root": {
                        color: 'darkred'
                        },
                        "& .css-o943dk-MuiFormLabel-root-MuiInputLabel-root.Mui-focused": {
                        color: 'darkred'
                        }
                    }}
                    variant="filled"
                />
                <h4>No memories added yet!</h4>
            </div>
        )
    } else {
        return (
            <div className='ManageMemories'>
                <Snackbar open={openSnackbar} autoHideDuration={2000} message={snackbarMessage} anchorOrigin={{horizontal: "center", vertical:"top"}}/>
                <h1>Manage All Memories and Comments</h1>
                <TextField 
                    onChange = {debouncedSearch}
                    className="search-field"
                    label='Search for Memory to delete'
                    sx={{
                    //Below code is for changing color of TextField elements
                        "& .MuiFormLabel-root": {
                        color: 'darkred'
                        },
                        "& .css-o943dk-MuiFormLabel-root-MuiInputLabel-root.Mui-focused": {
                        color: 'darkred'
                        }
                    }}
                    variant="filled"
                />
                <section className='manage-memories-grid'>
                    {filteredMemories.map(m => {
                        return <AdminMemoryTile m={m} deleteMemory={deleteMemory} deleteComment={deleteComment}/>
                    })}
                </section>
            </div>
        )
    }
    
}

