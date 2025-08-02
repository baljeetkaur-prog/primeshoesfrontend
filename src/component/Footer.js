import React from 'react';
import {
  FaFacebook,
  FaYoutube,
  FaInstagram,
  FaHeart,
  FaSnapchatGhost
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const handleProtectedClick = () => {
    toast.info('Please login first');
    navigate('/login');
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          {/* About Section */}
          <div className="col-lg-3 col-md-6 col-sm-7">
            <div className="footer__about">
              <div className="footer__logo">
                <a href="/">
                  <img src="/img/logo.png" alt="Logo" />
                </a>
              </div>
              <p>
                Walk bold. Walk Prime. <br />
                Footwear that makes a statement.
              </p>
              <div className="footer__payment">
                <a
                  href="https://razorpay.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/img/razorpay.png"
                    alt="Razorpay"
                    style={{ height: '40px' }}
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-3 col-sm-5">
            <div className="footer__widget">
              <h6>Quick links</h6>
              <ul>
                <li><a href="/about">About</a></li>
                <li>
                  <a href="#" onClick={() => navigate('/contact')}>
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => navigate('/faq')}>
                    FAQ
                  </a>
                </li>
                 <li>
                  <a href="#" onClick={() => navigate('/privacypolicy')}>
                    Privacy Policy
                  </a>
                </li>
                    <li>
                  <a href="#" onClick={() => navigate('/pricingpolicy')}>
                    Pricing
                  </a>
                </li>
                    <li>
                  <a href="#" onClick={() => navigate('/cancelrefundpolicy')}>
                    Cancellation/Refund Policy
                  </a>
                </li>
                    <li>
                  <a href="#" onClick={() => navigate('/termsconditions')}>
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Account Links */}
          <div className="col-lg-2 col-md-3 col-sm-4">
            <div className="footer__widget">
              <h6>Account</h6>
              <ul>
                <li><a href="#" onClick={handleProtectedClick}>My Account</a></li>
                <li><a href="#" onClick={handleProtectedClick}>Orders Tracking</a></li>
                <li><a href="#" onClick={handleProtectedClick}>Checkout</a></li>
              </ul>
            </div>
          </div>

          {/* Store Info */}
          <div className="col-lg-2 col-md-4 col-sm-6">
            <div className="footer__widget">
              <h6>Store Info</h6>
              <p>Location: Phagwara, Punjab</p>
              <p>Mon–Sat: 10AM – 8PM</p>
              <p>Sunday: Closed</p>
              <p>Phone: +91-98765-43210</p>
            </div>
          </div>

          {/* Newsletter & Social */}
          <div className="col-lg-3 col-md-8 col-sm-8">
            <div className="footer__newslatter">
              <div className="footer__social">
                <a
                  href="https://www.instagram.com/prime.shoes.phagwara"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://www.youtube.com/@primeshoesphg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaYoutube />
                </a>
                <a
                  href="https://www.facebook.com/primeshoesphagwara"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://www.snapchat.com/add/primeshoesphg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaSnapchatGhost />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="row">
          <div className="col-lg-12">
            <div className="footer__copyright__text">
              <p>
                Copyright &copy; {currentYear} Prime Shoes. All rights reserved | Made with <FaHeart /> by{' '}
                <a href="https://colorlib.com/" target="_blank" rel="noreferrer">
                  Colorlib
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
