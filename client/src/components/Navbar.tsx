import '../styles/navbar.css'
import { Link } from 'react-router-dom';
export default function Navbar() {
    if(window.screen.width > 600) {
        return (
            <div className='Navbar'>
                <section className='nav'>
                    <span className='nav-item-home'><Link to='/'><em>Asti</em> Memories</Link></span>
                    <ul className = "nav-links">
                        <li className='nav-item'><Link to='/memoryForm'>Share Memory</Link></li>
                        <li className='nav-item'><Link to='/memories'>View Memories</Link></li>
                        <li className='nav-item'><Link to='/gallery'>Gallery</Link></li>
                        <li className='nav-item'><Link to='/timeline'>Timeline</Link></li>
                        <li className='nav-item'><Link to='/tribute'>Tribute</Link></li>
                    </ul>
                </section>
            </div>
        )
    } else {
        return (
            <div className='Navbar'>
                <section className='nav'>
                    
                    <ul className = "nav-links">
                        <li className='nav-item'><Link to='/'>Home</Link></li>
                        <li className='nav-item'><Link to='/memoryForm'>Share</Link></li>
                        <li className='nav-item'><Link to='/memories'>Memories</Link></li>
                        <li className='nav-item'><Link to='/gallery'>Gallery</Link></li>
                        <li className='nav-item'><Link to='/timeline'>Timeline</Link></li>
                        <li className='nav-item'><Link to='/tribute'>Tribute</Link></li>
                    </ul>
                </section>
            </div>
        )
    }
    
}