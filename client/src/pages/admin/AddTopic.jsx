import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const AddTopic = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [topics, setTopics] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    order: "",
    description: "",
  });

  // Fetch all subjects
  const fetchSubjects = async () => {
    try {
      const res = await axios.get("/api/subject");
      setSubjects(res.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  // Fetch topics for selected subject
  const fetchTopics = async (subjectId) => {
    try {
      const res = await axios.get(`/api/topics/subject/${subjectId}`);
      setTopics(res.data);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Handle subject change
  const handleSubjectChange = (e) => {
    const subjectId = e.target.value;
    setSelectedSubject(subjectId);
    if (subjectId) {
      fetchTopics(subjectId);
    } else {
      setTopics([]);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!selectedSubject) {
        Swal.fire("Error!", "Please select a subject first.", "error");
        return;
      }

      if (editingTopicId) {
        await axios.put(`/api/topics/${editingTopicId}`, {
          ...formData,
          SubjectId: selectedSubject,
        });
        Swal.fire("Updated!", "Topic updated successfully.", "success");
      } else {
        await axios.post(`/api/topics`, {
          ...formData,
          SubjectId: selectedSubject,
        });
        Swal.fire("Added!", "New topic added successfully.", "success");
      }

      setFormData({ title: "", order: "", description: "" });
      setShowForm(false);
      setEditingTopicId(null);
      fetchTopics(selectedSubject);
    } catch (error) {
      Swal.fire("Error!", "Something went wrong.", "error");
      console.error(error);
    }
  };

  // Edit topic
  const handleEdit = (topic) => {
    setShowForm(true);
    setEditingTopicId(topic._id);
    setFormData({
      title: topic.title,
      order: topic.order,
      description: topic.description,
    });
  };

  // Delete topic
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This topic will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/topics/${id}`);
          Swal.fire("Deleted!", "Topic deleted successfully.", "success");
          fetchTopics(selectedSubject);
        } catch (error) {
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Topic Management</h2>

      {/* Step 1: Select Subject */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">Step 1: Select Subject</label>
        <select
          className="border p-2 rounded w-full form-control"
          value={selectedSubject}
          onChange={handleSubjectChange}
        >
          <option value="">-- Choose Subject --</option>
          {subjects.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.subject}
            </option>
          ))}
        </select>
      </div>

      {/* Show Topics only when a subject is selected */}
      {selectedSubject && (
        <div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingTopicId(null);
              setFormData({ title: "", order: "", description: "" });
            }}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg btn btn-dark"
          >
            {showForm ? "❌ Close Form" : "➕ Add Topic"}
          </button>

          {/* Add/Edit Form */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="mb-6 p-4 border rounded-lg bg-gray-100"
            >
              {/* Step 2: Topic Name */}
              <div className="mb-2">
                <label className="block font-semibold">Step 2: Topic Name</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter topic title"
                  className="border p-2 rounded w-full form-control"
                />
              </div>

              {/* Step 3: Topic Order */}
              {formData.title && (
                <div className="mb-2">
                  <label className="block font-semibold">Step 3: Topic Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    placeholder="Enter order (optional)"
                    className="border p-2 rounded w-full form-control"
                  />
                </div>
              )}

              {/* Step 4: Description */}
              {formData.title && (
                <div className="mb-2">
                  <label className="block font-semibold">Description (Optional)</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="border p-2 rounded w-full form-control"
                    placeholder="Enter topic description"
                  ></textarea>
                </div>
              )}

              {/* Submit Button only after title and subject selected */}
              {formData.title && (
                <button
                  type="submit"
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg btn btn-dark"
                >
                  {editingTopicId ? "Update Topic" : "Save Topic"}
                </button>
              )}
            </form>
          )}

          {/* Topics Table */}
          <table className="w-full border table table-hover">
            <thead>
              <tr className="bg-gray-200 table-dark">
                <th className="border p-2">S.N</th>
                <th className="border p-2">Title</th>
                <th className="border p-2">Order</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topics.length > 0 ? (
                topics.map((topic, index) => (
                  <tr key={topic._id}>
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{topic.title}</td>
                    <td className="border p-2">{topic.order}</td>
                    <td className="border p-2">{topic.description}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => handleEdit(topic)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded mr-2 btn btn-success"
                      >
                        <i className="fa fa-pen"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(topic._id)}
                        className="px-2 py-1 bg-red-600 text-white rounded btn btn-danger"
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center text-gray-500 border p-4"
                  >
                    No topics found for this subject.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AddTopic;
