import "../../styles/delete-memories.css"
import { useState, useEffect, useMemo, SetStateAction} from 'react'
import { handleGet } from '../../services/requests-service'
import {Snackbar} from '@mui/material'
import {useNavigate} from "react-router-dom"
import { DeleteMemoryTile } from './DeleteMemoryTile'
import {handleAdminDelete} from "../../services/admin-service"
import TextField from "@mui/material/TextField";
import { debounce } from "../../utils"
export default function  DeleteMemories() {
    const [memories, setMemories] = useState<any>([]);
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>("")
    const [searchInput, setSearchInput] = useState<string>("");
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
    const searchForMemoryToDelete = (e: { target: { value: SetStateAction<string> } }) => {
        setSearchInput(e.target.value);
    }

    const debouncedSearch = useMemo(() => debounce(searchForMemoryToDelete, 250), [])

    const deleteMemory = async(memory_uuid: string) => {
        const endpoint = `memories?memory_uuid=${memory_uuid}`
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
            setSnackbarMessage("Image deleted successfully!")
            setTimeout(() => {
                setOpenSnackbar(false);
                setSnackbarMessage("")
            }, 1500)
        }
    }

    const deleteImage = async(memory_uuid, getImage) => {
        const endpoint = `images?memory_uuid=${memory_uuid}`
        const response = await handleAdminDelete(endpoint)
        if(response.status === 200) {
            getImage();
            setOpenSnackbar(true);
            setSnackbarMessage("Image deleted successfully!")
            setTimeout(() => {
                setOpenSnackbar(false);
                setSnackbarMessage("")
            }, 1500)
        }
    }
    if(memories.length === 0) {
        return (
            <div className='DeleteMemories'>
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
    
        const filteredMemories = memories.filter(m => m.name.toLowerCase().includes(searchInput.toLowerCase().trim()));
        return (
            <div className='DeleteMemories'>
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
                <section className='delete-memories-grid'>
                    {filteredMemories.map(m => {
                        return <DeleteMemoryTile m={m} deleteMemory={deleteMemory} deleteComment={deleteComment} deleteImage={deleteImage}/>
                    })}
                </section>
            </div>
        )
    }
    
}

