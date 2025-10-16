import React, { useEffect, useState } from "react";
import axios from "axios";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";
import Swal from "sweetalert2"; // Import SweetAlert2
import "../../assets/css/content.css";

const lowlight = createLowlight(common);
const API = "/api";

export default function ContentManager() {
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingTopics, setFetchingTopics] = useState(false);
  const [contentList, setContentList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    subjectId: "",
    topicId: "",
    type: "",
    category: "",
    title: "",
    description: "",
    contentText: "",
    assignment_dueDate: "",
    assignment_marks: "",
    assignment_submissionType: "file",
    assignment_maxAttempts: 1,
    isPublished: false,
  });
  const [errors, setErrors] = useState({});

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Image,
      Highlight,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: formData.contentText,
    autofocus: false,
    onUpdate: ({ editor }) =>
      setFormData((prev) => ({ ...prev, contentText: editor.getHTML() })),
  });

  useEffect(() => {
    (async () => {
      try {
        const [sres, cres] = await Promise.all([
          axios.get(`${API}/subject`),
          axios.get(`${API}/contents`),
        ]);
        setSubjects(sres.data || []);
        setContentList(cres.data.items || []); // Backend returns { items, total, page, limit }
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch subjects or content. Please try again.",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (!formData.subjectId) {
      setTopics([]);
      return;
    }
    (async () => {
      try {
        setFetchingTopics(true);
        const res = await axios.get(
          `${API}/topics/subject/${formData.subjectId}`
        );
        setTopics(res.data || []);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch topics. Please try again.",
          timer: 3000,
          showConfirmButton: false,
        });
      } finally {
        setFetchingTopics(false);
      }
    })();
  }, [formData.subjectId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile || null);
    if (selectedFile) {
      if (selectedFile.size > 200 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, file: "File size exceeds 200MB limit." }));
      } else {
        setErrors((prev) => ({ ...prev, file: "" }));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      subjectId: "",
      topicId: "",
      type: "",
      category: "",
      title: "",
      description: "",
      contentText: "",
      assignment_dueDate: "",
      assignment_marks: "",
      assignment_submissionType: "file",
      assignment_maxAttempts: 1,
      isPublished: false,
    });
    setFile(null);
    setEditId(null);
    setErrors({});
    editor?.commands.setContent("");
  };

  const fetchContents = async () => {
    try {
      const res = await axios.get(`${API}/contents`);
      setContentList(res.data.items || []); // Fixed endpoint and use items
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch content list. Please try again.",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subjectId) newErrors.subjectId = "Subject is required.";
    if (!formData.topicId) newErrors.topicId = "Topic is required.";
    if (!formData.type) newErrors.type = "Content Type is required.";
    if (!formData.title) newErrors.title = "Title is required.";
    if (formData.type === "assignment") {
      if (!formData.assignment_dueDate) newErrors.assignment_dueDate = "Due Date is required for assignments.";
      if (!formData.assignment_marks || formData.assignment_marks <= 0) newErrors.assignment_marks = "Marks must be a positive number.";
      if (formData.assignment_maxAttempts < 1) newErrors.assignment_maxAttempts = "Max Attempts must be at least 1.";
    }
    if (["pdf", "video", "pptx", "image", "audio", "doc"].includes(formData.type) && !file && !editId) {
      newErrors.file = "File is required for this content type.";
    }
    if (["readable", "doc"].includes(formData.type) && !formData.contentText) {
      newErrors.contentText = "Content text is required for readable/doc types.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fix the errors in the form before submitting.",
        confirmButtonText: "OK",
      });
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v != null) data.append(k, v);
      });
      if (file) data.append("file", file);

      let response;
      if (editId) {
        response = await axios.put(`${API}/contents/${editId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Content updated successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        response = await axios.post(`${API}/contents`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Content uploaded successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
      }
      resetForm();
      fetchContents();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.error || (editId ? "Update failed" : "Upload failed"),
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "Do you want to delete this content?",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API}/contents/${id}`);
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Content deleted successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchContents();
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Delete failed. Please try again.",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleEdit = (c) => {
    setFormData({
      subjectId: c.subjectId?._id || "",
      topicId: c.topicId?._id || "",
      type: c.type || "",
      category: c.category || "",
      title: c.title || "",
      description: c.description || "",
      contentText: c.contentText || "",
      assignment_dueDate: c.assignment?.dueDate ? new Date(c.assignment.dueDate).toISOString().slice(0, 10) : "",
      assignment_marks: c.assignment?.marks || "",
      assignment_submissionType: c.assignment?.submissionType || "file",
      assignment_maxAttempts: c.assignment?.maxAttempts || 1,
      isPublished: !!c.isPublished,
    });
    editor?.commands.setContent(c.contentText || "");
    setEditId(c._id);
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fileAcceptForType = (type) =>
    ({
      pdf: ".pdf",
      video: "video/*",
      pptx: ".ppt,.pptx",
      doc: ".doc,.docx",
      image: "image/*",
      audio: "audio/*",
    }[type] || "");

  return (
    <div className="container py-5 content-upload">
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-body">
          <h4 className="mb-3">{editId ? "Edit Study Content" : "Upload Study Content"}</h4>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Subject */}
              <div className="col-md-4">
                <label className="form-label">Subject *</label>
                <select
                  name="subjectId"
                  className="form-select"
                  value={formData.subjectId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Subject --</option>
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.subject}
                    </option>
                  ))}
                </select>
                {errors.subjectId && <small className="text-danger">{errors.subjectId}</small>}
              </div>

              {/* Topic */}
              <div className="col-md-4">
                <label className="form-label">Topic *</label>
                <select
                  name="topicId"
                  className="form-select"
                  value={formData.topicId}
                  onChange={handleChange}
                  required
                  disabled={!formData.subjectId || fetchingTopics}
                >
                  <option value="">
                    {fetchingTopics ? "Loading topics..." : "-- Select Topic --"}
                  </option>
                  {topics.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.title}
                    </option>
                  ))}
                </select>
                {errors.topicId && <small className="text-danger">{errors.topicId}</small>}
              </div>

              {/* Type */}
              <div className="col-md-4">
                <label className="form-label">Content Type *</label>
                <select
                  name="type"
                  className="form-select"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Type --</option>
                  <option value="pdf">PDF</option>
                  <option value="video">Video</option>
                  <option value="doc">Document</option>
                  <option value="pptx">PPTX</option>
                  <option value="image">Image</option>
                  <option value="readable">Readable</option>
                  <option value="recording">Recording</option>
                </select>
                {errors.type && <small className="text-danger">{errors.type}</small>}
              </div>

              {/* Title */}
              <div className="col-md-6">
                <label className="form-label">Title *</label>
                <input
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                {errors.title && <small className="text-danger">{errors.title}</small>}
              </div>

              {/* Category */}
              <div className="col-md-6">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">-- Select Category --</option>
                  <option value="assignment">Assignment</option>
                  <option value="task">Task</option>
                  <option value="reading">Reading</option>
                  <option value="recording-assignment">Recording Assignment</option>
                  <option value="learning-outcomes">Learning Outcomes</option>
                  <option value="learning-objective">Learning Objective</option>
                  <option value="practice">Practice</option>
                  <option value="reference">Reference</option>
                </select>
              </div>

              {/* File Upload */}
              {["pdf", "video", "pptx", "image", "audio", "doc"].includes(
                formData.type
              ) && (
                <div className="col-12">
                  <label className="form-label">
                    Upload File {file ? `: ${file.name}` : ""} {editId && "(Optional - to replace existing)"}
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleFileChange}
                    accept={fileAcceptForType(formData.type)}
                  />
                  {errors.file && <small className="text-danger">{errors.file}</small>}
                </div>
              )}

              {/* TipTap Editor */}
              {["doc", "readable"].includes(formData.type) && editor && (
                <div className="col-12">
                  <label className="form-label">Write Content</label>
                  <EditorContent editor={editor} className="border p-2" />
                  {errors.contentText && <small className="text-danger">{errors.contentText}</small>}
                </div>
              )}

              {/* Assignment Fields */}
              {formData.type === "assignment" && (
                <>
                  <div className="col-md-3">
                    <label className="form-label">Due Date *</label>
                    <input
                      type="date"
                      name="assignment_dueDate"
                      className="form-control"
                      value={formData.assignment_dueDate}
                      onChange={handleChange}
                      required
                    />
                    {errors.assignment_dueDate && <small className="text-danger">{errors.assignment_dueDate}</small>}
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Marks *</label>
                    <input
                      type="number"
                      name="assignment_marks"
                      className="form-control"
                      value={formData.assignment_marks}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                    {errors.assignment_marks && <small className="text-danger">{errors.assignment_marks}</small>}
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Submission Type</label>
                    <select
                      name="assignment_submissionType"
                      className="form-select"
                      value={formData.assignment_submissionType}
                      onChange={handleChange}
                    >
                      <option value="file">File</option>
                      <option value="text">Text</option>
                      <option value="link">Link</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Max Attempts *</label>
                    <input
                      type="number"
                      name="assignment_maxAttempts"
                      className="form-control"
                      value={formData.assignment_maxAttempts}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                    {errors.assignment_maxAttempts && <small className="text-danger">{errors.assignment_maxAttempts}</small>}
                  </div>
                </>
              )}

              {/* Description */}
              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                />
              </div>

              {/* Publish + Submit */}
              <div className="col-12 d-flex justify-content-end align-items-center">
                <div className="form-check me-3">
                  <input
                    type="checkbox"
                    name="isPublished"
                    className="form-check-input"
                    checked={formData.isPublished}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Publish now</label>
                </div>
                <button
                  className="btn btn-dark"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (editId ? "Updating..." : "Uploading...") : (editId ? "Update Content" : "Upload Content")}
                </button>
                {editId && (
                  <button
                    className="btn btn-secondary ms-2"
                    type="button"
                    onClick={resetForm}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Content List */}
      <div className="card shadow-sm w-100">
        <div className="card-body">
          <h5>Uploaded Content</h5>
          {contentList.length === 0 ? (
            <p className="text-muted">No content yet.</p>
          ) : (
            <table className="table table-striped w-100">
              <thead>
                <tr>
                  <th>S.N</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Subject</th>
                  <th>Topic</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contentList.map((c,i) => (
                  <tr key={c._id}>
                    <td>{i+1}</td>
                    <td>{c.title}</td>
                    <td>{c.type}</td>
                    <td>{c.category || "-"}</td>
                    <td>{c.subjectId?.subject || "-"}</td>
                    <td>{c.topicId?.title || "-"}</td>
                    <td>{c.isPublished ? "Yes" : "No"}</td>
                    <td>
                      {c.url && (
                        <a
                          href={`http://localhost:3000`+c.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-primary me-2"
                        >
                          <i className="fa fa-eye"></i>
                        </a>
                      )}
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(c)}
                      >
                        <i className="fa fa-pen"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(c._id)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}