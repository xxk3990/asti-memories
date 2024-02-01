import '../styles/gallery.css'
import {React, useState, useEffect} from 'react'
import { handleGet } from '../services/requests-service'
import { GalleryTile } from './child-components/GalleryTile'
export default function Gallery() {
    const [images, setImages] = useState([])
    const getImages = async () => {
        const endpoint = `gallery`
        await handleGet(endpoint, setImages)
    }
    useEffect(() => {
        getImages()
    }, [])
    if(images.length === 0) {
        return (
            <div className='Gallery'>
                <h1>Asti Images (none added yet)</h1>
                <section className='gallery-grid'>
                    
                </section>
            </div>
        )
    } else {
        return (
            <div className='Gallery'>
                <h1>Asti Images</h1>
                <section className='gallery-grid'>
                    {
                        images.map(img => {
                            return (
                                <GalleryTile img = {img} />
                            )
                        })

                    }
                </section>
            </div>
        )
    }
    
}