import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  FaEye,
  FaMapMarkerAlt,
  FaPlane,
  FaSearch,
  FaSignOutAlt,
  FaSuitcaseRolling
} from "react-icons/fa";
import "../styles/Records.css";

const API_URL = "http://localhost:5000/records";

function Records() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [flightFilter, setFlightFilter] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 8;

  const fetchRecords = async () => {
    try {
      const response = await axios.get(API_URL);
      setRecords(response.data);
    } catch (error) {
      console.error("Could not fetch baggage records:", error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const deleteRecord = async (id) => {
    if (!window.confirm("Are you sure you want to delete this baggage record?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("Record deleted successfully.");
      fetchRecords();
    } catch (error) {
      console.error("Could not delete baggage record:", error);
      alert("Delete failed.");
    }
  };

  const flights = useMemo(
    () => [...new Set(records.map(({ flight_no }) => flight_no).filter(Boolean))],
    [records]
  );
  const destinations = useMemo(
    () => [...new Set(records.map(({ destination_airport }) => destination_airport).filter(Boolean))],
    [records]
  );

  const filteredRecords = useMemo(() => records.filter((record) => {
    const bagMatch = (record.bag_id || "").toLowerCase().includes(search.toLowerCase());
    const flightMatch = !flightFilter || record.flight_no === flightFilter;
    const destinationMatch = !destinationFilter || record.destination_airport === destinationFilter;
    const statusMatch = !statusFilter || record.checkout_status === statusFilter;

    return bagMatch && flightMatch && destinationMatch && statusMatch;
  }), [records, search, flightFilter, destinationFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / rowsPerPage));
  const activePage = Math.min(currentPage, totalPages);
  const currentRecords = filteredRecords.slice(
    (activePage - 1) * rowsPerPage,
    activePage * rowsPerPage
  );

  const updateFilter = (setter) => (event) => {
    setter(event.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <Navbar />

      <main className="records-page">
        <header className="records-header">
          <h1><FaSuitcaseRolling /> Airport Baggage Records</h1>
          <p>Manage and monitor every baggage movement.</p>
        </header>

        <section className="filter-bar" aria-label="Record filters">
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="search"
              placeholder="Search Bag ID"
              value={search}
              onChange={updateFilter(setSearch)}
            />
          </div>

          <div className="filter-box">
            <FaPlane />
            <select value={flightFilter} onChange={updateFilter(setFlightFilter)}>
              <option value="">All Flights</option>
              {flights.map((flight) => <option key={flight} value={flight}>{flight}</option>)}
            </select>
          </div>

          <div className="filter-box">
            <FaMapMarkerAlt />
            <select value={destinationFilter} onChange={updateFilter(setDestinationFilter)}>
              <option value="">All Destinations</option>
              {destinations.map((destination) => (
                <option key={destination} value={destination}>{destination}</option>
              ))}
            </select>
          </div>

          <div className="filter-box">
            <FaSuitcaseRolling />
            <select value={statusFilter} onChange={updateFilter(setStatusFilter)}>
              <option value="">All Checkout Statuses</option>
              <option value="Checked Out">Checked Out</option>
              <option value="Missing">Missing</option>
              <option value="Damaged">Damaged</option>
              <option value="Lock Broken">Lock Broken</option>
            </select>
          </div>
        </section>

        <section className="table-container">
          <table className="records-table">
            <thead>
              <tr>
                <th>Bag ID</th>
                <th>Flight</th>
                <th>Destination</th>
                <th>Lock</th>
                <th>Presence</th>
                <th>Bag Status</th>
                <th>Checkout Status</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.bag_id}</td>
                  <td>{record.flight_no}</td>
                  <td>{record.destination_airport}</td>
                  <td><span className={record.bag_lock_status === "Locked" ? "lock" : "unlock"}>{record.bag_lock_status}</span></td>
                  <td><span className={record.bag_presence === "Present" ? "present" : "missing"}>{record.bag_presence}</span></td>
                  <td><span className={record.bag_status === "Checked Out" ? "checked-out" : record.bag_status === "Missing" ? "missing" : "checked-in"}>{record.bag_status}</span></td>
                  <td><span className={`checkout-status ${String(record.checkout_status || "pending").toLowerCase().replace(/\s+/g, "-")}`}>{record.checkout_status || "Pending"}</span></td>
                  <td>{record.remarks || "-"}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/tracking/${record.bag_id}`} className="track-btn"><FaEye /> Track</Link>
                      <Link to={`/checkout/${record.bag_id}`} className="checkout-btn"><FaSignOutAlt /> Checkout</Link>
                      <button className="delete-btn" onClick={() => deleteRecord(record.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!currentRecords.length && (
                <tr><td colSpan="9" className="empty-records">No baggage records found.</td></tr>
              )}
            </tbody>
          </table>
        </section>

        <nav className="pagination" aria-label="Pagination">
          <button disabled={activePage === 1} onClick={() => setCurrentPage(activePage - 1)}>Previous</button>
          <span>Page {activePage} of {totalPages}</span>
          <button disabled={activePage === totalPages} onClick={() => setCurrentPage(activePage + 1)}>Next</button>
        </nav>
      </main>
    </>
  );
}

export default Records;
