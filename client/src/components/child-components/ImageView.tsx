export const ImageView = (props: { image: any; }) => {
    const image = props.image;
    console.log("image:", image)
    return (
      <section className='image-view'>
        <img src = {image.image_url} alt={image.image_caption}/>
        <h4>{image.image_caption}</h4>
      </section>
    )
}