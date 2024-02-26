import {React} from 'react'
import "../styles/home.css"
import astiTributeHeader from "../images-static/asti-tribute-header.jpeg"
import tributePart1 from "../images-static/asti-tribute-column1.jpeg"
import tributePart2 from "../images-static/asti-tribute-column2.jpeg"
import tributePart3 from "../images-static/asti-tribute-column3.jpeg"
import tributePart4 from "../images-static/asti-tribute-back1.jpeg"
import tributePart5 from "../images-static/asti-tribute-back2.jpeg"
import tributePart6 from "../images-static/asti-tribute-back3.jpeg"
import "../styles/tribute.css"
export default function Tribute() {
    return (
        <div className='Tribute'>
            <p>In 1983, the <em>Wall Street Journal</em> released a tribute to Mariani's Son, Augie, who took leadership of the restaurant after Adolfo passed.</p>
            <section className='tribute-images'>
                <img src={astiTributeHeader} className='asti-tribute-header' alt="asti-tribute"/>
                <section className='tribute-text-images'>
                    <img src={tributePart1} className='asti-tribute' alt="asti-tribute"/>
                    <img src={tributePart2} className='asti-tribute' alt="asti-tribute"/>
                    <img src={tributePart3} className='asti-tribute' alt="asti-tribute"/>
                    <section className='tribute-back-columns'>
                        <img src={tributePart4} className='asti-tribute-small' alt="asti-tribute"/>
                        <img src={tributePart5} className='asti-tribute-small' alt="asti-tribute"/>
                        <img src={tributePart6} className='asti-tribute-small' alt="asti-tribute"/>
                    </section>
                </section>
            </section>
        </div>
    )
}