import {React, useState, useRef, useEffect} from "react"
import "../../styles/gallery.css"
import { handleGet } from "../../services/requests-service"
export const AudioView = () => {
    const [audioSource, setAudioSource] = useState("")
    const audioRef = useRef(null)
    const getAudio = async () => {
        const endpoint = 'audio'
        await handleGet(endpoint, setAudioSource)
    }

    useEffect(() => {
        getAudio();
    })

    const playSound = () => {
        audioRef.current.play();
    }

    const pauseSound = () => {
        audioRef.current.pause();
    }
    return (
        <section className="audio-player">
            <p className="gallery-verbiage">While you browse the gallery, we recommend playing the audio, <em>La traviata: Act I. “Libiamo, ne’ Lieti Calici”</em>. It originally comes from Guiseppe Verdi's <em>La traviata</em>, and became the opera tune that opened up the evening at <em>The Asti</em>. This version of it is from <a id="audio-source" href="https://commons.wikimedia.org/wiki/File:La_Traviata_-_Act_1_-_Libiamo_ne%27_lieti_calici.ogg">here</a> and was available in the public domain under the creative commons license.</p>
            <span className="play-pause-btns">
                <button className="audio-btn" onClick={playSound}>Start Audio</button>
                <button className="audio-btn" onClick={pauseSound}>Stop Audio</button>
                <audio src={audioSource} ref={audioRef}/>
            </span>
        </section>
    )
}
