import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      {/* LOGO */}
      <div className="navbar-logo">
        <span className="logo-icon">🚨</span>
        <span className="logo-text">HospAlert AI</span>
      </div>

      {/* LINKS */}
      <div className="navbar-links">
        <Link 
          to="/" 
          className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
        >
          Dashboard
        </Link>

        <Link 
          to="/admin" 
          className={`nav-link ${location.pathname === "/admin" ? "active" : ""}`}
        >
          Admin
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;