import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/css/style.css";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg custom-navbar fixed-top ${
          scrolled ? "scrolled" : ""
        }`}
        style={{
          background: scrolled
            ? "linear-gradient(135deg, rgba(18, 15, 15, 0.8), rgba(18, 14, 14, 0.8))"
            : "linear-gradient(135deg, rgba(221, 216, 216, 0.2), rgba(255, 252, 252, 0.2))",
          boxShadow: scrolled ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "none",
          transition: "all 0.3s ease",
          padding: scrolled ? "10px 0" : "15px 0",
        }}
      >
        <div className="container">
          <Link className="navbar-brand logo-text" to="/">
            <img
              src={logo}
              alt="Softpro India Logo"
              className="img-fluid py-0"
              style={{ height: scrolled ? "50px" : "60px", transition: "height 0.3s ease" }}
            />
          </Link>

          <button
            className="navbar-toggler custom-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/jobs"
                  style={{
                    color: scrolled ? "#fff" : "#333",
                    fontWeight: "500",
                    fontSize: "16px",
                    transition: "color 0.3s ease",
                  }}
                >
                  JOBS
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/students"
                  style={{
                    color: scrolled ? "#fff" : "#333",
                    fontWeight: "500",
                    fontSize: "16px",
                    transition: "color 0.3s ease",
                  }}
                >
                  STUDENTS
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/employers"
                  style={{
                    color: scrolled ? "#fff" : "#333",
                    fontWeight: "500",
                    fontSize: "16px",
                    transition: "color 0.3s ease",
                  }}
                >
                  EMPLOYERS
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/about"
                  style={{
                    color: scrolled ? "#fff" : "#333",
                    fontWeight: "500",
                    fontSize: "16px",
                    transition: "color 0.3s ease",
                  }}
                >
                  ABOUT
                </Link>
              </li>
            </ul>

            <div className="d-flex">
              <Link
                to="/signin"
                className="btn custom-btn"
                
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;