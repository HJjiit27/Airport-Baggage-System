import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/CheckIn.css";

function CheckIn() {

    const [formData, setFormData] = useState({

        iata_code: "",
        flight_no: "",
        "destination_airport": "",
        bag_presence: "Present",
        bag_lock_status: "Locked"

    });

    const handleChange = (e) => {

        setFormData({

            ...formData,
            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post(

                "http://localhost:5000/checkin",
                formData

            );

        alert(
    `${response.data.message}\n\nBag ID: ${response.data.bag_id}`
);

            setFormData({

                iata_code: "",
                flight_no: "",
                "destination_airport": "",
                bag_presence: "Present",
                bag_lock_status: "Locked"

            });

        } catch (error) {

            console.error(error);

            alert("Something went wrong!");

        }

    };

    return (

        <>
            <Navbar />

            <div className="checkin-container">

                <form
                    className="checkin-card"
                    onSubmit={handleSubmit}
                >

                    <h2>Bag Check-In</h2>

                    <label>IATA Code</label>

                    <input
                        type="text"
                        name="iata_code"
                        placeholder="Enter IATA Code"
                        value={formData.iata_code}
                        onChange={handleChange}
                        required
                    />

                    <label>Flight Number</label>

                    <input
                        type="text"
                        name="flight_no"
                        placeholder="Enter Flight Number"
                        value={formData.flight_no}
                        onChange={handleChange}
                        required
                    />

                  <label>Destination Airport</label>

                    <input
                        type="text"
                        name="destination_airport"
                        placeholder="Enter Destination Airport"
                       value={formData.destination_airport}
                        onChange={handleChange}
                        required
                    />

                   

                    <label>Bag Lock Status</label>

                    <select
                        name="bag_lock_status"
                        value={formData.bag_lock_status}
                        onChange={handleChange}
                    >

                        <option value="Locked">Locked</option>

                        <option value="Unlocked">Unlocked</option>

                    </select>

                    <button type="submit">

                        Check-In Bag

                    </button>

                </form>

            </div>

        </>

    );

}

export default CheckIn;