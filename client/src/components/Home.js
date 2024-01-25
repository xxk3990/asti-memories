import {React, useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import astiQuartet from "../images-static/asti-quartet.png"
import astiMenu from "../images-static/asti-menu-1960s.jpg"
import astiPostcard from "../images-static/asti-postcard.PNG"
import astiFront from "../images-static/asti-front.JPG"
import "../styles/home.css"
export default function Home() {
    const navigate = useNavigate();
    const navigateToForm = () => {
        navigate('/memoryForm')
    }
    const navigateToPosts = () => {
        navigate('/memories')
    }
    return (
        <div className='Home'>
            <section className = "restaurant-info">
            <h3 className='asti-verbiage'>
                    The <em>Asti</em>, a landmark New York City restaurant, brought opera from the uptown stage to
                    the downtown dinner table from 1924 to 2000. Located in Greenwich Village, back in
                    the day when “the Village” was the creative heart of Manhattan, the Asti was known as
                    the home of the singing waiters and the go-to hotspot to discover budding opera talents
                    who then went on to illustrious careers. Founder Adolfo Mariani, a baritone himself,
                    created the Asti with the idea that opera was not only for the elite. He was convinced,
                    that served up with dinner, famous arias, duets, rousing choruses and a dose of
                    audience participation anyone could and would become an opera lover. And they did.
                </h3>
                <section className='asti-images'>
                    <img className='asti-img-big' src={astiFront} alt="asti-front"/>
                    <section className='asti-images-small'>
                        <img className='asti-img-small' src={astiQuartet} alt="asti-quartet"/>
                        <img className='asti-img-small' src={astiPostcard} alt="asti-postcard"/>
                    </section>
                    <img className='asti-img' src={astiMenu} alt="asti-menu-1960s"/>
                </section>
                
                   
                <h3 className='asti-verbiage'>
                    This is Angela Mariani, Adolfo’s youngest daughter, and my life’s goal has been to write
                    a memoir about the Asti. 25 years have passed since the Asti closed, memories fade,
                    including my own, and by sharing, you will help bring the Asti story to life.
                    Whatever you choose to share will remain anonymous and you are not required to
                    provide any personal information.
                </h3>
            </section>
            <section className='nav-btns'>
                <button className='nav-btn' onClick={navigateToForm}>Go to Form</button>
                <button className='nav-btn' onClick={navigateToPosts}>Go to Posts</button>
            </section>
        </div>
    )
}