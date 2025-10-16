import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const FRONTEND_API = "http://localhost:3000/api";

export default function ManageContent() {
  const [contents, setContents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [filterSubject, setFilterSubject] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  const loadData = async () => {
    try {
      const [contentRes, batchRes, assignRes] = await Promise.all([
        axios.get(`${FRONTEND_API}/contents/all`),
        axios.get(`${FRONTEND_API}/batch`),
        axios.get(`${FRONTEND_API}/assign-content`),
      ]);

      setContents(
        Array.isArray(contentRes.data)
          ? contentRes.data
          : contentRes.data.contents || []
      );
      setBatches(
        Array.isArray(batchRes.data)
          ? batchRes.data
          : batchRes.data.batches || []
      );
      setAssignments(assignRes.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      Swal.fire("Error", "Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Assign or Update Content to Batch
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!filterBatch || !filterSubject) {
      Swal.fire("Error", "Please select both batch and subject", "warning");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${FRONTEND_API}/assign-content/${editingId}`, {
          batchId: filterBatch,
          subjectId: filterSubject,
        });
        Swal.fire("Updated!", "Assignment updated successfully.", "success");
      } else {
        await axios.post(`${FRONTEND_API}/assign-content`, {
          batchId: filterBatch,
          subjectId: filterSubject,
        });
        Swal.fire("Success", "Content assigned successfully!", "success");
      }

      await loadData();
      resetForm();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to assign content";
      Swal.fire("Error", msg, "error");
    }
  };

  const resetForm = () => {
    setFilterBatch("");
    setFilterSubject("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setShowForm(true);
    setEditingId(item._id);
    setFilterBatch(item.batchId?._id || "");
    setFilterSubject(item.subjectId?._id || "");
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This assignment will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${FRONTEND_API}/assign-content/${id}`);
          setAssignments((prev) => prev.filter((a) => a._id !== id));
          Swal.fire("Deleted!", "Assignment deleted.", "success");
        } catch (err) {
          Swal.fire("Error", "Something went wrong.", "error");
        }
      }
    });
  };

  const handleBlockToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      await axios.put(`${FRONTEND_API}/assign-content/${id}`, {
        status: newStatus,
      });
      Swal.fire("Status Changed!", `Assignment is now ${newStatus}`, "success");
      await loadData();
    } catch (err) {
      Swal.fire("Error", "Failed to change status", "error");
    }
  };

  // Unique Subjects (only those having uploaded content)
  const subjectMap = {};
  const uniqueSubjects = contents
    .filter((c) => c.subjectId)
    .filter((c) => {
      if (!subjectMap[c.subjectId._id]) {
        subjectMap[c.subjectId._id] = true;
        return true;
      }
      return false;
    })
    .map((c) => c.subjectId);

  return (
    <div className="p-5 container-fluid">
      <h2 className="text-2xl fw-bold mb-4">Manage Content Assignment</h2>

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-4 py-2 bg-dark text-white rounded btn btn-dark"
      >
        {showForm ? "❌ Close Form" : "➕ Assign New Content"}
      </button>

      {/* Assignment Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="card shadow-sm p-4 mb-4 bg-light"
        >
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Select Subject</label>
              <select
                className="form-select"
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                required
              >
                <option value="">-- Select Subject --</option>
                {uniqueSubjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.subject || "Unknown Subject"}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Select Batch</label>
              <select
                className="form-select"
                value={filterBatch}
                onChange={(e) => setFilterBatch(e.target.value)}
                required
              >
                <option value="">-- Select Batch --</option>
                {batches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name || "Unknown Batch"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="mt-2 px-4 py-2 btn btn-success rounded">
            {editingId ? "Update Assignment" : "Save Assignment"}
          </button>
        </form>
      )}

      {/* Table Section */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Batch</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length > 0 ? (
              assignments.map((a, index) => (
                <tr key={a._id}>
                  <td>{index + 1}</td>
                  <td>{a.batchId?.name || "N/A"}</td>
                  <td>{a.subjectId?.subject || "N/A"}</td>
                  <td>
                    <span
                      className={`badge ${
                        a.status === "Active"
                          ? "bg-success"
                          : a.status === "Inactive"
                          ? "bg-secondary"
                          : "bg-danger"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleEdit(a)}
                    >
                      <i className="fa fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => handleDelete(a._id)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleBlockToggle(a._id, a.status)}
                    >
                      {a.status === "Active" ? "Block" : "Unblock"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No Assignments Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
