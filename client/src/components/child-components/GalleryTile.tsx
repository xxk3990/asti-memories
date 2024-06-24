import {useState} from 'react'
export const GalleryTile = (props: { img: any; onImageLoad: any; }) => {
  const [showCaption, setShowCaption] = useState<boolean>(false)
  const img = props.img;
  const onImageLoad = props.onImageLoad;
  return (
    <section className='gallery-image-view'>
      <img onLoad={onImageLoad} className='gallery-image' src = {img.image_url} alt={img.image_caption} onMouseEnter={() => setShowCaption(!showCaption)} onMouseLeave={() => setShowCaption(!showCaption)}/>
      {
      showCaption && 
        <section className='image-caption-container'>
            <p className='gallery-image-caption'>{img.image_caption}</p>
        </section>
      }
    </section>
  )
}