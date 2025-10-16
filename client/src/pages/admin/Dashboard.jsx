import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Link,Outlet } from "react-router";
import {
    FaTachometerAlt,
    FaLaptop,
    FaUsers,
    FaBell,
    FaBook,
    FaTasks,
    FaFileAlt,
    FaVideo,
    FaUserGraduate,
    FaQuestionCircle,
    FaBuilding,
    FaCalendarAlt,
    FaTable,
    FaChevronDown,
    FaCircleNotch,
    FaMars 
} from "react-icons/fa";

// ---------------- SIDEBAR ----------------
const Sidebar = ({ isCollapsed, toggleSidebar, activeMenu, setActiveMenu }) => {
    return (
        <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`} style={{height:"100vh",overflowY:"scroll"}}>
            <div className="sidebar-header">
                <button className="toggle-btn" onClick={toggleSidebar}>
                    <i className="fas fa-bars"></i>
                </button>
                {!isCollapsed && <h4>Admin</h4>}
            </div>

            <ul className="nav flex-column">

                {/* Dashboard */}
                <li className={`nav-item ${activeMenu === "Dashboard" ? "active" : ""}`}>
                    <Link to="/admin/" className="nav-link">
                        <FaTachometerAlt />
                        <span className="sidebar-text">Dashboard</span>
                    </Link>
                </li>

                {/* Master Entry */}
                <li className={`nav-item ${activeMenu === "Master Entry" ? "active" : ""}`}>
                    <Link to="#" className="nav-link"
                       onClick={() => setActiveMenu(activeMenu === "Master Entry" ? null : "Master Entry")}>
                        <FaLaptop />
                        <span className="sidebar-text">Master Entry</span>
                        {!isCollapsed && <FaChevronDown className="ms-auto" />}
                    </Link>
                    <ul className={`submenu ${activeMenu === "Master Entry" && !isCollapsed ? "open" : ""}`}>
                        <li><Link to="role" className="nav-link">Role</Link></li>
                        <li><Link to="session" className="nav-link">Session</Link></li>
                        <li><Link to="location" className="nav-link">Location</Link></li>
                        <li><Link to="programme" className="nav-link">Programme</Link></li>
                        <li><Link to="technology" className="nav-link">Technology</Link></li>
                        <li><Link to="batch" className="nav-link">Batch</Link></li>
                        <li><Link to="college" className="nav-link">College</Link></li>
                        <li><Link to="branch" className="nav-link">Branch</Link></li>
                        <li><Link to="subject" className="nav-link">Subject</Link></li>
                        <li><Link to="topic" className="nav-link">Add Topic</Link></li>
                    </ul>
                </li>

                {/* Users */}
                <li className={`nav-item ${activeMenu === "Users" ? "active" : ""}`}>
                    <Link to="#" className="nav-link"
                       onClick={() => setActiveMenu(activeMenu === "Users" ? null : "Users")}>
                        <FaUsers />
                        <span className="sidebar-text">Users</span>
                        {!isCollapsed && <FaChevronDown className="ms-auto" />}
                    </Link>
                    <ul className={`submenu ${activeMenu === "Users" && !isCollapsed ? "open" : ""}`}>
                        <li><Link to="user" className="nav-link">Add User</Link></li>
                        <li><Link to="manage-user" className="nav-link">Manage Users</Link></li>
                    </ul>
                </li>

                {/* Notification */}
                <li className={`nav-item ${activeMenu === "Notification" ? "active" : ""}`}>
                    <Link to="#" className="nav-link"
                       onClick={() => setActiveMenu(activeMenu === "Notification" ? null : "Notification")}>
                        <FaBell />
                        <span className="sidebar-text">Notification</span>
                        {!isCollapsed && <FaChevronDown className="ms-auto" />}
                    </Link>
                    <ul className={`submenu ${activeMenu === "Notification" && !isCollapsed ? "open" : ""}`}>
                        <li><Link to="send-notification" className="nav-link">Send Notification</Link></li>
                      
                    </ul>
                </li>

                {/* Manage Content */}
                <li className={`nav-item ${activeMenu === "Manage Content" ? "active" : ""}`}>
                    <Link to="#" className="nav-link"
                       onClick={() => setActiveMenu(activeMenu === "Manage Content" ? null : "Manage Content")}>
                        <FaBook />
                        <span className="sidebar-text">Manage Content</span>
                        {!isCollapsed && <FaChevronDown className="ms-auto" />}
                    </Link>
                    <ul className={`submenu ${activeMenu === "Manage Content" && !isCollapsed ? "open" : ""}`}>
                        <li><Link to="add-content" className="nav-link">Add Content</Link></li>
                        <li><Link to="view-content" className="nav-link">View Content</Link></li>
                        <li><Link to="manage-content" className="nav-link">Manage Content</Link></li>
                    </ul>
                </li>

                {/* Manage Assignment */}
                {/* <li className={`nav-item ${activeMenu === "Manage Assignment" ? "active" : ""}`}>
                    <Link to="#" className="nav-link"
                       onClick={() => setActiveMenu(activeMenu === "Manage Assignment" ? null : "Manage Assignment")}>
                        <FaTasks />
                        <span className="sidebar-text">Manage Assignment</span>
                        {!isCollapsed && <FaChevronDown className="ms-auto" />}
                    </Link>
                    <ul className={`submenu ${activeMenu === "Manage Assignment" && !isCollapsed ? "open" : ""}`}>
                        <li><Link to="#" className="nav-link">New Assignment</Link></li>
                        <li><Link to="#" className="nav-link">Submitted Assignments</Link></li>
                    </ul>
                </li>

                {/* Manage Mocktest */}
                {/* <li className={`nav-item ${activeMenu === "Manage Mocktest" ? "active" : ""}`}>
                    <Link to="#" className="nav-link"
                       onClick={() => setActiveMenu(activeMenu === "Manage Mocktest" ? null : "Manage Mocktest")}>
                        <FaFileAlt />
                        <span className="sidebar-text">Manage Mocktest</span>
                        {!isCollapsed && <FaChevronDown className="ms-auto" />}
                    </Link>
                    <ul className={`submenu ${activeMenu === "Manage Mocktest" && !isCollapsed ? "open" : ""}`}>
                        <li><Link to="#" className="nav-link">Create Mocktest</Link></li>
                        <li><Link to="#" className="nav-link">View Results</Link></li>
                    </ul>
                </li> */}

                {/* Students Recording */} 
                <li className="nav-item">
                    <Link to="#" className="nav-link">
                        <FaVideo />
                        <span className="sidebar-text">Students Recording's</span>
                    </Link>
                </li>

                {/* View Profile of Students */}
                <li className="nav-item">
                    <Link to="#" className="nav-link">
                        <FaUserGraduate />
                        <span className="sidebar-text">View Profile of Students</span>
                    </Link>
                </li>

                {/* View Interview Questions */}
                {/* <li className={`nav-item ${activeMenu === "View Interview Questions" ? "active" : ""}`}>
                    <Link to="#" className="nav-link"
                       onClick={() => setActiveMenu(activeMenu === "View Interview Questions" ? null : "View Interview Questions")}>
                        <FaQuestionCircle />
                        <span className="sidebar-text">View Interview Questions</span>
                        {!isCollapsed && <FaChevronDown className="ms-auto" />}
                    </Link>
                    <ul className={`submenu ${activeMenu === "View Interview Questions" && !isCollapsed ? "open" : ""}`}>
                        <li><Link to="#" className="nav-link">Add Question</Link></li>
                        <li><Link to="#" className="nav-link">Manage Questions</Link></li>
                    </ul>
                </li> */}

                {/* Company for Placement */}
                {/* <li className={`nav-item ${activeMenu === "Company for Placement" ? "active" : ""}`}>
                    <Link to="#" className="nav-link"
                       onClick={() => setActiveMenu(activeMenu === "Company for Placement" ? null : "Company for Placement")}>
                        <FaBuilding />
                        <span className="sidebar-text">Company for Placement</span>
                        {!isCollapsed && <FaChevronDown className="ms-auto" />}
                    </Link>
                    <ul className={`submenu ${activeMenu === "Company for Placement" && !isCollapsed ? "open" : ""}`}>
                        <li><Link to="#" className="nav-link">Add Company</Link></li>
                        <li><Link to="#" className="nav-link">View Companies</Link></li>
                    </ul>
                </li> */}

                {/* Scheduled Interview */}
                {/* <li className={`nav-item ${activeMenu === "Scheduled Interview" ? "active" : ""}`}>
                    <Link to="#" className="nav-link"
                       onClick={() => setActiveMenu(activeMenu === "Scheduled Interview" ? null : "Scheduled Interview")}>
                        <FaCalendarAlt />
                        <span className="sidebar-text">Scheduled Interview</span>
                        {!isCollapsed && <FaChevronDown className="ms-auto" />}
                    </Link>
                    <ul className={`submenu ${activeMenu === "Scheduled Interview" && !isCollapsed ? "open" : ""}`}>
                        <li><Link to="#" className="nav-link">New Interview</Link></li>
                        <li><Link to="#" className="nav-link">Interview List</Link></li>
                    </ul>
                </li> */}

                {/* View Attendance */}
                {/* <li className={`nav-item ${activeMenu === "View Attendance" ? "active" : ""}`}>
                    <Link to="#" className="nav-link"
                       onClick={() => setActiveMenu(activeMenu === "View Attendance" ? null : "View Attendance")}>
                        <FaTable />
                        <span className="sidebar-text">View Attendance</span>
                        {!isCollapsed && <FaChevronDown className="ms-auto" />}
                    </Link>
                    <ul className={`submenu ${activeMenu === "View Attendance" && !isCollapsed ? "open" : ""}`}>
                        <li><Link to="#" className="nav-link">Daily Attendance</Link></li>
                        <li><Link to="#" className="nav-link">Monthly Attendance</Link></li>
                    </ul>
                </li> */} 
                  <li className="nav-item">
                    <Link to="change-password" className="nav-link">
                       <FaCircleNotch />
                        <span className="sidebar-text">Change Password</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="change-password" className="nav-link" onClick={()=>{
                        localStorage.removeItem('adminEmail')
                        localStorage.removeItem('id')
                        localStorage.removeItem('role')
                        localStorage.removeItem('token')
                        navigate('/signin')
                    }}>
                      
                       <FaMars />
                        <span className="sidebar-text">Logout</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

// ---------------- TOPBAR ----------------
const Topbar = ({ isCollapsed }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className={`topbar ${isCollapsed ? "collapsed" : ""}`}>
            <div className="topbar-left">
                <h5>{getGreeting()}, Admin!</h5>
            </div>
            <div className="topbar-right">
                <div className="notifications">
                    <FaBell />
                    <span className="badge bg-danger">2</span>
                </div>
                <div className="notifications">
                    <FaQuestionCircle />
                    <span className="badge bg-warning">3</span>
                </div>
                <div className="notifications">
                    <FaFileAlt />
                </div>
                <div className="user-info">
                    <div className="dropdown">
                        <img src="https://avatar.iran.liara.run/public/34"
                             style={{ height: "50px" }}
                             alt="User"
                             className="user-img"
                             type="button"
                             data-bs-toggle="dropdown"
                             aria-expanded="false"/>
                        <span>
                             <i className="fas fa-circle text-success"></i>
                        </span>
                        <ul className="dropdown-menu">
                            <li><Link className="dropdown-item" to="#">Profile</Link></li>
                            <li><Link className="dropdown-item" onClick={()=>{
                                localStorage.removeItem('adminEmail')
                                localStorage.removeItem('role')
                                localStorage.removeItem('id')
                                localStorage.removeItem('token')
                                navigate('/signin')
                            }}>Logout</Link></li>
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
                        <Outlet/>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ---------------- DASHBOARD ----------------
const Dashboard = () => {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);

    //  Token & Role Validation
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

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
                navigate("/singin");
            }
        } catch (err) {
            console.error("Invalid token:", err);
            localStorage.removeItem("token");
            navigate("/singin");
        }

        if (role !== "Admin") {
            navigate("/signin");
        }
    }, [navigate]);

    // ✅ Axios interceptor
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    alert("Session expired, please login again.");
                    localStorage.removeItem("token");
                    navigate("/login");
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [navigate]);

    // ✅ Auto-collapse on mobile
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

export default Dashboard;
