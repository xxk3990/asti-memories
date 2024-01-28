import logo from '../logo.svg';
import '../styles/navbar.css'
import React  from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
export default function Navbar() {
    return (
        <div className='Navbar'>
            <section className='nav-loggedin'>
                <span className='nav-item-home'><Link to='/'><em>Asti</em> Memories</Link></span>
                <ul className = "nav-links">
                    <li className='nav-item'><Link to='/memoryForm'>Memory Form</Link></li>
                    <li className='nav-item'><Link to='/memories'>Public Memories</Link></li>
                    <li className='nav-item'><Link to='/gallery'>Image Gallery</Link></li>
                </ul>
            </section>
        </div>
    )
}