import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

const API = "/api/notifications";

export default function ManageNotification() {
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "info",
    target: "all",
    priority: "medium",
    redirectUrl: "",
    scheduledAt: "",
  });
  const [file, setFile] = useState(null);
  const [editId, setEditId] = useState(null);

  // --------------------------
  // Load Notifications
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(API);
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Error fetching notifications", "error");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // --------------------------
  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => fd.append(k, form[k]));
      if (file) fd.append("media", file);

      if (editId) {
        await axios.put(`${API}/${editId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Updated", "Notification updated successfully", "success");
      } else {
        await axios.post(API, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Added", "Notification added successfully", "success");
      }

      setForm({
        title: "",
        message: "",
        type: "info",
        target: "all",
        priority: "medium",
        redirectUrl: "",
        scheduledAt: "",
      });
      setFile(null);
      setEditId(null);
      setShowForm(false);
      fetchNotifications();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Error saving notification", "error");
    }
  };

  // --------------------------
  // Handle Delete
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the notification",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.patch(`${API}/${id}`);
      Swal.fire("Deleted", "Notification deleted successfully", "success");
      fetchNotifications();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Error deleting notification", "error");
    }
  };

  // --------------------------
  // Handle Edit
  const handleEdit = (notif) => {
    setForm({
      title: notif.title,
      message: notif.message,
      type: notif.type,
      target: notif.target,
      priority: notif.priority,
      redirectUrl: notif.redirectUrl || "",
      scheduledAt: notif.scheduledAt
        ? notif.scheduledAt.substring(0, 16)
        : "",
    });
    setEditId(notif._id);
    setShowForm(true);
  };

  // --------------------------
  // Handle View
  const handleView = (notif) => {
    Swal.fire({
      title: notif.title,
      html: `
        <p><b>Message:</b> ${notif.message}</p>
        <p><b>Type:</b> ${notif.type}</p>
        <p><b>Target:</b> ${notif.target}</p>
        <p><b>Priority:</b> ${notif.priority}</p>
        <p><b>Created At:</b> ${new Date(
          notif.createdAt
        ).toLocaleString()}</p>
      `,
      icon: "info",
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Manage Notifications</h2>

      {/* Add Button */}
      <button
        className="btn btn-dark mb-3"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Close Form" : "Add Notification"}
      </button>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="border p-3 rounded mb-4 bg-light"
        >
          <div className="row mb-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                required
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="info">Info</option>
                <option value="alert">Alert</option>
                <option value="promo">Promotion</option>
                <option value="success">Success</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <textarea
              className="form-control"
              required
              placeholder="Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            ></textarea>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <select
                className="form-select"
                value={form.target}
                onChange={(e) => setForm({ ...form, target: e.target.value })}
              >
                <option value="all">All Users</option>
                <option value="role:student">Role: Student</option>
                <option value="role:admin">Role: Admin</option>
                <option value="user:user123">Specific User (sample)</option>
              </select>
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="col-md-4">
              <input
                type="datetime-local"
                className="form-control"
                value={form.scheduledAt}
                onChange={(e) =>
                  setForm({ ...form, scheduledAt: e.target.value })
                }
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Optional Redirect URL"
                value={form.redirectUrl}
                onChange={(e) =>
                  setForm({ ...form, redirectUrl: e.target.value })
                }
              />
            </div>
            <div className="col-md-6">
              <input
                type="file"
                className="form-control"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-success">
            {editId ? "Update Notification" : "Send Notification"}
          </button>
        </form>
      )}

      {/* Table */}
      <table className="table table-striped table-hover table-bordered">
        <thead className="table-dark">
          <tr>
            <th>S.N</th>
            <th>Title</th>
            <th>Message</th>
            <th>Type</th>
            <th>Target</th>
            <th>Priority</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((n,i) => (
            <tr key={n._id}>
              <th>{i+1}</th>
              <td>{n.title}</td>
              <td>{n.message}</td>
              <td>{n.type}</td>
              <td>{n.target}</td>
              <td>{n.priority}</td>
              <td>{new Date(n.createdAt).toLocaleString()}</td>
              <td>
                <button
                  className="btn btn-sm btn-info me-1"
                  onClick={() => handleView(n)}
                >
                  <i className="fa fa-eye"></i>
                </button>
                <button
                  className="btn btn-sm btn-warning me-1"
                  onClick={() => handleEdit(n)}
                >
                  <i className="fa fa-pen"></i>
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(n._id)}
                >
                  <i className="fa fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
          {notifications.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">
                No notifications found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
