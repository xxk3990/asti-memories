import '../styles/gallery.css'
import {React, useState} from 'react'
import axios from 'axios'
export default function Gallery() {

  
    const [images, setImages] = useState([])
    
    return (
        <div className='Gallery'>
            <section className='image-upload-form'>
                <h4>Image upload!</h4>
                
            </section>
        </div>
    )
}