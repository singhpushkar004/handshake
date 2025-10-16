import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const API = "/api/branch";

const Branch = () => {
  const [showForm, setShowForm] = useState(false);
  const [branchs, setbranchs] = useState([]);
  const [formData, setFormData] = useState({
    branch: "",
    description: "",
    status: "active",
  });
  const [editingbranchId, setEditingbranchId] = useState(null);

  // Fetch branchs
  const handleFetch = async () => {
    try {
      const res = await axios.get(API);
      setbranchs(res.data);
    } catch (error) {
      console.error("Error fetching branchs:", error);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  // Toggle form
  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setEditingbranchId(null);
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
      if (editingbranchId) {
        await axios.put(`${API}/${editingbranchId}`, formData);
        Swal.fire("Updated!", "branch has been updated successfully.", "success");
      } else {
        await axios.post(API, formData);
        Swal.fire("Added!", "New branch has been added successfully.", "success");
      }
      handleFetch();
      toggleForm();
    } catch (error) {
      Swal.fire("Error!", "Something went wrong.", "error");
      console.error(error);
    }
  };

  // Edit branch
  const handleEdit = (branch) => {
    setShowForm(true);
    setEditingbranchId(branch._id);
    setFormData({
      branch: branch.branch,
      description: branch.description,
      status: branch.status,
    });
  };

  // Delete branch
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This branch will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(`${API}/${id}`);
          setbranchs((prev) => prev.filter((branch) => branch._id !== id));
          Swal.fire("Deleted!", "branch has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error!", "Something went wrong.", "error");
          console.error(error);
        }
      }
    });
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Branch Management</h2>

      {/* Add/Edit Button */}
      <button
        onClick={toggleForm}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg btn btn-dark"
      >
        {showForm ? "❌ Close Form" : "➕ Add branch"}
      </button>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 border rounded-lg bg-gray-100"
        >
          <div className="mb-2">
            <label className="block font-semibold">Branch Name</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              placeholder="Enter branch Here"
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
            {editingbranchId ? "Update branch" : "Save branch"}
          </button>
        </form>
      )}

      {/* Table */}
      <table className="w-full border table table-hover">
        <thead>
          <tr className="bg-gray-200 table-dark">
            <th className="border p-2">S.N</th>
            <th className="border p-2">Branch Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {branchs.map((branch, index) => (
            <tr key={branch._id}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{branch.branch}</td>
              <td className="border p-2">{branch.description}</td>
              <td className="border p-2">{branch.status}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(branch)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded mr-2 btn btn-success"
                >
                  <i className="fa fa-pen"></i>
                </button>
                <button
                  onClick={() => handleDelete(branch._id)}
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

export default Branch;
