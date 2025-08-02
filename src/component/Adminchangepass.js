import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaLock, FaHome, FaCheckCircle, FaUserShield, FaKey
} from 'react-icons/fa';
import Instagram from './Instagram';
import Adminsidebar from './Adminsidebar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode'; 
import { decryptToken } from '../utils/securetoken';

const iconStyle = { marginRight: '8px', color: '#ca1515' };
const bulletStyle = { marginRight: '6px', color: '#ca1515', fontSize: '12px' };

const Adminchangepass = () => {
  const [formData, setFormData] = useState({
    email: '',
    oldPassword: '',
    newPassword: '',
  });
  const [adminName, setAdminName] = useState("Admin User");

  const API = process.env.REACT_APP_APIURL;

useEffect(() => {
  const encoded = sessionStorage.getItem('adminToken');
  if (encoded) {
    decryptToken(encoded)
      .then(token => {
        const decoded = jwtDecode(token);
        setAdminName(decoded.adminname || "Admin User");
      })
      .catch(err => {
        console.error("Token decryption failed", err);
        toast.error("Session expired. Please login again.");
        window.location.href = "/adminlogin";
      });
  }
}, []);


  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/admin/changepassword`, formData);
      toast.success('Password changed successfully. Login with new password.');
      sessionStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      window.location.href = '/adminlogin';
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.msg || 'Failed to change password';
      toast.error(message);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    toast.success("Logged out");
    window.location.href = "/adminlogin";
  };

  return (
    <div className="admin-layout container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 p-0">
          <Adminsidebar adminName={adminName} handleLogout={handleLogout} />
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 p-3 admin-main-content">
          {/* Breadcrumb */}

          {/* Info + Form */}
          <section className="contact spad">
            <div className="container">
              <div className="row">
                {/* Left Info */}
                <div className="col-lg-6 col-md-6 mb-4">
                  <div className="contact__content">
                    <div className="contact__address">
                      <h5>Admin Security Tips</h5>
                      <ul>
                        <li>
                          <h6><FaUserShield style={iconStyle} /> Strong Credentials</h6>
                          <ul>
                            <li><FaCheckCircle style={bulletStyle} /> Use a secure password</li>
                            <li><FaCheckCircle style={bulletStyle} /> Avoid sharing credentials</li>
                          </ul>
                        </li>
                        <li>
                          <h6><FaKey style={iconStyle} /> Regular Updates</h6>
                          <ul>
                            <li><FaCheckCircle style={bulletStyle} /> Change password periodically</li>
                            <li><FaCheckCircle style={bulletStyle} /> Use combinations of characters</li>
                          </ul>
                        </li>
                        <li>
                          <h6><FaLock style={iconStyle} /> Confidentiality</h6>
                          <ul>
                            <li><FaCheckCircle style={bulletStyle} /> Avoid saving passwords on browsers</li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Right Form */}
                <div className="col-lg-6 col-md-6">
                  <div className="contact__form">
                    <h5>CHANGE ADMIN PASSWORD</h5>
                    <form onSubmit={handleSubmit}>
                      <input
                        type="email"
                        name="email"
                        placeholder="Admin Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <input
                        type="password"
                        name="oldPassword"
                        placeholder="Current Password"
                        value={formData.oldPassword}
                        onChange={handleChange}
                        required
                      />
                      <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                      />
                      <button type="submit" className="site-btn">Update Password</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Adminchangepass;
