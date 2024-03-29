import logo from '../logo.svg';
import '../styles/navbar.css'
import React  from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
export default function Navbar() {
    if(window.screen.width > 600) {
        return (
            <div className='Navbar'>
                <section className='nav'>
                    <span className='nav-item-home'><Link to='/'><em>Asti</em> Memories</Link></span>
                    <ul className = "nav-links">
                        <li className='nav-item'><Link to='/memoryForm'>Memory Form</Link></li>
                        <li className='nav-item'><Link to='/memories'>Shared Memories</Link></li>
                        <li className='nav-item'><Link to='/gallery'>Gallery</Link></li>
                        <li className='nav-item'><Link to='/tribute'>Tribute</Link></li>
                    </ul>
                </section>
            </div>
        )
    } else {
        return (
            <div className='Navbar'>
                <section className='nav'>
                    <span className='nav-item-home'><Link to='/'><em>Asti</em> Memories</Link></span>
                    <ul className = "nav-links">
                        <li className='nav-item'><Link to='/memoryForm'>Form</Link></li>
                        <li className='nav-item'><Link to='/memories'>Memories</Link></li>
                        <li className='nav-item'><Link to='/gallery'>Gallery</Link></li>
                        <li className='nav-item'><Link to='/tribute'>Tribute</Link></li>
                    </ul>
                </section>
            </div>
        )
    }
    
}