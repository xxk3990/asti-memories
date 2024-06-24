import { useState, useEffect} from 'react'
import { handleGet, handlePut } from '../../services/requests-service';
import {Snackbar} from '@mui/material'
import "../../styles/approval.css"
import { handleAdminDelete } from '../../services/admin-service';
import { UnapprovedMemoryTile } from './UnapprovedMemoryTile';
import { useNavigate } from 'react-router-dom';
export const ApproveMemories = () => {
    const [unapprovedMemories, setUnapprovedMemories] = useState<any>([])
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>("")
    const adminID = sessionStorage.getItem("admin_uuid")
    const navigate = useNavigate();
    const getMemoriesToApprove = async() => {
        if(adminID === null || adminID === "" || adminID === undefined) {
            navigate("/memories") //redirect if no admin_uuid is set
        } else {
            const endpoint = `approve`
            await handleGet(endpoint, setUnapprovedMemories)
        }
    }

    const approveMemory = async(memoryUUID: string) => {
        const endpoint = `approve`
        const body = {
            memory_uuid: memoryUUID
        }
        const response = await handlePut(endpoint, body);
        if(response.status === 201) {
            setOpenSnackbar(true);
            setSnackbarMessage("Memory Approved Successfully!")
            setTimeout(async() => {
                setOpenSnackbar(false);
                setSnackbarMessage("");
                getMemoriesToApprove();
            }, 1500)

        }
    }

    const deleteMemory = async(memoryUUID:string) => {
        const endpoint = `memories?memory_uuid=${memoryUUID}`
        const response = await handleAdminDelete(endpoint)
        if(response.status === 200) {
            const deleteEndpoint = `images?memory_uuid=${memoryUUID}`
            await handleAdminDelete(deleteEndpoint)
            setOpenSnackbar(true);
            setSnackbarMessage("Memory Deleted Successfully!")
            setTimeout(async() => {
                setOpenSnackbar(false);
                setSnackbarMessage("");
                getMemoriesToApprove();
            }, 1500)
            
        }
    }

    useEffect(() => {
        getMemoriesToApprove()
    }, [])
    if(unapprovedMemories.length === 0) {
        return (
            <div className='ApproveMemories'>
                <h1>No posts need approval!</h1>
            </div>
        )
    } else {
        return (
            <div className='ApproveMemories'>
                <Snackbar open={openSnackbar} autoHideDuration={2000} message={snackbarMessage} anchorOrigin={{horizontal: "center", vertical:"top"}}/>
                <section className='approve-memories-grid'>
                    {
                        unapprovedMemories.map(um => {
                            return <UnapprovedMemoryTile um={um} approveMemory={approveMemory} deleteMemory={deleteMemory}/>
                        })
                    }
                </section>
            </div>
        )
    }
    
}