import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API = "/api/batch";
const PROGRAM_API = "/api/program";
const TECH_API = "/api/technology";
const SESSION_API = "/api/session";
  
const Batch = () => {
  const [showForm, setShowForm] = useState(false);
  const [batches, setBatches] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    programId: "",
    technologyId: "",
    sessionId: "",
    description: "",
    status: "active",
  });
  const [editingBatchId, setEditingBatchId] = useState(null);

  // Fetch data
  const handleFetch = async () => {
    try {
      const [batchRes, progRes, techRes, sessRes] = await Promise.all([
        axios.get(API),
        axios.get(PROGRAM_API),
        axios.get(TECH_API),
        axios.get(SESSION_API),
      ]);
      setBatches(batchRes.data);
      setPrograms(progRes.data);
      setTechnologies(techRes.data);
      setSessions(sessRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  // Toggle form
  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setEditingBatchId(null);
    setFormData({
      name: "",
      programId: "",
      technologyId: "",
      sessionId: "",
      description: "",
      status: "active",
    });
  };

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBatchId) {
        await axios.put(`${API}/${editingBatchId}`, formData);
        Swal.fire("Updated!", "Batch updated successfully.", "success");
      } else {
        await axios.post(API, formData);
        Swal.fire("Added!", "Batch added successfully.", "success");
      }
      handleFetch();
      toggleForm();
    } catch (error) {
      Swal.fire("Error!", "Something went wrong.", "error");
      console.error(error);
    }
  };

  // Edit batch
  const handleEdit = (batch) => {
    setShowForm(true);
    setEditingBatchId(batch._id);
    setFormData({
      name: batch.name,
      programId: batch.programId?._id,
      technologyId: batch.technologyId?._id,
      sessionId: batch.sessionId?._id,
      description: batch.description,
      status: batch.status,
    });
  };

  // Delete batch
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This batch will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(`${API}/${id}`);
          setBatches((prev) => prev.filter((b) => b._id !== id));
          Swal.fire("Deleted!", "Batch deleted.", "success");
        } catch (error) {
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between  mb-4">
        <h2 className="fw-bold "> Batch Management</h2>
        <button
          onClick={toggleForm}
          className={`btn float-start ${showForm ? "btn-dark" : "btn-dark"}`}
        >
          {showForm ? "❌ Close Form" : "➕ Add Batch"}
        </button>
      </div>

      {showForm && (
        <div className="card shadow mb-4">
          <div className="card-body text-start">
           
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Batch Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter batch name"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Program</label>
                <select
                  name="programId"
                  value={formData.programId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Program</option>
                  {programs.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.program}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Technology</label>
                <select
                  name="technologyId"
                  value={formData.technologyId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Technology</option>
                  {technologies.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Session</label>
                <select
                  name="sessionId"
                  value={formData.sessionId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Session</option>
                  {sessions.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter description"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="col-12 text-end">
                <button type="submit" className="btn btn-success">
                  {editingBatchId ? " Update Batch" : " Save Batch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card shadow">
        <div className="card-body">
          
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>S.N</th>
                  <th>Batch Name</th>
                  <th>Program</th>
                  <th>Technology</th>
                  <th>Session</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((b, index) => (
                  <tr key={b._id}>
                    <td>{index + 1}</td>
                    <td>{b.name}</td>
                    <td>{b.programId?.program}</td>
                    <td>{b.technologyId?.name}</td>
                    <td>{b.sessionId?.name}</td>
                    <td>{b.description}</td>
                    <td>
                      <span
                        className={`badge ${
                          b.status === "active"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => handleEdit(b)}
                        className="btn btn-sm btn-warning me-2"
                      >
                        <i className="fa fa-pen"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="btn btn-sm btn-danger"
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {batches.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      No batches found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Batch;
