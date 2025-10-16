import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Document, Page, pdfjs  } from "react-pdf";
import ReactPlayer from "react-player";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "../../assets/css/Yt.css";

// ✅ PDF Worker setup (React 18+/React-PDF v7+)
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const FRONTEND_API = "http://localhost:3000/api";
const BACKEND_BASE_URL = "http://localhost:3000"; // ✅ change if backend is deployed

export default function ViewContent() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [groupedContents, setGroupedContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const viewer = useEditor({
    extensions: [StarterKit],
    content: "",
    editable: false,
  });

  // ✅ Fetch subjects
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${FRONTEND_API}/contents/subjects`);
        setSubjects(res.data);
      } catch (e) {
        Swal.fire("Error", "Failed to load subjects", "error");
      }
    })();
  }, []);

  // ✅ Fetch topics + content whenever subject/topic changes
  useEffect(() => {
    if (!selectedSubject) {
      setGroupedContents([]);
      setSelectedContent(null);
      return;
    }

    (async () => {
      try {
        const res = await axios.get(
          `${FRONTEND_API}/contents/topics/${selectedSubject}`
        );
        setTopics(res.data);
      } catch (e) {
        console.error("Error fetching topics:", e);
      }
    })();

    fetchGroupedContents();
  }, [selectedSubject, selectedTopic]);

  const fetchGroupedContents = async () => {
    setLoading(true);
    try {
      const params = selectedTopic ? `?topicId=${selectedTopic}` : "";
      const res = await axios.get(
        `${FRONTEND_API}/contents/by-subject/${selectedSubject}${params}`
      );
      setGroupedContents(res.data);
    } catch (e) {
      Swal.fire("Error", "Failed to load contents", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadContent = async (contentId) => {
    try {
      const res = await axios.get(`${FRONTEND_API}/contents/view/${contentId}`);
      const data = res.data;
      setSelectedContent(data);
      setComments(data.comments || []);
      if (["readable", "doc"].includes(data.type) && viewer) {
        viewer.commands.setContent(data.contentText || "");
      }
    } catch (e) {
      Swal.fire("Error", "Failed to load content", "error");
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `${FRONTEND_API}/contents/${selectedContent._id}/comments`,
        {
          text: newComment,
        }
      );
      setComments((prev) => [...prev, res.data.comment]);
      setNewComment("");
      Swal.fire({
        icon: "success",
        title: "Comment added",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (e) {
      Swal.fire("Error", "Could not post comment", "error");
    }
  };

  const deleteComment = async (commentId) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete comment?",
      showCancelButton: true,
    });
    if (!confirm.isConfirmed) return;
    try {
      await axios.delete(
        `${FRONTEND_API}/contents/${selectedContent._id}/comments/${commentId}`
      );
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      Swal.fire({
        icon: "success",
        title: "Deleted",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (e) {
      Swal.fire("Error", "Could not delete comment", "error");
    }
  };

  // ✅ Helper to resolve backend URLs
  const resolveURL = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${BACKEND_BASE_URL}${url.startsWith("/") ? "" : "/"}${url.replace(
      /\\/g,
      "/"
    )}`;
  };

  // ✅ Media + PDF rendering
  const renderContent = () => {
    if (!selectedContent) {
      return (
        <p className="text-muted">Select a content from the right panel</p>
      );
    }

    const { type, url, file, contentText } = selectedContent;
    const fileUrl = resolveURL(url || file?.path);

    // console.log("🎬 Rendering:", { type, fileUrl });

    switch (type) {
      case "pdf":
        return (
          <div className="d-flex justify-content-center youtube-like-player">
            <Document file={fileUrl}>
              <Page pageNumber={1} width={600} />
            </Document>
          </div>
        );

      case "video":
        return (
          <div className="youtube-like-player">
            <video
              key={selectedContent._id}
              controls
              preload="metadata"
              crossOrigin="anonymous"
            >
              <source src={fileUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );

      case "audio":
        return (
          <audio controls className="audio-player w-100 mt-3">
            <source src={fileUrl} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        );

      case "image":
        return (
          <img
            src={fileUrl}
            alt={selectedContent.title}
            className="youtube-like-image"
            crossOrigin="anonymous"
          />
        );

      case "doc":
        return   <div className="d-flex justify-content-center youtube-like-player">
            <Document file={fileUrl}>
              <Page pageNumber={1} width={600} />
            </Document>
          </div>
      case "readable":
        return <EditorContent editor={viewer} className="youtube-like-doc" />;

      case "pptx":
      case "xlsx":
        return (
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            Download {type.toUpperCase()}
          </a>
        );

      default:
        return (
          <p className="text-muted">
            No preview available for this content type.
          </p>
        );
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Filters */}
      <div className="row mb-4" id="upper-row">
        <div className="col-sm-12">
          <div className="card text-start select-card">
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6 d-flex justify-content-evenly">
                  <label className="form-label fw-bold">Select Subject</label>
                  <select
                    className="form-select py-0"
                    value={selectedSubject}
                    onChange={(e) => {
                      setSelectedSubject(e.target.value);
                      setSelectedTopic("");
                    }}
                  >
                    <option value="">-- Choose Subject --</option>
                    {subjects.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.subject}
                      </option>
                    ))}
                  </select>
                  {topics.length > 0 && (
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        Filter by Topic
                      </label>
                      <select
                        className="form-select"
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                      >
                        <option value="">All Topics</option>
                        {topics.map((t) => (
                          <option key={t._id} value={t._id}>
                            {t.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="row">
        {/* Viewer - YouTube-like left side */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm h-100 youtube-like-viewer-card">
            <div className="card-body">
              <h4 className="youtube-like-title">{selectedContent?.title || "Select a content"}</h4>
              <hr />
              <div className="content-renderer mb-4">{renderContent()}</div>

              {selectedContent && (
                <div className="youtube-like-comments mt-5">
                  {/* <h5 className="youtube-like-title">Comments</h5> */}
                  {/* <div className="mb-3 youtube-like-comment-form">
                    <textarea
                      className="form-control youtube-like-textarea"
                      rows="2"
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <button
                      className="btn btn-primary mt-2 youtube-like-post-btn"
                      onClick={addComment}
                    >
                      Post
                    </button>
                  </div> */}

                  {/* <div className="youtube-like-comment-list">
                    {comments.length === 0 ? (
                      <p className="text-muted">No comments yet.</p>
                    ) : (
                      comments.map((c) => (
                        <div
                          key={c._id}
                          className="youtube-like-comment-item"
                        >
                          <div className="youtube-like-comment-content">
                            <div className="youtube-like-comment-header">
                              <strong className="youtube-like-avatar">{c.author}</strong>
                              <small>{new Date(c.date).toLocaleString()}</small>
                            </div>
                            <p className="youtube-like-comment-text">{c.text}</p>
                          </div>
                          <button
                            className="btn btn-sm btn-danger youtube-like-comment-actions"
                            onClick={() => deleteComment(c._id)}
                          >
                            X
                          </button>
                        </div>
                      ))
                    )}
                  </div> */}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Accordion for topics */}
        <div className="col-lg-4">
          <div className="card shadow-sm h-100 youtube-like-sidebar-card">
            <div className="card-body">
              <h5>Contents</h5>
              {loading ? (
                <p>Loading…</p>
              ) : groupedContents.length === 0 ? (
                <p className="text-muted">
                  No content available for this subject.
                </p>
              ) : (
                <div className="accordion youtube-like-accordion" id="topicsAccordion">
                  {groupedContents.map((group, index) => (
                    <div
                      className="accordion-item"
                      key={group.topic?._id || "other"}
                    >
                      <h2 className="accordion-header" id={`heading${index}`}>
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse${index}`}
                          aria-expanded="false"
                          aria-controls={`collapse${index}`}
                        >
                          {group.topic?.title || "Uncategorized"}
                        </button>
                      </h2>
                      <div
                        id={`collapse${index}`}
                        className="accordion-collapse collapse"
                        aria-labelledby={`heading${index}`}
                        data-bs-parent="#topicsAccordion"
                      >
                        <div className="accordion-body">
                          <div className="list-group">
                            {group.items.map((item) => (
                              <button
                                key={item._id}
                                className={`list-group-item list-group-item-action ${
                                  selectedContent?._id === item._id
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() => loadContent(item._id)}
                              >
                                <div className="d-flex w-100 justify-content-between">
                                  <span>{item.title}</span>
                                  <small className="text-muted">
                                    {item.type}
                                  </small>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}