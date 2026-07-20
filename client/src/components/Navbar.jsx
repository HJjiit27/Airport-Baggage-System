import logo from "../assets/images/Beumer_Group_Logo.svg";
import "../styles/Navbar.css";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        <object
          data={logo}
          type="image/svg+xml"
          className="logo-img"
        ></object>
      </div>

      <ul className="nav-links">

        <li>
          <NavLink to="/" end>
            Home
          </NavLink>
        </li>

        <li>
          <NavLink to="/checkin">
            Check-In
          </NavLink>
        </li>

        <li>
          <NavLink to="/checkout">
            Check-Out
          </NavLink>
        </li>

        <li>
          <NavLink to="/tracking">
            Track Bag
          </NavLink>
        </li>

        <li>
          <NavLink to="/records">
            Records
          </NavLink>
        </li>

      </ul>

    </nav>
  );
}

export default Navbar;