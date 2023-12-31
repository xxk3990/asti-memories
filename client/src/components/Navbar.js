import logo from '../logo.svg';
import '../styles/navbar.css'
import React  from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
export default function Navbar() {
    return (
        <div className='Navbar'>
            <section className='nav-loggedin'>
                <ul className = "nav-links">
                    <li className='nav-item'><Link to='/memories'>Memories</Link></li>
                    <li className='nav-item'><Link to='/gallery'>Gallery</Link></li>
                    <li className='nav-item'><Link to='/'>Home</Link></li>
                </ul>
            </section>
        </div>
    )
}