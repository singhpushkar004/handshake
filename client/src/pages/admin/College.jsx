import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const API = "/api/college";

const College = () => {
  const [showForm, setShowForm] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
    contactNumber: "",
    email: "",
    website: "",
    status: "Active",
  });
  const [editingCollegeId, setEditingCollegeId] = useState(null);

  // Fetch colleges
  const fetchColleges = async () => {
    try {
      const res = await axios.get(API);
      setColleges(res.data);
    } catch (err) {
      console.error("Error fetching colleges:", err);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  // Toggle manual form
  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setEditingCollegeId(null);
    setFormData({
      name: "",
      code: "",
      address: "",
      contactNumber: "",
      email: "",
      website: "",
      status: "Active",
    });
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCollegeId) {
        await axios.put(`${API}/${editingCollegeId}`, formData);
        Swal.fire("Updated!", "College has been updated successfully.", "success");
      } else {
        await axios.post(API, formData);
        Swal.fire("Added!", "New college has been added successfully.", "success");
      }
      fetchColleges();
      toggleForm();
    } catch (err) {
      Swal.fire("Error!", "Something went wrong.", "error");
      console.error(err);
    }
  };

  // Edit college
  const handleEdit = (college) => {
    setShowForm(true);
    setEditingCollegeId(college._id);
    setFormData({
      name: college.name,
      code: college.code,
      address: college.address,
      contactNumber: college.contactNumber,
      email: college.email,
      website: college.website,
      status: college.status,
    });
  };

  // Delete college
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This college will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(`${API}/${id}`);
          setColleges((prev) => prev.filter((college) => college._id !== id));
          Swal.fire("Deleted!", "College has been deleted.", "success");
        } catch (err) {
          Swal.fire("Error!", "Something went wrong.", "error");
          console.error(err);
        }
      }
    });
  };

  // Handle CSV file change
  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  // Upload CSV
  const handleUploadCSV = async () => {
    if (!csvFile) {
      Swal.fire("Error!", "Please select a CSV file first.", "error");
      return;
    }
    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      await axios.post(`${API}/bulk`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire("Uploaded!", "Colleges uploaded successfully.", "success");
      fetchColleges();
      setCsvFile(null);
    } catch (err) {
      Swal.fire("Error!", "Failed to upload file.", "error");
      console.error(err);
    }
  };

  return (
    <div className="container mt-4 ">
      <h2 className="mb-4">College Management</h2>

      
<div className="row">
  <div className="col-sm-8">
    {/* Add/Edit Button */}
      <button onClick={toggleForm} className="btn btn-dark mb-3">
        {showForm ? "❌ Close Form" : "➕ Add College Manually"}
      </button>

      {/* Manual Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card p-4 mb-4 shadow-sm text-start">
          <div className="mb-3">
            <label className="form-label">College Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter College Name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">College Code</label>
            <input
              type="text"
              name="code"
              className="form-control"
              value={formData.code}
              onChange={handleChange}
              required
              placeholder="Enter College Code"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              className="form-control"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter Address"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              className="form-control"
              value={formData.contactNumber}
              onChange={handleChange}
              required
              placeholder="Enter Contact Number"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter College Email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Website</label>
            <input
              type="text"
              name="website"
              className="form-control"
              value={formData.website}
              onChange={handleChange}
              placeholder="Enter Website"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Status</label>
            <select
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button type="submit" className="btn btn-dark w-25">
            {editingCollegeId ? "Update College" : "Save College"}
          </button>
        </form>
      )}
  </div>
  <div className="col-sm-4">
     {/* CSV Upload Section */}
      <div className="card p-4 mb-4 shadow-sm text-start">
      <div className="row">
       
        <div className="col-sm-6">
          <input type="file" accept=".csv" onChange={handleFileChange} />
        </div>
      </div>
       <div className="row">
         <div className="col-sm-6">
          <button onClick={handleUploadCSV} className="btn btn-success mt-2">
         <i className="fa-solid fa-upload"></i> Upload CSV
        </button>
        </div>
        <div className="col-sm-6">
         <a href="/csvFormat/collegeFormat.csv" download="collegeFormat.csv" className="btn btn-secondary">
                <i className="fa-solid fa-download"></i> Format
              </a>
        </div>
       </div>
      </div>
  </div>
</div>
     

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>S.N</th>
              <th>Name</th>
              <th>Code</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Status</th>
              <th style={{ width: "120px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {colleges.length > 0 ? (
              colleges.map((college, index) => (
                <tr key={college._id}>
                  <td>{index + 1}</td>
                  <td>{college.name}</td>
                  <td>{college.code}</td>
                  <td>{college.email}</td>
                  <td>{college.contactNumber}</td>
                  <td>
                    <span
                      className={`badge ${
                        college.status === "Active" ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {college.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleEdit(college)}
                      className="btn btn-sm btn-warning me-2"
                    >
                      <i className="fa fa-pen"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(college._id)}
                      className="btn btn-sm btn-danger"
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No colleges found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default College;
