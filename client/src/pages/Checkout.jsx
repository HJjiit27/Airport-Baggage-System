import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/CheckOut.css";

function CheckOut() {

    const { bagId: routeBagId } = useParams();

    const [bagId, setBagId] = useState(routeBagId || "");

    const [bagData, setBagData] = useState({
        iata_code: "",
        flight_no: "",
        destination_airport: "",
        bag_lock_status: "Locked",
        timestamp: ""
    });

    // NEW STATES
    const [checkoutStatus, setCheckoutStatus] = useState("Normal");
    const [remarks, setRemarks] = useState("");

    const searchBag = async (id = bagId) => {

        if (!id) {
            alert("Please Enter Bag ID");
            return;
        }

        try {

            const response = await axios.get(
                `http://localhost:5000/checkout/${id}`
            );

            setBagData(response.data);

        } catch (error) {

            console.log(error);
            alert("Bag Not Found ❌");

        }
    };

    useEffect(() => {

        if (routeBagId) {
            searchBag(routeBagId);
        }

    }, [routeBagId]);

    const handleCheckOut = async (e) => {

        e.preventDefault();

        try {

            const res = await axios.put(
                `http://localhost:5000/checkout/${bagId}`,
                {
                    bag_lock_status: bagData.bag_lock_status,
                    checkout_status: checkoutStatus,
                    remarks: remarks
                }
            );

            alert(res.data.message);

        } catch (error) {

            console.log(error);
            alert("Checkout Failed ❌");

        }
    };

    return (
        <>
            <Navbar />

            <div className="checkout-container">

                <div className="checkout-card">

                    <h1>Bag Check-Out</h1>

                    <p className="subtitle">
                        Update baggage checkout details
                    </p>

                    <form onSubmit={handleCheckOut}>

                        <div className="form-group">

                            <label>Bag ID</label>

                            <div className="search-row">

                                <input
                                    type="text"
                                    placeholder="BG000001"
                                    value={bagId}
                                    onChange={(e) =>
                                        setBagId(e.target.value)
                                    }
                                />

                             <button
    type="button"
    className="search-btn"
    onClick={() => searchBag()}
>
    Search
</button>

                            </div>

                        </div>

                        <div className="form-group">

                            <label>IATA Code</label>

                            <input
                                type="text"
                                value={bagData.iata_code}
                                readOnly
                            />

                        </div>

                        <div className="form-group">

                            <label>Flight Number</label>

                            <input
                                type="text"
                                value={bagData.flight_no}
                                readOnly
                            />

                        </div>

                        <div className="form-group">

                            <label>Destination Airport</label>

                            <input
                                type="text"
                                value={bagData.destination_airport}
                                readOnly
                            />

                        </div>

                        <div className="form-group">

                            <label>Bag Lock Status</label>

                            <select
                                value={bagData.bag_lock_status}
                                onChange={(e) =>
                                    setBagData({
                                        ...bagData,
                                        bag_lock_status: e.target.value
                                    })
                                }
                            >
                                <option value="Locked">Locked</option>
                                <option value="Unlocked">Unlocked</option>
                            </select>

                        </div>

                        {/* NEW FIELD */}

                        <div className="form-group">

                            <label>Checkout Decision</label>

                            <select
                                value={checkoutStatus}
                                onChange={(e) =>
                                    setCheckoutStatus(e.target.value)
                                }
                            >
                                <option value="Normal">Normal</option>
                                <option value="Missing">Missing</option>
                                <option value="Damaged">Damaged</option>
                                <option value="Lock Broken">Lock Broken</option>
                            </select>

                        </div>

                        {/* NEW FIELD */}

                        <div className="form-group">

                            <label>Remarks</label>

                            <textarea
                                rows="4"
                                placeholder="Enter Remarks..."
                                value={remarks}
                                onChange={(e) =>
                                    setRemarks(e.target.value)
                                }
                            />

                        </div>

                        <button
                            type="submit"
                            className="checkout-btn"
                        >
                            Confirm Check-Out
                        </button>

                    </form>

                </div>

            </div>

            <Footer />

        </>
    );
}

export default CheckOut;