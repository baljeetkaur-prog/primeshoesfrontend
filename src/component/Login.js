import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaLock,
  FaEnvelope,
  FaSignInAlt,
  FaRocket,
  FaUserShield,
  FaCheckCircle,
} from 'react-icons/fa';
import Instagram from './Instagram';
import axios from 'axios';

import { encodePayload } from '../utils/encode';
import { encryptToken } from '../utils/securetoken';
import { UserContext } from '../App';
import { toast } from 'react-toastify';

const iconStyle = { marginRight: '8px', color: '#ca1515' };
const bulletStyle = { marginRight: '6px', color: '#ca1515', fontSize: '12px' };

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const API = process.env.REACT_APP_APIURL;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const encoded = encodePayload(formData);
      const res = await axios.post(`${API}/api/auth/login`, { payload: encoded });

      toast.success(res.data.message || 'Login successful');

      const rawToken = atob(res.data.token);
      const encrypted = await encryptToken(rawToken);
      localStorage.setItem('token', encrypted);

      setUser({
        name: res.data.user.name,
        email: res.data.user.email,
        phone: res.data.user.phone,
        usertype: 'user',
      });

      setFormData({ email: '', password: '' });

      const redirectPath = location.state?.from || '/';
      navigate(redirectPath);
    } catch (err) {
      const message =
        err.response?.data?.message || 'Invalid credentials. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__links">
                <Link to="/"><FaHome style={iconStyle} /> Home</Link>
                <span>Login</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Section */}
      <section className="contact spad">
        <div className="container">
          <div className="row">
            {/* Left - Why Login Info */}
            <div className="col-lg-6 col-md-6">
              <div className="contact__content">
                <div className="contact__address">
                  <h5>Welcome Back!</h5>
                  <ul>
                    <li>
                      <h6><FaSignInAlt style={iconStyle} /> Easy Account Access</h6>
                      <ul>
                        <li><FaCheckCircle style={bulletStyle} /> Manage orders & profile</li>
                        <li><FaCheckCircle style={bulletStyle} /> View purchase history</li>
                      </ul>
                    </li>
                    <li>
                      <h6><FaRocket style={iconStyle} /> Faster Shopping</h6>
                      <ul>
                        <li><FaCheckCircle style={bulletStyle} /> Quicker checkout process</li>
                        <li><FaCheckCircle style={bulletStyle} /> Save your preferences</li>
                      </ul>
                    </li>
                    <li>
                      <h6><FaUserShield style={iconStyle} /> Secure Access</h6>
                      <ul>
                        <li><FaCheckCircle style={bulletStyle} /> Encrypted login</li>
                        <li><FaCheckCircle style={bulletStyle} /> Safe & private experience</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right - Login Form */}
            <div className="col-lg-6 col-md-6">
              <div className="contact__form">
                <h5>LOGIN TO YOUR ACCOUNT</h5>
                <form onSubmit={handleSubmit}>
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
                  <button type="submit" className="site-btn">Login</button><br /><br />
                </form>
                <p className="mt-3">
                  Don't have an account? <Link to="/register">Register here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Instagram />
    </div>
  );
};

export default Login;
