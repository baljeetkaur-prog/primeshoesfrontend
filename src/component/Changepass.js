import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import Instagram from './Instagram';
import { decryptToken } from '../utils/securetoken';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App'; // 👈 if you're using UserContext

const Changepass = () => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const API = process.env.REACT_APP_APIURL;
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // 👈 optional

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = form;

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      const stored = localStorage.getItem("token");
      if (!stored) throw new Error("You are not logged in.");

      const rawToken = await decryptToken(stored);

      const res = await fetch(`${API}/api/auth/changepassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${rawToken}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      toast.success("Password updated successfully. Please login again.");

      // Clear auth state
      localStorage.removeItem("token");
      setUser(null); // 👈 reset global user state
      setForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // Redirect after short delay
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    }
  };

  return (
    <>
      {/* Breadcrumb Section */}
      <div className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__links">
                <a href="/"><i className="fa fa-home"></i> Home</a>
                <span>Change Password</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <section className="contact spad">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="contact__content text-center">
                <div className="contact__form">
                  <h5>Change Password</h5>
                  <form onSubmit={handleSubmit}>
                    <input
                      type="password"
                      name="currentPassword"
                      placeholder="Current Password"
                      value={form.currentPassword}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="New Password"
                      value={form.newPassword}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm New Password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button type="submit" className="site-btn">
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Instagram />
    </>
  );
};

export default Changepass;
