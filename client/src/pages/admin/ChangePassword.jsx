import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const ChangePassword = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // replace with logged-in user's id (from localStorage / context)
  const userId = localStorage.getItem("id");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/users/change-password", {
        userId,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
      Swal.fire("Success", res.data.message, "success");
      localStorage.removeItem('adminEmail')
      localStorage.removeItem('id')
      localStorage.removeItem('role')
      localStorage.removeItem('token')
      navigate('/signin')
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12 mx-auto">
          <div className="card text-start border-0 shadow-lg">
            <h4>Change Password</h4>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-sm-8">
                    <label className="mb-2">Enter Old Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="oldPassword"
                      value={formData.oldPassword}
                      onChange={handleChange}
                      placeholder="Enter Here..."
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-8">
                    <label className="mb-2">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter Here..."
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-8">
                    <label className="mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Enter Here..."
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-8">
                    <input
                      type="submit"
                      className="form-control btn btn-dark"
                      value="Change"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
