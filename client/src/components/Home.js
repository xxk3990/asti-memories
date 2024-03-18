import {React} from 'react'
import { useNavigate } from 'react-router-dom'
import "../styles/home.css"
import astiQuartet from "../images-static/asti-quartet.png"
import astiMenu from "../images-static/asti-menu-1960s.jpg"
import astiPostcard from "../images-static/asti-postcard.PNG"
import astiFront from "../images-static/asti-front.jpeg"
import {AudioPlayer} from './child-components/AudioPlayer'
export default function Home() {
    return (
        <div className='Home'>
            <section className = "restaurant-info">
            <p className='asti-verbiage'>
            The <em>Asti</em>, a landmark New York City restaurant, brought opera from the uptown stage to
            the downtown dinner table for 75 years. Located in Greenwich Village when the Village
            was the creative heart of Manhattan, the <em>Asti</em> was known as the home of the singing
            waiters and the go-to hotspot to discover budding opera talents who then went on to
            illustrious careers. Founder Adolfo Mariani, a baritone himself, created the <em>Asti</em> with the
            idea that opera was not only for the elite. He was convinced that served up with dinner,
            famous arias, duets, rousing choruses and a dose of audience participation anyone
            could and would become an opera lover. And they did. From 1980-2000, after Adolfo’s
            passing, Augusto Mariani carried his father’s operatic mission with brilliance and
            devotion until the <em>Asti</em> closed in 2000.
                </p>
                <section className='asti-images'>
                    <img className='asti-img-big' src={astiFront} alt="asti-front"/>
                    <section className='asti-images-small'>
                        <img className='asti-img-small' src={astiQuartet} alt="asti-quartet"/>
                        <img className='asti-img-small' src={astiPostcard} alt="asti-postcard"/>
                    </section>
                    <img className='asti-img' src={astiMenu} alt="asti-menu-1960s"/>
                </section>
                
                   
                <p className='asti-verbiage'>
                This is Angela Mariani, Adolfo’s youngest daughter, and I am inviting you to share your
                    own memories on the form page so I can fulfill a very personal mission to bring the <em>Asti</em>
                    story to life. They need not be rooted in historical accuracy - how did the <em>Asti</em>
                    made you feel? The memoir will chronicle a time in NYC history, when Greenwich Village was the
                    wellspring of artistic talent and possibilities, but it will also explore the collective
                    memories that all family sagas share. Whatever you choose to share will remain anonymous and you are not required to
                    provide any personal information.
                </p>
            </section>
            <AudioPlayer/>
        </div>
    )
}