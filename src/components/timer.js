import React, { useEffect, useState } from 'react'

const TimerComp = ({ end_date }) => {

    const [days, setDays] = useState("")
    const [hours, setHours] = useState("")
    const [min, setMin] = useState("")
    const [sec, setSec] = useState("")

    // console.log("end_date =>", end_date);

    useEffect(() => {
        let dest = new Date(end_date).getTime();
        setInterval(() => {
            let now = new Date().getTime();
            let diff = dest - now;
            setDays(Math.floor(diff / (1000 * 60 * 60 * 24)))
            setHours(Math.floor(diff % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)))
            setMin(Math.floor(diff % (1000 * 60 * 60) / (1000 * 60)))
            setSec(Math.floor(diff % (1000 * 60) / (1000)))
        }, 1000)
    }, [])

    return (
        <div className='countdown-container'>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex" }}>
                    <p style={{ fontWeight: "700", color: "black", fontSize: "14px" }}>{days < 10 ? "0" + days : days}</p>
                    <span style={{ margin: "0 3px" }}>:</span>
                    <p style={{ fontWeight: "700", color: "black", fontSize: "14px" }}>{hours < 10 ? "0" + hours : hours}</p>
                    <span style={{ margin: "0 3px" }}>:</span>
                    <p style={{ fontWeight: "700", color: "black", fontSize: "14px" }}>{min < 10 ? "0" + min : min}</p>
                    <span style={{ margin: "0 3px" }}>:</span>
                    <p style={{ fontWeight: "700", color: "black", fontSize: "14px" }}>{sec < 10 ? "0" + sec : sec}</p>
                </div>
            </div>
        </div>
    )
}

export default TimerComp;