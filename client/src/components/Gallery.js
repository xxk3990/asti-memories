import '../styles/gallery.css'
import {React, useState, useEffect, useRef} from 'react'
import { handleGet } from '../services/requests-service'
import { GalleryTile } from './child-components/GalleryTile'
import {v4 as uuidv4} from 'uuid'

export default function Gallery() {
    const [gallery, setGallery] = useState([])
    const [loading, setLoading] = useState(false)
    const imageCounter = useRef(0)
    const getImages = async () => {
        setLoading(true)
        const endpoint = `gallery`
        await handleGet(endpoint, setGallery)
    }

    //remove "loading gallery" message if the counter reaches beyond the max # of images
    const onImageLoad = () => {
        imageCounter.current += 1;
        if(imageCounter.current >= gallery.length) {
            setLoading(false);
        }
    }
    
    //change order of photos on each render
    const randomized = gallery.sort(() => Math.random() - 0.5)
    useEffect(() => {
        getImages()
    }, [])

    if(gallery.length === 0) {
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
                <h1 className='gallery-title'><em>Asti</em> Image Gallery</h1>
                <p className='gallery-verbiage'>Many famous opera singers, musicians, actors, etc. visited the <em>Asti</em> over the years. Some posed for pictures with the staff and some gave Adolfo Mariani an autographed photo. 
                    Also included are some pics of newspaper articles about the restaurant, photos of the restaurant itself, and photos of staff. 
                    <br/> Hover over each image to read its caption!</p>
                {loading ? <p className='gallery-loading'>Loading gallery...</p> : null}
                <section className='collage-container'>
                {
                    randomized.map(img => {
                        return (
                            <GalleryTile key={uuidv4()} img={img} onImageLoad={onImageLoad}/>
                        )
                    })

                }
                </section>
            </div>
        )
    }
    
}