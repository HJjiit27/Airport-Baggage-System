import socket from "../services/socket";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Dashboard.css";

import {
    FaSuitcase,
    FaSignInAlt,
    FaSignOutAlt,
    FaExclamationTriangle
} from "react-icons/fa";

function DashboardCards() {

    const [stats, setStats] = useState({

        totalBags: 0,
        checkedInBags: 0,
        checkedOutBags: 0,
        missingBags: 0

    });

    useEffect(() => {

        fetchDashboardStats();

        socket.on("dashboard-update", () => {

            fetchDashboardStats();

        });

        return () => {

            socket.off("dashboard-update");

        };

    }, []);

    const fetchDashboardStats = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/dashboard"
            );

            setStats(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <section className="dashboard">

            <div className="card total">

                <FaSuitcase className="card-icon"/>

                <h2>{stats.totalBags}</h2>

                <p>Total Bags</p>

            </div>

            <div className="card checkin">

                <FaSignInAlt className="card-icon"/>

                <h2>{stats.checkedInBags}</h2>

                <p>Checked-In Bags</p>

            </div>

            <div className="card checkout">

                <FaSignOutAlt className="card-icon"/>

                <h2>{stats.checkedOutBags}</h2>

                <p>Checked-Out Bags</p>

            </div>

            <div className="card missing">

                <FaExclamationTriangle className="card-icon"/>

                <h2>{stats.missingBags}</h2>

                <p>Missing Bags</p>

            </div>

        </section>

    );

}

export default DashboardCards;