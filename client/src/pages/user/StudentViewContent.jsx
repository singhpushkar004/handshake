import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import "../../assets/css/Yt.css"; // You can rename or keep custom CSS here

const FRONTEND_API = "http://localhost:3000/api";

export default function StudentViewContent() {
  const [student, setStudent] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const studentId = localStorage.getItem("userId");

  const getSubjectIcon = (subjectName = "") => {
    const s = subjectName.toLowerCase();
    if (s.includes("python")) return "fa-python";
    if (s.includes("science")) return "fa-flask";
    if (s.includes("history")) return "fa-book-open";
    if (s.includes("english") || s.includes("literature")) return "fa-pen-fancy";
    if (s.includes("computer") || s.includes("programming")) return "fa-laptop-code";
    if (s.includes("art")) return "fa-paint-brush";
    if (s.includes("physics")) return "fa-atom";
    if (s.includes("chemistry")) return "fa-vial";
    if (s.includes("biology")) return "fa-dna";
    return "fa-book";
  };

  useEffect(() => {
    if (!studentId) {
      Swal.fire("Error", "No student logged in!", "error");
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const studentRes = await axios.get(`${FRONTEND_API}/users/${studentId}`);
      const studentData = studentRes.data;
      setStudent(studentData);

      const [assignRes, contentRes] = await Promise.all([
        axios.get(`${FRONTEND_API}/assign-content`),
        axios.get(`${FRONTEND_API}/contents/all`),
      ]);

      const allAssignments = assignRes.data || [];
      const allContents = Array.isArray(contentRes.data)
        ? contentRes.data
        : contentRes.data.contents || [];

      const activeAssignments = allAssignments.filter(
        (a) => a.batchId._id === studentData.batch._id
      );
      const assignedSubjects = activeAssignments.map((a) => a.subjectId?._id);

      const filteredContents = allContents.filter((c) =>
        assignedSubjects.includes(c.subjectId?._id)
      );

      const uniqueSubjects = [];
      const seen = new Set();
      for (const item of filteredContents) {
        const subId = item.subjectId?._id;
        if (!seen.has(subId)) {
          seen.add(subId);
          uniqueSubjects.push(item);
        }
      }
      setContents(uniqueSubjects);
    } catch (err) {
      console.error("Error loading content:", err);
      Swal.fire("Error", "Failed to load content", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-5 text-secondary fw-semibold fs-5">
        Loading materials...
      </div>
    );

  return (
    <div className="container py-5">
      {/* Font Awesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      {/* 🌈 Custom Motion CSS */}
      <style>{`
        .motion-card {
          position: relative;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
          transition: all 0.4s ease;
        }
        .motion-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        }
        .motion-card::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(from 180deg at 50% 50%, #7c3aed, #4f46e5, #9333ea, #2563eb, #7c3aed);
          animation: spin 6s linear infinite;
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: 0;
        }
        .motion-card:hover::before {
          opacity: 0.25;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .motion-inner {
          position: relative;
          z-index: 2;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 16px;
          padding: 1.8rem;
          height: 100%;
        }

        .subject-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(145deg, #e0e7ff, #c7d2fe);
          box-shadow: inset 0 2px 5px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }
        .motion-card:hover .subject-icon {
          transform: scale(1.15) rotate(8deg);
        }

        .btn-glow {
          background: linear-gradient(90deg, #4f46e5, #7c3aed);
          color: #fff;
          padding: 0.6rem 1.4rem;
          border-radius: 10px;
          font-weight: 600;
          letter-spacing: 0.3px;
          border: none;
          transition: all 0.4s ease;
        }
        .btn-glow:hover {
          box-shadow: 0 0 15px rgba(124, 58, 237, 0.6);
          transform: scale(1.05);
        }

        .header-gradient {
          background: linear-gradient(90deg, #4f46e5, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="fw-bold fs-2 header-gradient mb-2">
          📘 My Study Materials
        </h2>
        {student && (
          <p className="text-secondary fw-medium">
            Program:{" "}
            <span className="fw-semibold text-primary">
              {student.program?.program || "N/A"}
            </span>{" "}
            | Batch:{" "}
            <span className="fw-semibold text-primary">
              {student.batch?.name || "N/A"}
            </span>
          </p>
        )}
      </div>

      {/* Content Grid */}
      {contents.length === 0 ? (
        <div className="alert alert-info text-center p-4 rounded-4 shadow-sm">
          No active materials assigned yet.
        </div>
      ) : (
        <div className="row g-4">
          {contents.map((content, i) => (
            <div className="col-12 col-sm-6 col-lg-4" key={i}>
              <div className="motion-card h-100">
                <div className="motion-inner d-flex flex-column h-100">
                  <div className="d-flex align-items-center mb-4">
                    <div className="subject-icon me-3">
                      <i
                        className={`fas ${getSubjectIcon(
                          content.subjectId?.subject
                        )} text-primary fs-3`}
                      ></i>
                    </div>
                    <h5 className="fw-bold text-primary mb-0">
                      {content.subjectId?.subject || "Unknown Subject"}
                    </h5>
                  </div>
                  <p className="text-secondary flex-grow-1 mb-4">
                    {content.description
                      ? content.description.slice(0, 100) + "..."
                      : "No description available."}
                  </p>
                  <button
                    onClick={() =>
                      navigate(
                        `/userDashboard/view-content/${content.subjectId?._id}`
                      )
                    }
                    className="btn-glow mt-auto align-self-start"
                  >
                    Explore →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
