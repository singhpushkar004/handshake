import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const API = "/api/session"; //

const Session = () => {
  const [showForm, setShowForm] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description:"",
    startDate: "",
    endDate: "",
    isCurrent: false,
    status: "Active",
  });
  const [editingSessionId, setEditingSessionId] = useState(null);

  // Fetch sessions
  const handleFetch = async () => {
    try {
      const res = await axios.get(API);
      setSessions(res.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  // Toggle form
  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setEditingSessionId(null);
    setFormData({
      name: "",
      description:"",
      startDate: "",
      endDate: "",
      isCurrent: false,
      status: "Active",
    });
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSessionId) {
        await axios.put(`${API}/${editingSessionId}`, formData);
        Swal.fire("Updated!", "Session has been updated successfully.", "success");
      } else {
        await axios.post(API, formData);
        Swal.fire("Added!", "New session has been added successfully.", "success");
      }
      handleFetch();
      toggleForm();
    } catch (error) {
      Swal.fire("Error!", "Something went wrong.", "error");
      console.error(error);
    }
  };

  // Edit session
  const handleEdit = (session) => {
    setShowForm(true);
    setEditingSessionId(session._id);
    setFormData({
      name: session.name,
      description:session.description,
      startDate: session.startDate ? session.startDate.split("T")[0] : "",
      endDate: session.endDate ? session.endDate.split("T")[0] : "",
      isCurrent: session.isCurrent,
      status: session.status,
    });
  };

  // Delete session
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This session will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(`${API}/${id}`);
          setSessions((prev) => prev.filter((session) => session._id !== id));
          Swal.fire("Deleted!", "Session has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error!", "Something went wrong.", "error");
          console.error(error);
        }
      }
    });
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Session Management</h2>

      {/* Add/Edit Button */}
      <button
        onClick={toggleForm}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg btn btn-dark"
      >
        {showForm ? "❌ Close Form" : "➕ Add Session"}
      </button>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 border rounded-lg bg-gray-100"
        >
          <div className="mb-2">
            <label className="block font-semibold">Session Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. 2024-2025"
              className="border p-2 rounded w-full form-control"
            />
          </div>
          <div className="mb-2">
            <label className="block font-semibold">Description</label>
            <textarea
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter Description"
              className="border p-2 rounded w-full form-control"
            ></textarea>
          </div>

          <div className="mb-2">
            <label className="block font-semibold">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full form-control"
            />
          </div>

          <div className="mb-2">
            <label className="block font-semibold">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full form-control"
            />
          </div>

          <div className="mb-2 flex items-center">
            <input
              type="checkbox"
              name="isCurrent"
              checked={formData.isCurrent}
              onChange={handleChange}
              className="mr-2"
              id="s"
            />
            <label className="font-semibold" htmlFor="s">Mark as Current Session</label>
          </div>

          <div className="mb-2">
            <label className="block font-semibold">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border p-2 rounded w-full form-control"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg btn btn-dark"
          >
            {editingSessionId ? "Update Session" : "Save Session"}
          </button>
        </form>
      )}

      {/* Table */}
      <table className="w-full border table table-hover">
        <thead>
          <tr className="bg-gray-200 table-dark">
            <th className="border p-2">S.N</th>
            <th className="border p-2">Session Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Start Date</th>
            <th className="border p-2">End Date</th>
            <th className="border p-2">Current?</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session, index) => (
            <tr key={session._id}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{session.name}</td>
              <td className="border p-2">{session.description}</td>
              <td className="border p-2">
                {new Date(session.startDate).toLocaleDateString()}
              </td>
              <td className="border p-2">
                {new Date(session.endDate).toLocaleDateString()}
              </td>
              <td className="border p-2">
                {session.isCurrent ? " Yes" : "❌ No"}
              </td>
              <td className="border p-2">{session.status}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(session)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded mr-2 btn btn-success"
                >
                  <i className="fa fa-pen"></i>
                </button>
                <button
                  onClick={() => handleDelete(session._id)}
                  className="px-2 mx-2 py-1 bg-red-600 text-white rounded btn btn-danger"
                >
                  <i className="fa fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Session;
