import React, { useState, useEffect } from "react";
import "../admin/Dashboard.css";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import { Link, Outlet } from "react-router";
import {
  FaTachometerAlt,
  FaClipboardList,
  FaBook,
  FaFileAlt,
  FaVideo,
  FaClipboardCheck,
  FaBell,
  FaComments,
  FaFileSignature,
  FaQuestionCircle,
} from "react-icons/fa";

// ---------------- SIDEBAR ----------------
const Sidebar = ({ isCollapsed, toggleSidebar, activeMenu, setActiveMenu }) => {
  return (
    <div
      className={`sidebar ${isCollapsed ? "collapsed" : ""}`}
      style={{ height: "100vh", overflowY: "scroll" }}
    >
      <div className="sidebar-header">
        <button className="toggle-btn" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i>
        </button>
        {!isCollapsed && <h4>Student</h4>}
      </div>

      <ul className="nav flex-column">

        {/* Dashboard */}
        <li className={`nav-item ${activeMenu === "Dashboard" ? "active" : ""}`}>
          <Link to="/student/dashboard" className="nav-link">
            <FaTachometerAlt />
            <span className="sidebar-text">Dashboard</span>
          </Link>
        </li>

        {/* Attendance */}
        <li className={`nav-item ${activeMenu === "Attendance" ? "active" : ""}`}>
          <Link to="/student/attendance" className="nav-link">
            <FaClipboardCheck />
            <span className="sidebar-text">Attendance</span>
          </Link>
        </li>

        {/* Assessment */}
        <li className={`nav-item ${activeMenu === "Assessment" ? "active" : ""}`}>
          <Link to="/student/assessment" className="nav-link">
            <FaClipboardList />
            <span className="sidebar-text">Assessment</span>
          </Link>
        </li>

        {/* Contents */}
        <li className={`nav-item ${activeMenu === "Contents" ? "active" : ""}`}>
          <Link to="content" className="nav-link">
            <FaBook />
            <span className="sidebar-text">Contents</span>
          </Link>
        </li>

        {/* Documents */}
        <li className={`nav-item ${activeMenu === "Documents" ? "active" : ""}`}>
          <Link to="/student/documents" className="nav-link">
            <FaFileAlt />
            <span className="sidebar-text">Documents</span>
          </Link>
        </li>

        {/* Online Classes */}
        <li className={`nav-item ${activeMenu === "Online Classes" ? "active" : ""}`}>
          <Link to="/student/online-classes" className="nav-link">
            <FaVideo />
            <span className="sidebar-text">Online Classes</span>
          </Link>
        </li>

        {/* Online Test */}
        <li className={`nav-item ${activeMenu === "Online Test" ? "active" : ""}`}>
          <Link to="/student/online-test" className="nav-link">
            <FaClipboardList />
            <span className="sidebar-text">Online Test</span>
          </Link>
        </li>

        {/* Results */}
        <li className={`nav-item ${activeMenu === "Results" ? "active" : ""}`}>
          <Link to="/student/results" className="nav-link">
            <FaClipboardCheck />
            <span className="sidebar-text">Results</span>
          </Link>
        </li>

        {/* Notification */}
        <li className={`nav-item ${activeMenu === "Notification" ? "active" : ""}`}>
          <Link to="/student/notification" className="nav-link">
            <FaBell />
            <span className="sidebar-text">Notification</span>
          </Link>
        </li>

        {/* Discussion Forum */}
        <li className={`nav-item ${activeMenu === "Discussion Forum" ? "active" : ""}`}>
          <Link to="/student/discussion-forum" className="nav-link">
            <FaComments />
            <span className="sidebar-text">Discussion Forum</span>
          </Link>
        </li>

        {/* Resume Builder */}
        <li className={`nav-item ${activeMenu === "Resume Builder" ? "active" : ""}`}>
          <Link to="/student/resume-builder" className="nav-link">
            <FaFileSignature />
            <span className="sidebar-text">Resume Builder</span>
          </Link>
        </li>

        {/* Add Interview Questions */}
        <li className={`nav-item ${activeMenu === "Add Interview Questions" ? "active" : ""}`}>
          <Link to="/student/interview-questions" className="nav-link">
            <FaQuestionCircle />
            <span className="sidebar-text">Add Interview Questions</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

// ---------------- TOPBAR ----------------
const Topbar = ({ isCollapsed }) => {
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className={`topbar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="topbar-left">
        <h5>{getGreeting()}, Student!</h5>
      </div>
      <div className="topbar-right">
        <div className="notifications">
          <FaBell />
          <span className="badge bg-danger">2</span>
        </div>
        <div className="notifications">
          <FaQuestionCircle />
        </div>
        <div className="user-info">
          <div className="dropdown">
            <img
              src="https://avatar.iran.liara.run/public/34"
              style={{ height: "50px" }}
              alt="User"
              className="user-img"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            />
            <span>
              <i className="fas fa-circle text-success"></i>
            </span>
            <ul className="dropdown-menu">
              <li>
                <Link className="dropdown-item" to="#">
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item"
                  onClick={() => {
                    localStorage.clear();
                    navigate("/signin");
                  }}
                >
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------- MAIN CONTENT ----------------
const MainContent = ({ isCollapsed }) => {
  return (
    <div className={`main-content ${isCollapsed ? "collapsed" : ""}`}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-11 mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------- DASHBOARD ----------------
const UserDashboard = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token) {
      navigate("/signin");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/signin");
      }
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
      navigate("/signin");
    }

    if (role !== "Student") {
      navigate("/signin");
    }
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
        setActiveMenu(null);
      } else {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="dashboard">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />
      <Topbar isCollapsed={isCollapsed} />
      <MainContent isCollapsed={isCollapsed} />
    </div>
  );
};

export default UserDashboard;
