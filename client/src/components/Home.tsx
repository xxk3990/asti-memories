import { useNavigate } from 'react-router-dom'
import "../styles/home.css"
import astiQuartet from "../images-static/asti-quartet.png"
import astiMenu from "../images-static/asti-menu-1960s.jpg"
import astiPostcard from "../images-static/asti-postcard.png"
import astiFront from "../images-static/asti-front.jpeg"
import {AudioPlayer} from './child-components/AudioPlayer'
export default function Home() {
    return (
        <div className='Home'>
            <section className = "restaurant-info">
            <p className='asti-verbiage'>
            The <em>Asti</em>, a landmark New York City restaurant, brought opera from the uptown stage to the downtown dinner table from 1924 to 2000. Located in Greenwich Village, the creative heart of Manhattan at that time, the <em>Asti</em> was known as the home of the singing waiters and the go-to hotspot to discover budding opera talents. Founder Adolfo Mariani, a baritone himself, created the <em>Asti</em> with the idea that opera was not only for the elite. He was convinced that served up with dinner, famous arias, duets, rousing choruses and a dose of audience participation, anyone could and would become an opera lover. And they did. After Adolfo’s passing, Augusto Mariani, a tenor, carried his father’s operatic mission with brilliance and devotion until the <em>Asti</em> closed in 2000.

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
                This is Angela Mariani, Adolfo’s youngest daughter and I’m writing a memoir about the <em>Asti</em>. A family saga, a story of creativity and invention in pursuit of a dream, and a chronicle of a magical time in New York City.
By sharing your own <em>Asti</em> memories you will help me bring the <em>Asti</em> story to life. You are not required to provide any personal information and can remain anonymous. 

                </p>
            </section>
            <AudioPlayer/>
        </div>
    )
}