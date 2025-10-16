import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const API = "/api/users";
const CollegeAPI = "/api/college";
const BranchAPI = "/api/branch";
const SessionAPI = "/api/session";
const LocationAPI = "/api/location";
const ProgramAPI = "/api/program";
const BatchAPI = "/api/batch";

export default function ManageUser() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [branches, setBranches] = useState([]);
  const [locations, setLocations] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    college: "",
    branch: "",
    program: "",
    batch: "",
    mobile: "",
    email: "",
    gender: "Male",
    dob: "",
    status: "Active",
    session: "",
    role: "Student",
  });

  // Fetch Users
  const fetchUsers = async () => {
    try {
      let query = [];
      if (search) query.push(`search=${search}`);
      if (filterRole) query.push(`role=${filterRole}`);
      if (filterStatus) query.push(`status=${filterStatus}`);
      if (filterBranch) query.push(`branch=${filterBranch}`);
      if (filterLocation) query.push(`location=${filterLocation}`);

      const res = await axios.get(`${API}?${query.join("&")}`);
      setUsers(res.data);
    } catch (err) {
      Swal.fire("Error!", "Failed to fetch users.", "error");
    }
  };

  // Fetch Filters and Form Data
  const fetchColleges = async () => { setColleges((await axios.get(CollegeAPI)).data); };
  const fetchBranches = async () => { setBranches((await axios.get(BranchAPI)).data); };
  const fetchSessions = async () => { setSessions((await axios.get(SessionAPI)).data); };
  const fetchLocations = async () => { setLocations((await axios.get(LocationAPI)).data); };
  const fetchPrograms = async () => { setPrograms((await axios.get(ProgramAPI)).data); };
  const fetchBatches = async () => { setBatches((await axios.get(BatchAPI)).data); };

  useEffect(() => {
    fetchUsers();
    fetchColleges();
    fetchBranches();
    fetchSessions();
    fetchLocations();
    fetchPrograms();
    fetchBatches();
  }, [search, filterRole, filterStatus, filterBranch, filterLocation]);

  // Toggle Form
  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setEditingUserId(null);
    setFormData({
      name: "",
      location: "",
      college: "",
      branch: "",
      program: "",
      batch: "",
      mobile: "",
      email: "",
      gender: "Male",
      dob: "",
      status: "Active",
      session: "",
      role: "Student",
    });
  };

  // Handle Form Change
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUserId) {
        await axios.put(`${API}/${editingUserId}`, formData);
        Swal.fire("Updated!", "User updated successfully.", "success");
      } else {
        await axios.post(API, { ...formData, password: "1234" });
        Swal.fire("Added!", "User added successfully.", "success");
      }
      fetchUsers();
      toggleForm();
    } catch (err) {
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  // Edit User
  const handleEdit = (user) => {
    setShowForm(true);
    setEditingUserId(user._id);
    setFormData({
      name: user.name,
      location: user.location?._id || "",
      college: user.college?._id || "",
      branch: user.branch?._id || "",
      program: user.program?._id || "",
      batch: user.batch?._id || "",
      mobile: user.mobile,
      email: user.email,
      gender: user.gender,
      dob: user.dob ? user.dob.split("T")[0] : "",
      status: user.status,
      session: user.session?._id || "",
      role: user.role || "Student",
    });
  };

  // Delete User
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API}/${id}`);
          fetchUsers();
          Swal.fire("Deleted!", "User deleted successfully.", "success");
        } catch (err) {
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  // Block/Unblock User
  const handleBlock = async (id, currentStatus) => {
    Swal.fire({
      title: `Are you sure to ${currentStatus === "Active" ? "Block" : "Unblock"} this user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(`${API}/${id}/status`, {
            status: currentStatus === "Active" ? "Inactive" : "Active",
          });
          fetchUsers();
          Swal.fire(
            "Updated!",
            `User ${currentStatus === "Active" ? "Blocked" : "Unblocked"} successfully.`,
            "success"
          );
        } catch (err) {
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  // CSV Upload
  const handleFileChange = (e) => setCsvFile(e.target.files[0]);
  const handleUploadCSV = async () => {
    if (!csvFile) return Swal.fire("Error!", "Please select a CSV file.", "error");
    const data = new FormData();
    data.append("file", csvFile);
    try {
      await axios.post(`${API}/bulk`, data, { headers: { "Content-Type": "multipart/form-data" } });
      Swal.fire("Uploaded!", "Users uploaded successfully.", "success");
      fetchUsers();
      setCsvFile(null);
    } catch {
      Swal.fire("Error!", "CSV upload failed.", "error");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Users</h2>

      {/* Toggle Buttons & CSV Upload */}
      <div className="mb-3 d-flex flex-wrap gap-2">
        
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="form-control-sm"
          style={{ maxWidth: "200px" }}
        />
        <button onClick={handleUploadCSV} className="btn btn-success">
          Upload CSV
        </button>
      </div>

      {/* Filters */}
      <div className="d-flex mb-3 flex-wrap gap-2">
        <input
          type="text"
          placeholder="Search..."
          className="form-control mb-2"
          style={{ maxWidth: "200px" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-select mb-2"
          style={{ maxWidth: "150px" }}
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="Student">Student</option>
          <option value="Admin">Admin</option>
          <option value="Course Coordinator">Course Coordinator</option>
          <option value="Consultant">Consultant</option>
          <option value="HR">HR</option>
        </select>
        <select
          className="form-select mb-2"
          style={{ maxWidth: "150px" }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select
          className="form-select mb-2"
          style={{ maxWidth: "150px" }}
          value={filterBranch}
          onChange={(e) => setFilterBranch(e.target.value)}
        >
          <option value="">All Branches</option>
          {branches.map((b) => (
            <option key={b._id} value={b._id}>
              {b.branch}
            </option>
          ))}
        </select>
        <select
          className="form-select mb-2"
          style={{ maxWidth: "150px" }}
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc._id} value={loc._id}>
              {loc.location}
            </option>
          ))}
        </select>
        <button onClick={toggleForm} className="btn btn-dark py-1">
          {showForm ? "Close Form" : "Add User"}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card p-4 mb-4 shadow-sm text-start">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Name"
            className="form-control mb-2"
          />
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="form-select mb-2"
          >
            <option value="">Select Location</option>
            {locations.map((c) => (
              <option key={c._id} value={c._id}>{c.location}</option>
            ))}
          </select>
          <select
            name="college"
            value={formData.college}
            onChange={handleChange}
            required
            className="form-select mb-2"
          >
            <option value="">Select College</option>
            {colleges.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            required
            className="form-select mb-2"
          >
            <option value="">Select Branch</option>
            {branches.map((b) => (
              <option key={b._id} value={b._id}>{b.branch}</option>
            ))}
          </select>
          <select
            name="program"
            value={formData.program}
            onChange={handleChange}
            required
            className="form-select mb-2"
          >
            <option value="">Select Program</option>
            {programs.map((p) => (
              <option key={p._id} value={p._id}>{p.program}</option>
            ))}
          </select>
          <select
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            required
            className="form-select mb-2"
          >
            <option value="">Select Batch</option>
            {batches.map((b) => (
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </select>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            placeholder="Mobile"
            className="form-control mb-2"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Email"
            className="form-control mb-2"
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="form-select mb-2"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="form-control mb-2"
          />
          <select
            name="session"
            value={formData.session}
            onChange={handleChange}
            required
            className="form-select mb-2"
          >
            <option value="">Select Session</option>
            {sessions.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-select mb-2"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="form-select mb-2"
          >
            <option value="Student">Student</option>
            <option value="Admin">Admin</option>
            <option value="Course Coordinator">Course Coordinator</option>
            <option value="Consultant">Consultant</option>
            <option value="HR">HR</option>
          </select>
          <button type="submit" className="btn btn-dark">
            {editingUserId ? "Update" : "Save"}
          </button>
        </form>
      )}

      {/* User Table */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>S.N</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Role</th>
            <th>Status</th>
            <th>Branch</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u, i) => (
              <tr key={u._id}>
                <td>{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.mobile}</td>
                <td>{u.role}</td>
                <td>
                  <span
                    className={`badge ${u.status === "Active" ? "bg-success" : "bg-secondary"}`}
                  >
                    {u.status}
                  </span>
                </td>
                <td>{u.branch?.branch || "N/A"}</td>
                <td>{u.location?.location || "N/A"}</td>
                <td className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => setSelectedUser(u)}
                  >
                    <i className="fa fa-eye"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleEdit(u)}
                  >
                    <i className="fa fa-pen"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => handleBlock(u._id, u.status)}
                  >
                    {u.status === "Active" ? (
                      <i className="fa fa-ban"></i>
                    ) : (
                      <i className="fa fa-unlock"></i>
                    )}
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(u._id)}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Profile Modal */}
      {selectedUser && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow-lg border-0 rounded-3">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">User Profile</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedUser(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4 text-center">
                    <img
                      src={selectedUser.image || "https://via.placeholder.com/150"}
                      alt="Profile"
                      className="img-fluid rounded-circle mb-3 shadow"
                    />
                    <h5>{selectedUser.name}</h5>
                    <span
                      className={`badge ${selectedUser.status === "Active" ? "bg-success" : "bg-secondary"}`}
                    >
                      {selectedUser.status}
                    </span>
                  </div>
                  <div className="col-md-8">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <th>Email:</th>
                          <td>{selectedUser.email}</td>
                        </tr>
                        <tr>
                          <th>Mobile:</th>
                          <td>{selectedUser.mobile}</td>
                        </tr>
                        <tr>
                          <th>Gender:</th>
                          <td>{selectedUser.gender}</td>
                        </tr>
                        <tr>
                          <th>DOB:</th>
                          <td>{selectedUser.dob ? new Date(selectedUser.dob).toLocaleDateString() : "N/A"}</td>
                        </tr>
                        <tr>
                          <th>Role:</th>
                          <td>{selectedUser.role}</td>
                        </tr>
                        <tr>
                          <th>College:</th>
                          <td>{selectedUser.college?.name || "N/A"}</td>
                        </tr>
                        <tr>
                          <th>Branch:</th>
                          <td>{selectedUser.branch?.branch || "N/A"}</td>
                        </tr>
                        <tr>
                          <th>Program:</th>
                          <td>{selectedUser.program?.program || "N/A"}</td>
                        </tr>
                        <tr>
                          <th>Batch:</th>
                          <td>{selectedUser.batch?.name || "N/A"}</td>
                        </tr>
                        <tr>
                          <th>Session:</th>
                          <td>{selectedUser.session?.name || "N/A"}</td>
                        </tr>
                        <tr>
                          <th>Location:</th>
                          <td>{selectedUser.location?.location || "N/A"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}