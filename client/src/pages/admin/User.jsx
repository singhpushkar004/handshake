import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const API = "/api/users";
const CollegeAPI = "/api/college";
const BranchAPI = "/api/branch";
const SessionAPI = "/api/session";
const LocationAPI = "/api/location";
const ProgramAPI = "/api/program";
const BatchAPI = "/api/batch";

const User = () => {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [locations, setLocations] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [batches, setBatches] = useState([]);
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
  });
  const [editingUserId, setEditingUserId] = useState(null);

  // Fetch API data
  const fetchUsers = async () => { setUsers((await axios.get(API)).data); };
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
  }, []);

  // Toggle form
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
    });
  };

  // Handle change
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUserId) {
        const res = await axios.put(`${API}/${editingUserId}`, formData);
        Swal.fire("Updated!", "User updated successfully.", "success");
        console.log(res)
      } else {
        const res = await axios.post(API, { ...formData, password: "1234" });
        Swal.fire("Added!", "User added successfully.", "success");
        console.log(res)
      }
      fetchUsers();
      toggleForm();
    } catch (err) {
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  // Edit
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
    });
  };

  // Delete
  const handleDelete = (id) => {
    Swal.fire({ title: "Are you sure?", text: "This user will be deleted!", icon: "warning", showCancelButton: true })
      .then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(`${API}/${id}`);
          fetchUsers();
          Swal.fire("Deleted!", "User has been deleted.", "success");
        }
      });
  };

  // CSV Upload
  const handleFileChange = (e) => setCsvFile(e.target.files[0]);
  const handleUploadCSV = async () => {
    if (!csvFile) return Swal.fire("Error!", "Please select a CSV file.", "error");
    const data = new FormData(); data.append("file", csvFile);
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
      <h2>User Management</h2>

      {/* Toggle Buttons */}
      <div className="mb-3">
        <button onClick={toggleForm} className="btn btn-dark me-2">
          {showForm ? "Close Form" : "Add User"}
        </button>
        <input type="file" accept=".csv" onChange={handleFileChange} className="form-control-sm me-2"/>
        <button onClick={handleUploadCSV} className="btn btn-success">Upload CSV</button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card p-4 mb-4 shadow-sm text-start">
          <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Name" className="form-control mb-2"/>
          
          <select name="location" value={formData.location} onChange={handleChange} required className="form-select mb-2">
            <option value="">Select Location</option>
            {locations.map((c) => <option key={c._id} value={c._id}>{c.location}</option>)}
          </select>

          <select name="college" value={formData.college} onChange={handleChange} required className="form-select mb-2">
            <option value="">Select College</option>
            {colleges.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>

          <select name="branch" value={formData.branch} onChange={handleChange} required className="form-select mb-2">
            <option value="">Select Branch</option>
            {branches.map((b) => <option key={b._id} value={b._id}>{b.branch}</option>)}
          </select>

          <select name="program" value={formData.program} onChange={handleChange} required className="form-select mb-2">
            <option value="">Select Program</option>
            {programs.map((p) => <option key={p._id} value={p._id}>{p.program}</option>)}
          </select>

          <select name="batch" value={formData.batch} onChange={handleChange} required className="form-select mb-2">
            <option value="">Select Batch</option>
            {batches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>

          <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} required placeholder="Mobile" className="form-control mb-2"/>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email" className="form-control mb-2"/>

          <select name="gender" value={formData.gender} onChange={handleChange} required className="form-select mb-2">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="form-control mb-2"/>

          <select name="session" value={formData.session} onChange={handleChange} required className="form-select mb-2">
            <option value="">Select Session</option>
            {sessions.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>

          <select name="status" value={formData.status} onChange={handleChange} className="form-select mb-2">
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <button type="submit" className="btn btn-dark">{editingUserId ? "Update" : "Save"}</button>
        </form>
      )}

      {/* Table */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>S.N</th>
            <th>Name</th>
            <th>College</th>
            <th>Branch</th>
            <th>Program</th>
            <th>Batch</th>
            <th>Session</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Gender</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? users.map((user, i) => (
            <tr key={user._id}>
              <td>{i+1}</td>
              <td>{user.name}</td>
              <td>{user.college?.name}</td>
              <td>{user.branch?.branch}</td>
              <td>{user.program?.program}</td>
              <td>{user.batch?.name}</td>
              <td>{user.session?.name}</td>
              <td>{user.email}</td>
              <td>{user.mobile}</td>
              <td>{user.gender}</td>
              <td><span className={`badge ${user.status==="Active"?"bg-success":"bg-secondary"}`}>{user.status}</span></td>
              <td className="d-flex">
                <button onClick={() => handleEdit(user)} className="btn btn-sm btn-success me-2"><i className="fa fa-pen"></i></button>
                <button onClick={() => handleDelete(user._id)} className="btn btn-sm btn-danger"><i className="fa fa-trash"></i></button>
              </td>
            </tr>
          )) : <tr><td colSpan="12" className="text-center">No users found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default User;
