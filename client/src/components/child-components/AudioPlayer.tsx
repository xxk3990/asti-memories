import {useState, useRef, useEffect} from "react"
import "../../styles/home.css"
import { handleGet } from "../../services/requests-service"
export const AudioPlayer = () => {
    const [audioSource, setAudioSource] = useState<string>("")
    const audioRef = useRef<any>(null)
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
            <p className="audio-verbiage">For inspiration click on the audio button below to hear <em>Libiamo, ne’ Lieti Calici</em> from Giuseppe Verdi’s <em>La Traviata</em>.  The aria is an invitation to celebrate and opened the evening’s entertainment at the <em>Asti</em>.
 This version of it is from <a target="_blank" className="audio-link" href="https://commons.wikimedia.org/wiki/File:La_Traviata_-_Act_1_-_Libiamo_ne%27_lieti_calici.ogg">here</a> and is available in the public domain under the <a target="_blank" href="https://creativecommons.org/publicdomain/zero/1.0/deed.en" className="audio-link">Creative Commons license.</a></p>
            <span className="play-pause-btns">
                <button className="audio-btn" onClick={playSound}>Start Audio</button>
                <button className="audio-btn" onClick={pauseSound}>Stop Audio</button>
                <audio src={audioSource} ref={audioRef}/>
            </span>
        </section>
    )
}
