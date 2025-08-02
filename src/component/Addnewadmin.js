import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaGift, FaUser, FaHeadphones, FaHome, FaCheckCircle
} from 'react-icons/fa';
import Instagram from './Instagram';
import Adminsidebar from './Adminsidebar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { decryptToken } from '../utils/securetoken';

const iconStyle = { marginRight: '8px', color: '#ca1515' };
const bulletStyle = { marginRight: '6px', color: '#ca1515', fontSize: '12px' };

const Addnewadmin = () => {
  const [formData, setFormData] = useState({
    adminname: '',
    email: '',
    password: '',
  });
  const [adminName, setAdminName] = useState("Admin User");

  const API = process.env.REACT_APP_APIURL;

useEffect(() => {
  const encoded = sessionStorage.getItem('adminToken');
  if (encoded) {
    decryptToken(encoded)
      .then((token) => {
        const decoded = jwtDecode(token);
        setAdminName(decoded.adminname || "Admin User");
      })
      .catch((err) => {
        console.error("Token decryption failed", err);
        toast.error("Session expired. Please log in again.");
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
     const encoded = sessionStorage.getItem('adminToken');
let token;
try {
  token = await decryptToken(encoded);
} catch (err) {
  toast.error("Invalid session. Please log in again.");
  return window.location.href = "/adminlogin";
}


      const res = await axios.post(
        `${API}/api/admin/superadmin/addadmin`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message || 'New Admin Created');
      setFormData({ adminname: '', email: '', password: '' });
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.msg || 'Error creating admin';
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

          {/* Form + Info */}
          <section className="contact spad">
            <div className="container">
              <div className="row">
                {/* Left Info */}
                <div className="col-lg-6 col-md-6 mb-4">
                  <div className="contact__content">
                    <div className="contact__address">
                      <h5>Super Admin Privileges</h5>
                      <ul>
                        <li>
                          <h6><FaGift style={iconStyle} /> Add New Admin</h6>
                          <ul>
                            <li><FaCheckCircle style={bulletStyle} /> Grant admin-level access</li>
                            <li><FaCheckCircle style={bulletStyle} /> Manage platform users</li>
                          </ul>
                        </li>
                        <li>
                          <h6><FaUser style={iconStyle} /> Control Access</h6>
                          <ul>
                            <li><FaCheckCircle style={bulletStyle} /> Prevent unauthorized creation</li>
                          </ul>
                        </li>
                        <li>
                          <h6><FaHeadphones style={iconStyle} /> Full Oversight</h6>
                          <ul>
                            <li><FaCheckCircle style={bulletStyle} /> 24/7 data visibility</li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Right Form */}
                <div className="col-lg-6 col-md-6">
                  <div className="contact__form">
                    <h5>ADD NEW ADMIN</h5>
                    <form onSubmit={handleSubmit}>
                      <input
                        type="text"
                        name="adminname"
                        placeholder="Admin Name"
                        value={formData.adminname}
                        onChange={handleChange}
                        required
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <button type="submit" className="site-btn">Create Admin</button>
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

export default Addnewadmin;
