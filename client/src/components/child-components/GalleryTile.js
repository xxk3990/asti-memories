import { React } from 'react'
import "../../styles/gallery.css"
export const GalleryTile = (props) => {
    const img = props.img;
    return (
        <section className='gallery-image-view'>
            <img src = {img.image_url} alt={img.image_caption} />
            <h4 className='gallery-image-caption'>{img.image_caption}</h4>
        </section>
    )
}