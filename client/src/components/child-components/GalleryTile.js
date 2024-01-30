import { React } from 'react'
export const GalleryTile = (props) => {
    const img = props.img;
    return (
        <section className='image-view'>
            <img src = {img.image_url} alt={img.image_caption} />
            <h4>{img.image_caption}</h4>
        </section>
    )
}