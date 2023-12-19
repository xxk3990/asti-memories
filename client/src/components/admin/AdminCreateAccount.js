import logo from '../../logo.svg';
import "../../styles/admin-create-account.css"
import React, { useState, useMemo, useEffect}  from 'react';
import { useNavigate } from 'react-router';
import {useForm} from "react-hook-form"

export default function AdminCreateAccount() {
    const navigate = useNavigate()
    useEffect(() => {
        document.title = "Create Admin Account"
    })
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm()
  
    const postAdmin = async (data) => {
        const postURL = `http://localhost:3000/admin`
        const requestBody = {
        display_name: data.display_name,
        email: data.email,
        password: data.password,
        }
        console.log('Params:', requestBody)
        const requestParams = {
        method: 'POST',
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify(requestBody)
        }
        try {
            const response = await fetch(postURL, requestParams)
            if(response.status === 200 || response.status === 201) {
                navigate('/adminLogin'); //redirect to admin login on successful account creation
            } else {
                alert("An error occurred.")
            }
        } catch {
            alert("An error occurred.")
        }
  
    }

  
    return (
        <div className="CreateAccount">
            <section className='add-user'>
                <h4>Create Admin Account</h4>
                <form onSubmit={handleSubmit(postAdmin)}>
                    <span className='user-form-question' id="username">
                        Display Name: <input type='text' name='display_name' className='user-input' {...register("display_name", {required: true})}/>
                        {errors.display_name && <span className='required-note'>This field is required</span>}
                    </span>
                    <span className='user-form-question' id="email">
                        Email: <input type='email' name='email' className='user-input' {...register("email", {required: true})}/>
                        {errors.email && <span className='required-note'>This field is required</span>}
                    </span>
                    <span className='user-form-question'id="password">
                        Password: <input type='password' name='password' className='user-input' {...register("password", {required: true})}/>
                        {errors.password && <span className='required-note'>This field is required</span>}
                    </span>
                    <button type='submit'>Submit</button>
                </form>
            </section>
        </div>
    );

}