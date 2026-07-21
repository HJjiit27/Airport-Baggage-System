import { useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaCheckCircle,
  FaSuitcaseRolling,
  FaShieldAlt,
  FaPlane,
  FaBoxOpen,
  FaPlaneDeparture,
} from "react-icons/fa";

import Navbar from "../components/Navbar";
import "../styles/Tracking.css";

function Tracking() {
  const [bagId, setBagId] = useState("");
  const [bag, setBag] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchBag = async () => {
    if (!bagId.trim()) {
      alert("Please Enter Bag ID");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:5000/tracking/${bagId}`
      );

      setBag(response.data.bag);
      setTimeline(response.data.timeline);
    } catch (err) {
      console.log(err);

      alert("Bag Not Found");

      setBag(null);
      setTimeline([]);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (activity) => {
    switch (activity) {
      case "Checked In":
        return <FaCheckCircle color="#16a34a" size={22} />;

      case "Tracking Completed":
        return <FaSuitcaseRolling color="#2563eb" size={22} />;

      case "Security Cleared":
        return <FaShieldAlt color="#f59e0b" size={22} />;

      case "Aircraft Loaded":
        return <FaPlane color="#9333ea" size={22} />;

      case "Checked Out":
        return <FaBoxOpen color="#10b981" size={22} />;

      default:
        return <FaPlaneDeparture color="#2563eb" size={22} />;
    }
  };

  return (
    <>
      <Navbar />

      <div className="tracking-page">
        <div className="tracking-title">
          <h1>✈ Airport Baggage Tracking</h1>

          <p>
            Track baggage movement in real-time through every airport checkpoint.
          </p>
        </div>

        <div className="search-card">
          <div className="search-input">
            <FaSearch className="search-icon" />

            <input
              type="text"
              placeholder="Enter Bag ID (Example: BG000034)"
              value={bagId}
              onChange={(e) => setBagId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchBag();
                }
              }}
            />
          </div>

          <button className="search-btn" onClick={searchBag}>
            Search
          </button>
        </div>

        {loading && (
          <div className="no-data">
            <h2>Searching...</h2>
          </div>
        )}

        {bag && (
          <div className="info-card">
            <h2>🧳 Bag Information</h2>

            <div className="info-grid">
              <div className="info-item">
                <span>Bag ID</span>
                <strong>{bag.bag_id}</strong>
              </div>

              <div className="info-item">
                <span>Flight Number</span>
                <strong>{bag.flight_no}</strong>
              </div>

              <div className="info-item">
                <span>Destination</span>
                <strong>{bag.destination_airport}</strong>
              </div>

              <div className="info-item">
                <span>Lock Status</span>
                <strong>{bag.bag_lock_status}</strong>
              </div>

              <div className="info-item">
                <span>Bag Presence</span>
                <strong>{bag.bag_presence}</strong>
              </div>

              <div className="info-item">
                <span>Check-In Time</span>
                <strong>
                  {new Date(bag.timestamp).toLocaleString()}
                </strong>
              </div>

              {bag.checkout_timestamp && (
                <div className="info-item">
                  <span>Checkout Time</span>

                  <strong>
                    {new Date(bag.checkout_timestamp).toLocaleString()}
                  </strong>
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && timeline.length === 0 && !bag && (
          <div className="no-data">
            <h2>No Tracking Data</h2>

            <p>Search any Bag ID to view its journey.</p>
          </div>
        )}

        {timeline.length > 0 && (
          <div className="timeline-box">
            <h2>Journey Timeline</h2>

            {timeline.map((item, index) => (
              <div className="timeline-item" key={index}>
                <div className="timeline-left">
                  <div className="dot"></div>

                  {index !== timeline.length - 1 && (
                    <div className="line"></div>
                  )}
                </div>

                <div className="timeline-card">
                  <h3>
                    {getIcon(item.activity)}
                    <span style={{ marginLeft: "10px" }}>
                      {item.activity}
                    </span>
                  </h3>

                <p>
  {new Date(item.timestamp).toLocaleString()}
</p>
                  <span className="badge">
                    Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Tracking;