import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/notifications"; // adjust base url

export default function UserNotifications({ userId }) {
  const [unread, setUnread] = useState([]);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("unread"); // unread | all

  // Fetch Unread Notifications
  const fetchUnread = async () => {
    try {
      const res = await axios.get(`${API}/unread/${userId}`);
      setUnread(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch All Notifications
  const fetchAll = async () => {
    try {
      const res = await axios.get(API);
      setAll(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Mark as Read
  const markAsRead = async (id) => {
    try {
      await axios.post(`${API}/${id}/read/${userId}`);
      await fetchUnread();
      await fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchUnread();
      await fetchAll();
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <p>Loading notifications...</p>;

  const data = view === "unread" ? unread : all;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <h2>User Notifications</h2>
      <div style={{ marginBottom: 12 }}>
        <button
          onClick={() => setView("unread")}
          style={{
            marginRight: 8,
            background: view === "unread" ? "#007bff" : "#ddd",
            color: view === "unread" ? "#fff" : "#000",
            padding: "6px 12px",
            border: "none",
            borderRadius: 4,
          }}
        >
          Unread ({unread.length})
        </button>
        <button
          onClick={() => setView("all")}
          style={{
            background: view === "all" ? "#007bff" : "#ddd",
            color: view === "all" ? "#fff" : "#000",
            padding: "6px 12px",
            border: "none",
            borderRadius: 4,
          }}
        >
          All ({all.length})
        </button>
      </div>

      {data.length === 0 ? (
        <p>No {view} notifications</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {data.map((n) => (
            <li
              key={n._id}
              style={{
                marginBottom: 12,
                padding: 12,
                border: "1px solid #ccc",
                borderRadius: 6,
                background: unread.find((u) => u._id === n._id)
                  ? "#f9f9f9"
                  : "#eaf7ff",
              }}
            >
              <h4 style={{ margin: "0 0 6px" }}>
                {n.title}{" "}
                <small style={{ color: "#888" }}>
                  ({new Date(n.createdAt).toLocaleString()})
                </small>
              </h4>
              <p style={{ margin: "4px 0" }}>{n.message}</p>
              {n.mediaUrl && (
                <img
                  src={`http://localhost:5000${n.mediaUrl}`}
                  alt="media"
                  style={{ maxWidth: "100%", marginTop: 8 }}
                />
              )}
              {n.redirectUrl && (
                <p>
                  <a
                    href={n.redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Go to link
                  </a>
                </p>
              )}
              {!n.readBy.includes(userId) && (
                <button
                  onClick={() => markAsRead(n._id)}
                  style={{
                    marginTop: 8,
                    background: "#28a745",
                    color: "#fff",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: 4,
                  }}
                >
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
