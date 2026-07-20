import { useNavigate } from "react-router-dom";
import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaSearch,
  FaClipboardList,
} from "react-icons/fa";

import "../styles/QuickActions.css";

function QuickActions() {
  const navigate = useNavigate();

  return (
    <section className="quick-actions">

      <div
        className="action-card"
        onClick={() => navigate("/checkin")}
      >
        <FaPlaneDeparture className="action-icon" />
        <h3>Check In</h3>
        <p>Register passenger baggage</p>
      </div>

      <div
        className="action-card"
        onClick={() => navigate("/checkout")}
      >
        <FaPlaneArrival className="action-icon" />
        <h3>Check Out</h3>
        <p>Deliver baggage safely</p>
      </div>

      <div
        className="action-card"
        onClick={() => navigate("/tracking")}
      >
        <FaSearch className="action-icon" />
        <h3>Track Bag</h3>
        <p>View complete bag journey</p>
      </div>

      <div
        className="action-card"
        onClick={() => navigate("/records")}
      >
        <FaClipboardList className="action-icon" />
        <h3>Records</h3>
        <p>View baggage records</p>
      </div>

    </section>
  );
}

export default QuickActions;