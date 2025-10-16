import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const API = "/api/technology";

const Technology = () => {
  const [showForm, setShowForm] = useState(false);
  const [technologies, setTechnologies] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
  });
  const [editingTechId, setEditingTechId] = useState(null);

  // ✅ Fetch technologies
  const handleFetch = async () => {
    try {
      const res = await axios.get(API);
      setTechnologies(res.data);
    } catch (error) {
      console.error("Error fetching technologies:", error);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  // ✅ Toggle form
  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setEditingTechId(null);
    setFormData({ name: "", description: "", status: "active" });
  };

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTechId) {
        await axios.put(`${API}/${editingTechId}`, formData);
        Swal.fire("Updated!", "Technology updated successfully.", "success");
      } else {
        await axios.post(API, formData);
        Swal.fire("Added!", "New technology added successfully.", "success");
      }
      handleFetch();
      toggleForm();
    } catch (error) {
      Swal.fire("Error!", "Something went wrong.", "error");
      console.error(error);
    }
  };

  // ✅ Edit technology
  const handleEdit = (tech) => {
    setShowForm(true);
    setEditingTechId(tech._id);
    setFormData({
      name: tech.name,
      description: tech.description,
      status: tech.status,
    });
  };

  // ✅ Delete technology (soft delete)
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This technology will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(`${API}/${id}`);
          setTechnologies((prev) => prev.filter((tech) => tech._id !== id));
          Swal.fire("Deleted!", "Technology deleted.", "success");
        } catch (error) {
          Swal.fire("Error!", "Something went wrong.", "error");
          console.error(error);
        }
      }
    });
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Technology Management</h2>

      {/* Add/Edit Button */}
      <button
        onClick={toggleForm}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg btn btn-dark"
      >
        {showForm ? "❌ Close Form" : "➕ Add Technology"}
      </button>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 border rounded-lg bg-gray-100"
        >
          <div className="mb-2">
            <label className="block font-semibold">Technology Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter technology name"
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
            {editingTechId ? "Update Technology" : "Save Technology"}
          </button>
        </form>
      )}

      {/* Table */}
      <table className="w-full border table table-hover">
        <thead>
          <tr className="bg-gray-200 table-dark">
            <th className="border p-2">S.N</th>
            <th className="border p-2">Technology Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {technologies.map((tech, index) => (
            <tr key={tech._id}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{tech.name}</td>
              <td className="border p-2">{tech.description}</td>
              <td className="border p-2">{tech.status}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(tech)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded mr-2 btn btn-success"
                >
                  <i className="fa fa-pen"></i>
                </button>
                <button
                  onClick={() => handleDelete(tech._id)}
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

export default Technology;
