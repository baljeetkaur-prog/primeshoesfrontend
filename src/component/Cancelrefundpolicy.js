import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const iconStyle = { marginRight: '8px', color: '#ca1515' };

const Cancelrefundpolicy = () => {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__links">
                <Link to="/"><FaHome style={iconStyle} /> Home</Link>
                <span>Cancellation & Refund Policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation & Refund Policy Section */}
      <section className="contact spad">
        <div className="container">
          <div className="contact__content">
            <h5 style={{ color: '#000', fontWeight: '600' }}>Cancellation & Refund Policy</h5>
            
            <p style={{ color: '#6c757d', lineHeight: '1.8' }}>
              At <strong>Prime Shoes</strong>, customer satisfaction is our top priority. If you need to cancel your order or request a refund,
              please review our policy below.
            </p>

            <h6 style={{ color: '#000', fontWeight: '600' }}>Order Cancellation</h6>
            <p style={{ color: '#6c757d', lineHeight: '1.8' }}>
              Orders can be cancelled only on the same day of placement before the order is dispatched.
              To cancel an order, please contact our support team as soon as possible.
            </p>

            <h6 style={{ color: '#000', fontWeight: '600' }}>Refund Process</h6>
            <p style={{ color: '#6c757d', lineHeight: '1.8' }}>
              Once we receive a returned product in its original condition, we will process the refund within 3 to 5 business days.
              Refunds will be credited to the original payment method.
            </p>

            <h6 style={{ color: '#000', fontWeight: '600' }}>Return & Exchange</h6>
            <p style={{ color: '#6c757d', lineHeight: '1.8' }}>
              Returns or exchanges are accepted within 7 days of delivery for defective or incorrect items.
              Please ensure the product is unused and in original packaging.
            </p>

            <h6 style={{ color: '#000', fontWeight: '600' }}>Non-refundable Items</h6>
            <p style={{ color: '#6c757d', lineHeight: '1.8' }}>
              Products damaged due to customer misuse or wear and tear are not eligible for refunds.
            </p>

            <h6 style={{ color: '#000', fontWeight: '600' }}>Contact Us</h6>
            <p style={{ color: '#6c757d', lineHeight: '1.8' }}>
              For cancellation or refund requests, please reach out to:
              <br /><br />
              <strong>Email:</strong> cool.aman41@yahoo.com<br />
              <strong>Phone:</strong> +91 99882 06681
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cancelrefundpolicy;
