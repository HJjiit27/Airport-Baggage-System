import socket from "../services/socket";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/RecentActivity.css";

function RecentActivity() {

    const [activities, setActivities] = useState([]);

    useEffect(() => {

        fetchRecentActivity();

        socket.on("activity-update", fetchRecentActivity);

        return () => {

            socket.off("activity-update", fetchRecentActivity);

        };

    }, []);

    const fetchRecentActivity = async () => {

        try{

            const response = await axios.get(
                "http://localhost:5000/recent-activity"
            );

            setActivities(response.data);

        }

        catch(error){

            console.log(error);

        }

    };

    const getStatus = (item) => {

        if(item.bag_presence==="Missing"){

            return{
                icon:"🔴",
                text:"Missing",
                color:"#ef4444"
            };

        }

        if(item.checkout_timestamp){

            return{
                icon:"✅",
                text:"Checked Out",
                color:"#22c55e"
            };

        }

        return{

            icon:"🟢",
            text:"Checked In",
            color:"#2563eb"

        };

    };

    return(

        <section className="activity-section">

            <h2>Recent Airport Activities</h2>

            <div className="timeline">

                {

                    activities.map((item)=>{

                        const status=getStatus(item);

                        return(

                            <div
                                className="timeline-item"
                                key={item.bag_id}
                            >

                                <div
                                    className="timeline-dot"
                                    style={{background:status.color}}
                                ></div>

                                <div className="timeline-content">

                                    <div className="timeline-header">

                                        <h3>

                                            {status.icon} {status.text}

                                        </h3>

                                        <span>

                                            {
                                                new Date(item.timestamp)
                                                .toLocaleString()
                                            }

                                        </span>

                                    </div>

                                    <p>

                                        <strong>Bag ID:</strong> {item.bag_id}

                                    </p>

                                    <p>

                                        <strong>Flight:</strong> {item.flight_no}

                                    </p>

                                    <p>

                                        <strong>Destination:</strong> {item.destination_airport}

                                    </p>

                                    <p>

                                        <strong>Lock:</strong> {item.bag_lock_status}

                                    </p>

                                </div>

                            </div>

                        )

                    })

                }

            </div>

        </section>

    )

}

export default RecentActivity;