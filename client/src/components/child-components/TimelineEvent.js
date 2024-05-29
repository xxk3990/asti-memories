export const TimelineEvent = (props) => {
    const tm = props.tm;
    return (
      <section className='timeline-view'>
        <section className="timeline-data">
            <h4>{tm.year}</h4> <hr/>
            {tm.description}
        </section>
      </section>
    )
}