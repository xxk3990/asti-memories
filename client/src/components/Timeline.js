import React, {useState, useEffect} from "react";
import '../styles/timeline.css'
import { handleGet } from "../services/requests-service";
import { TimelineEvent } from "./child-components/TimelineEvent";
export default function Timeline() {
    const [timeline, setTimeline] = useState([])
    const getEventsForTimeline = async () => {
        const endpoint = `timeline`
        await handleGet(endpoint, setTimeline)
    }
    useEffect(() => {
        getEventsForTimeline();
        
    }, [])
    timeline.sort((x,y) => x.year - y.year)
    return (
        <div className="Timeline">
            <section className="timeline-grid">
                {
                    timeline.map(tm => {
                        return <TimelineEvent tm={tm}/>
                    })
                }
            </section>
        </div>
    )
}