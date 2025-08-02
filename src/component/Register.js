import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGift, FaUser, FaHeadphones, FaHome, FaCheckCircle } from 'react-icons/fa';
import Instagram from './Instagram';
import axios from 'axios';
import { encodePayload } from '../utils/encode';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const iconStyle = { marginRight: '8px', color: '#ca1515' };
const bulletStyle = { marginRight: '6px', color: '#ca1515', fontSize: '12px' };

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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
    const encoded = encodePayload(formData);
    const res = await axios.post(`${API}/api/auth/register`, { payload: encoded });

    toast.success(res.data.message || 'Registration successful');
    setFormData({ name: '', email: '', phone: '', password: '' });

    // ✅ Redirect to login after toast
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  } catch (err) {
    const message =
      err.response?.data?.message || 'Something went wrong. Please try again.';
    toast.error(message);
  }
};

  return (
    <div>

      {/* Breadcrumb Section */}
      <div className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__links">
                <Link to="/"><FaHome style={iconStyle} /> Home</Link>
                <span>Register</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Register Section */}
      <section className="contact spad">
        <div className="container">
          <div className="row">
            {/* Left - Info */}
            <div className="col-lg-6 col-md-6">
              <div className="contact__content">
                <div className="contact__address">
                  <h5>Why Join Us?</h5>
                  <ul>
                    <li>
                      <h6><FaGift style={iconStyle} /> Member Benefits</h6>
                      <ul>
                        <li><FaCheckCircle style={bulletStyle} /> Exclusive member-only offers</li>
                        <li><FaCheckCircle style={bulletStyle} /> Faster checkout experience</li>
                      </ul>
                    </li>
                    <li>
                      <h6><FaUser style={iconStyle} /> Personalized Experience</h6>
                      <ul>
                        <li><FaCheckCircle style={bulletStyle} /> Curated recommendations</li>
                        <li><FaCheckCircle style={bulletStyle} /> Save preferences & addresses</li>
                      </ul>
                    </li>
                    <li>
                      <h6><FaHeadphones style={iconStyle} /> 24/7 Support</h6>
                      <ul>
                        <li><FaCheckCircle style={bulletStyle} /> Real-time order help</li>
                        <li><FaCheckCircle style={bulletStyle} /> Priority resolutions</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right - Register Form */}
            <div className="col-lg-6 col-md-6">
              <div className="contact__form">
                <h5>CREATE ACCOUNT</h5>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
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
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
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
                  <button type="submit" className="site-btn">Register</button><br /><br />
                </form>
                <p className="mt-3">Already have an account? <Link to="/login">Login here</Link></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Instagram />
    </div>
  );
};

export default Register;
