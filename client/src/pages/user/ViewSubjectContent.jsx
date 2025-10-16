import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";
import { Document, Page, pdfjs } from "react-pdf";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "../../assets/css/Yt.css";

// ✅ PDF Worker setup
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// CKEditor imports
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const FRONTEND_API = "http://localhost:3000/api";
const BACKEND_BASE_URL = "http://localhost:3000";

// Assuming student is available, e.g., from context or props. Replace with actual implementation.
const student = { _id: "your-student-id-here" }; // Placeholder: Fetch from auth context or localStorage

export default function ViewSubjectContent() {
  const { subjectId } = useParams();
  const [contents, setContents] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [selectedContent, setSelectedContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [textAnswer, setTextAnswer] = useState("");
  const [file, setFile] = useState(null);
  const [submissionType, setSubmissionType] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentFileUrl, setCurrentFileUrl] = useState(null);
  const viewer = useEditor({
    extensions: [StarterKit],
    content: "",
    editable: false,
  });

  // Load subject-wise content
  useEffect(() => {
    if (subjectId) loadSubjectContent();
  }, [subjectId]);

  // Load submission when selectedContent changes
  useEffect(() => {
    if (selectedContent) {
      loadSubmission();
      setEditMode(false);
      setTextAnswer("");
      setFile(null);
      setSubmissionType(null);
      setCurrentFileUrl(null);
    }
  }, [selectedContent]);

  const loadSubjectContent = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${FRONTEND_API}/contents/all`);
      const allContents = Array.isArray(res.data)
        ? res.data
        : res.data.contents || [];

      const subjectContents = allContents.filter(
        (c) => c.subjectId?._id === subjectId
      );

      if (subjectContents.length > 0)
        setSubjectName(subjectContents[0].subjectId?.subject || "Subject");

      // Group by topic uniquely
      const grouped = subjectContents.reduce((acc, c) => {
        const topic = c.topicId.title || "General";
        if (!acc[topic]) acc[topic] = [];
        // Ensure unique contents by _id (avoid duplicates if any)
        if (!acc[topic].some((item) => item._id === c._id)) {
          acc[topic].push(c);
        }
        return acc;
      }, {});

      setContents(grouped);
    } catch (err) {
      console.error("Error:", err);
      Swal.fire("Error", "Failed to load subject content", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadSubmission = async () => {
    try {
      const res = await axios.get(
        `${FRONTEND_API}/submissions/student/${student._id}/content/${selectedContent._id}`
      );
      const sub = res.data;
      setSubmission(sub);
      if (sub) {
        if (sub.textAnswer) {
          setSubmissionType("text");
          setTextAnswer(sub.textAnswer);
        } else if (sub.file) {
          setSubmissionType("file");
          setCurrentFileUrl(resolveURL(sub.file.path));
        }
      }
    } catch (err) {
      setSubmission(null);
    }
  };

  const handleSave = async () => {
    if (!selectedContent) {
      Swal.fire("Select Content", "Please select a topic before submitting.", "warning");
      return;
    }

    if (!textAnswer && !file) {
      Swal.fire("Submission Required", "Please provide either a text answer or a file.", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("studentId", student._id);
    formData.append("subjectId", subjectId);
    formData.append("contentId", selectedContent._id);
    if (textAnswer) formData.append("textAnswer", textAnswer);
    if (file) formData.append("file", file);

    try {
      let res;
      if (submission) {
        // Update
        res = await axios.put(
          `${FRONTEND_API}/submissions/update/${submission._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        Swal.fire("✅ Success", "Your submission was updated successfully!", "success");
      } else {
        // Create
        res = await axios.post(
          `${FRONTEND_API}/submissions/submit`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        Swal.fire("✅ Success", "Your submission was uploaded successfully!", "success");
      }
      setTextAnswer("");
      setFile(null);
      setSubmissionType(null);
      setEditMode(false);
      setCurrentFileUrl(null);
      loadSubmission(); // Reload submission
    } catch (err) {
      Swal.fire("❌ Error", "Failed to save submission", "error");
    }
  };

  const handleDelete = async () => {
    if (!submission) return;

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${FRONTEND_API}/submissions/delete/${submission._id}`);
          Swal.fire("Deleted!", "Your submission has been deleted.", "success");
          setSubmission(null);
          setEditMode(false);
          setTextAnswer("");
          setFile(null);
          setSubmissionType(null);
          setCurrentFileUrl(null);
        } catch (err) {
          Swal.fire("❌ Error", "Failed to delete submission", "error");
        }
      }
    });
  };

  const resolveURL = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${BACKEND_BASE_URL}${url.startsWith("/") ? "" : "/"}${url.replace(
      /\\/g,
      "/"
    )}`;
  };

  // Render file types
  const renderContent = () => {
    if (!selectedContent)
      return (
        <p className="text-muted text-center mt-3">
          📘 Select a topic from the right to start learning.
        </p>
      );

    const { type, file, url, contentText } = selectedContent;
    const fileUrl = resolveURL(url || file?.path);

    switch (type) {
      case "pdf":
        return (
          <div className="d-flex justify-content-center">
            <Document file={fileUrl}>
              <Page
                pageNumber={1}
                width={Math.min(window.innerWidth * 0.9, 800)}
              />
            </Document>
          </div>
        );
      case "video":
        return (
          <div className="ratio ratio-16x9 rounded overflow-hidden shadow-sm">
            <video key={selectedContent._id} controls className="w-100 h-100">
              <source src={fileUrl} type="video/mp4" />
            </video>
          </div>
        );
      case "audio":
        return (
          <div className="mt-3 text-center">
            <audio controls className="w-100">
              <source src={fileUrl} type="audio/mpeg" />
            </audio>
          </div>
        );
      case "image":
        return (
          <img
            src={fileUrl}
            alt={selectedContent.title}
            className="img-fluid rounded shadow-sm d-block mx-auto"
          />
        );
      case "doc":
        return (
          <div className="d-flex justify-content-center">
            <Document file={fileUrl}>
              <Page
                pageNumber={1}
                width={Math.min(window.innerWidth * 0.9, 800)}
              />
            </Document>
          </div>
        );
      case "readable":
        viewer.commands.setContent(contentText || "");
        return (
          <div className="bg-light p-3 rounded border readable-content">
            <EditorContent editor={viewer} />
          </div>
        );
      default:
        return (
          <p className="text-muted">
            No preview available.{" "}
            <a href={fileUrl} target="_blank" rel="noreferrer">
              Open File
            </a>
          </p>
        );
    }
  };

  const renderSubmission = () => {
    if (!submission) return null;

    return (
      <div className="mt-4">
        <h6 className="fw-semibold">Your Submission</h6>
        {submission.textAnswer ? (
          <div className="bg-light p-3 rounded border">
            <div dangerouslySetInnerHTML={{ __html: submission.textAnswer }} />
          </div>
        ) : submission.file ? (
          <p>
            Uploaded File:{" "}
            <a href={resolveURL(submission.file.path)} target="_blank" rel="noreferrer">
              View File
            </a>
          </p>
        ) : null}
        <div className="mt-2">
          <button className="btn btn-secondary me-2" onClick={() => setEditMode(true)}>
            Edit
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <div className="text-center py-5 text-secondary fw-semibold">
        Loading content...
      </div>
    );

  return (
    <div className="container-fluid py-4">
      {/* Custom Styling */}
      <style>
        {`
          /* Smooth hover + motion */
          .card-hover-motion {
            transition: all 0.4s ease;
          }
          .card-hover-motion:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 25px rgba(0,0,0,0.15);
          }

          /* Accordion fixes */
          .accordion .collapse:not(.show) {
            display: none !important;
          }
          .accordion .collapse.show {
            display: block !important;
          }
          .accordion-button:not(.collapsed) {
            color: #4f46e5;
            background-color: #eef2ff;
          }
          .list-group-item {
            transition: all 0.3s ease;
            cursor: pointer;
          }
          .list-group-item:hover {
            background: linear-gradient(90deg, #eef2ff, #c7d2fe);
            transform: translateX(4px);
          }
          .list-group-item.active {
            background: #4f46e5 !important;
            color: #fff !important;
            font-weight: 600;
          }

          @media (max-width: 768px) {
            .accordion {
              margin-top: 1rem;
            }
          }
        `}
      </style>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h4 className="fw-bold text-primary mb-2">
          📚 {subjectName} - Study Materials
        </h4>
        <Link to="/userDashboard/content" className="btn btn-outline-secondary">
          ← Back
        </Link>
      </div>

      {/* Main Layout */}
      <div className="row">
        {/* LEFT: Viewer */}
        <div className="col-12 col-md-7 col-lg-8 mb-4">
          <div className="card card-hover-motion shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-semibold mb-3">
                {selectedContent?.title || "Select a Content"}
              </h5>
              <hr />
              <div className="border-top pt-3">{renderContent()}</div>
              {selectedContent && (
                <>
                  <hr />
                  {submission && !editMode ? (
                    renderSubmission()
                  ) : (
                    <div className="mt-4">
                      <h6 className="fw-semibold">
                        {editMode || !submission ? "Submit Your Work" : "Edit Your Work"}
                      </h6>
                      <div className="mb-2">
                        <label className="me-3">
                          <input
                            type="radio"
                            name="submissionType"
                            value="text"
                            checked={submissionType === "text"}
                            onChange={() => {
                              setSubmissionType("text");
                              setFile(null);
                              setCurrentFileUrl(null);
                            }}
                          /> Text Answer
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="submissionType"
                            value="file"
                            checked={submissionType === "file"}
                            onChange={() => {
                              setSubmissionType("file");
                              setTextAnswer("");
                            }}
                          /> File Upload
                        </label>
                      </div>

                      {submissionType === "text" && (
                        <CKEditor
                          editor={ClassicEditor}
                          data={textAnswer}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            setTextAnswer(data);
                          }}
                        />
                      )}

                      {submissionType === "file" && (
                        <>
                          {currentFileUrl && (
                            <p>
                              Current File:{" "}
                              <a href={currentFileUrl} target="_blank" rel="noreferrer">
                                View Current File
                              </a>
                            </p>
                          )}
                          <input
                            type="file"
                            className="form-control mb-2 mt-2"
                            onChange={(e) => setFile(e.target.files[0])}
                          />
                        </>
                      )}

                      <button
                        className="btn btn-primary w-100 mt-2"
                        onClick={handleSave}
                      >
                        {editMode || !submission ? "Submit" : "Update"}
                      </button>
                      {editMode && (
                        <button
                          className="btn btn-secondary w-100 mt-2"
                          onClick={() => setEditMode(false)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Accordion Topics */}
        <div className="col-12 col-md-5 col-lg-4">
          <div className="accordion" id="contentAccordion">
            {Object.keys(contents).map((topic, index) => (
              <div className="accordion-item" key={index}>
                <h2 className="accordion-header" id={`heading-${index}`}>
                  <button
                    className={`accordion-button ${
                      index !== 0 ? "collapsed" : ""
                    }`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${index}`}
                    aria-controls={`collapse-${index}`}
                  >
                    {topic}
                  </button>
                </h2>
                <div
                  id={`collapse-${index}`}
                  className={`accordion-collapse collapse ${
                    index === 0 ? "show" : ""
                  }`}
                  aria-labelledby={`heading-${index}`}
                  data-bs-parent="#contentAccordion"
                >
                  <div className="accordion-body p-0">
                    <ul className="list-group list-group-flush">
                      {contents[topic].map((c) => (
                        <li
                          key={c._id}
                          className={`list-group-item ${
                            selectedContent?._id === c._id ? "active" : ""
                          }`}
                          onClick={() => setSelectedContent(c)}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <span>{c.title}</span>
                            <small className="text-muted text-capitalize">
                              {c.type}
                            </small>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}