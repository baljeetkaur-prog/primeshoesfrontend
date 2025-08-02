import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserShield } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const Adminregister = () => {
  const [formData, setFormData] = useState({
    adminname: '',
    email: '',
    password: '',
  });

  const API = process.env.REACT_APP_APIURL;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/adminregister`, formData);
      toast.success(res.data.message || 'Admin registered successfully');
      setFormData({ adminname: '', email: '', password: '' });
      navigate('/adminlogin');
    } catch (err) {
      const message = err.response?.data?.details || 'Something went wrong';
      toast.error(message);
    }
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #ca1515, #a60d0d)', minHeight: '100vh' }}>
      <div style={centerWrapperStyle}>
        <div className="admin-register-form" style={formWrapperStyle}>
          <h4 style={formTitleStyle}>
            <FaUserShield style={{ marginRight: '6px' }} />
            Admin Registration
          </h4>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="adminname"
              placeholder="Admin Name"
              value={formData.adminname}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <button type="submit" className="site-btn" style={buttonStyle}>
              Register
            </button>
          </form>
          <br />
          <p className="mt-4 text-center" style={{ color: '#000', fontSize: '14px' }}>
            Already an admin?{' '}
            <Link to="/adminlogin" style={{ color: '#ca1515', textDecoration: 'underline' }}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const centerWrapperStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  padding: '20px',
};

const formWrapperStyle = {
  background: '#fff',
  padding: '30px',
  borderRadius: '16px',
  maxWidth: '500px',
  width: '100%',
  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  color: '#000',
};

const formTitleStyle = {
  textAlign: 'center',
  marginBottom: '25px',
  fontSize: '22px',
  fontWeight: 'bold',

};

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  marginBottom: '15px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  fontSize: '15px',
  backgroundColor: '#fff',
  color: '#000',
  outline: 'none',
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#ca1515',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer',
  marginTop: '5px',
  transition: 'background-color 0.3s ease, color 0.3s ease',
};

export default Adminregister;
