import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const API = "/api/subject";

const Subject = () => {
  const [showForm, setShowForm] = useState(false);
  const [subjects, setsubjects] = useState([]);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    status: "active",
  });
  const [editingsubjectId, setEditingsubjectId] = useState(null);

  // Fetch subjects
  const handleFetch = async () => {
    try {
      const res = await axios.get(API);
      setsubjects(res.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  // Toggle form
  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setEditingsubjectId(null);
    setFormData({ name: "", description: "", status: "active" });
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingsubjectId) {
        await axios.put(`${API}/${editingsubjectId}`, formData);
        Swal.fire("Updated!", "subject has been updated successfully.", "success");
      } else {
        await axios.post(API, formData);
        Swal.fire("Added!", "New subject has been added successfully.", "success");
      }
      handleFetch();
      toggleForm();
    } catch (error) {
      Swal.fire("Error!", "Something went wrong.", "error");
      console.error(error);
    }
  };

  // Edit subject
  const handleEdit = (subject) => {
    setShowForm(true);
    setEditingsubjectId(subject._id);
    setFormData({
      subject: subject.subject,
      description: subject.description,
      status: subject.status,
    });
  };

  // Delete subject
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This subject will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(`${API}/${id}`);
          setsubjects((prev) => prev.filter((subject) => subject._id !== id));
          Swal.fire("Deleted!", "subject has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error!", "Something went wrong.", "error");
          console.error(error);
        }
      }
    });
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Subject Management</h2>

      {/* Add/Edit Button */}
      <button
        onClick={toggleForm}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg btn btn-dark"
      >
        {showForm ? "❌ Close Form" : "➕ Add Subject"}
      </button>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 border rounded-lg bg-gray-100"
        >
          <div className="mb-2">
            <label className="block font-semibold">Subject Name</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="Enter subject Here"
              className="border p-2 rounded w-full form-control"
            />
          </div>

          <div className="mb-2">
            <label className="block font-semibold">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter description"
              className="border p-2 rounded w-full form-control"
            ></textarea>
          </div>

          <div className="mb-2">
            <label className="block font-semibold">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border p-2 rounded w-full form-control"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg btn btn-dark"
          >
            {editingsubjectId ? "Update Subject" : "Save Subject"}
          </button>
        </form>
      )}

      {/* Table */}
      <table className="w-full border table table-hover">
        <thead>
          <tr className="bg-gray-200 table-dark">
            <th className="border p-2">S.N</th>
            <th className="border p-2">Subject Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, index) => (
            <tr key={subject._id}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{subject.subject}</td>
              <td className="border p-2">{subject.description}</td>
              <td className="border p-2">{subject.status}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(subject)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded mr-2 btn btn-success"
                >
                  <i className="fa fa-pen"></i>
                </button>
                <button
                  onClick={() => handleDelete(subject._id)}
                  className="px-2 py-1 bg-red-600 text-white rounded btn btn-danger"
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

export default Subject;
