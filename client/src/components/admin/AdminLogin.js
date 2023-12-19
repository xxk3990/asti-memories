import logo from '../../logo.svg';
import '../../styles/admin-login.css'
import React, { useState, useMemo, useEffect}  from 'react';
import { Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { handleAdminLogin } from '../../services/admin-service';
import {useForm} from "react-hook-form"
export default function AdminLogin() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: {errors}
} = useForm()

  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    document.title = "Admin Login"
  })

  const navigateCreateAccount = () => {
    navigate('/adminCreateAccount')
  }
  
  const submitLogin = async (data) => {
    const postURL = `http://localhost:3000/adminLogin`
    const requestBody = {
      email: data.email,
      password: data.password,
    }
    try {
      const response = await handleAdminLogin(postURL, requestBody)
      if(response.status === 200 || response.status === 201) {
        const serverData = await response.data;
        sessionStorage.setItem("admin_uuid", serverData.admin_uuid);
        sessionStorage.setItem("user_uuid", serverData.user_uuid);
        setOpenSnackbar(true)
        setTimeout(() => {
            setOpenSnackbar(false);
            navigate(`/manageMemories`);
        }, 1500)
      } else if(response.status === 401) {
        alert("Not authorized!")
      }
    } catch{
      alert("Admin Login Info is incorrect")
    }
  
  }

  
  return (
    <div className="AdminLogin">
     <Snackbar open={openSnackbar} autoHideDuration={2000} message="Login Successful!" anchorOrigin={{horizontal: "center", vertical:"top"}}/>
      <section className='user-login'>
        <h1>Admin Login - Asti Memories</h1>
        <form className='login-form' onSubmit={handleSubmit(submitLogin)}>
          <span className='login-form-question' id="email">
            Email: <input type='email' name='email' className='email-input' {...register("email", {required: true})}/>
            {errors.email && <span className='required-note'>This field is required</span>}
          </span>
          <span className='login-form-question'id="password">
            Password: <input type='password' name='password' className='password-input'{...register("password", {required: true})}/>
            {errors.password && <span className='required-note'>This field is required</span>}
          </span>
        <button type="submit">Submit</button>
          </form>
      </section>
      <span>New Admin? Create Account<button className='create-account-btn' type='button' onClick={navigateCreateAccount}>Create Account</button></span>
    </div>
  );
  
}