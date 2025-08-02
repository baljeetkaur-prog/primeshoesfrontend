import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome,
  FaQuestionCircle,
  FaLightbulb,
  FaChevronCircleDown,
  FaPlusCircle,
  FaMinusCircle,
} from 'react-icons/fa';
import Instagram from './Instagram';
import './FAQ.css';

const iconStyle = { marginRight: '8px', color: '#ca1515' };
const bulletStyle = { marginRight: '6px', color: '#ca1515', fontSize: '14px' };
const toggleIconStyle = { marginRight: '10px', fontSize: '16px', color: '#ca1515' };

const faqData = [
  {
    question: 'What is your return policy?',
    answer: 'We offer a 7-day return policy for unused items in original packaging.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Orders are delivered within 3–5 business days across India.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Currently, we ship only within India. International shipping is coming soon.',
  },
  {
    question: 'How do I contact support?',
    answer: 'You can email us at support@primeshoes.in or use the contact form.',
  },
];

const FAQ = () => {
  const [openIndexes, setOpenIndexes] = useState([]);

  const toggleFAQ = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
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
                <span>FAQs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="contact spad">
        <div className="container">
          <div className="row">
            {/* Left - Why FAQs */}
            <div className="col-lg-6 col-md-6">
              <div className="contact__content">
                <div className="contact__address">
                  <h5>Why Read Our FAQs?</h5>
                  <ul>
                    <li>
                      <h6><FaQuestionCircle style={iconStyle} /> Quick Help</h6>
                      <ul>
                        <li><FaChevronCircleDown style={bulletStyle} /> Answers to common questions</li>
                        <li><FaChevronCircleDown style={bulletStyle} /> Save time before contacting support</li>
                      </ul>
                    </li>
                    <li>
                      <h6><FaLightbulb style={iconStyle} /> Learn More</h6>
                      <ul>
                        <li><FaChevronCircleDown style={bulletStyle} /> How our process works</li>
                        <li><FaChevronCircleDown style={bulletStyle} /> Understand shipping, returns & more</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right - Collapsible FAQs */}
            <div className="col-lg-6 col-md-6">
              <div className="contact__form">
                <h5>Frequently Asked Questions</h5>
                {faqData.map((faq, index) => {
                  const isOpen = openIndexes.includes(index);
                  return (
                    <div
                      key={index}
                      className={`faq__toggle-item ${isOpen ? 'open' : ''}`}
                    >
                      <div
                        className="faq__toggle-header"
                        onClick={() => toggleFAQ(index)}
                      >
                        {isOpen ? (
                          <FaMinusCircle style={toggleIconStyle} />
                        ) : (
                          <FaPlusCircle style={toggleIconStyle} />
                        )}
                        <span>{faq.question}</span>
                      </div>
                      <div className="faq__toggle-body">
                        {faq.answer}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Instagram />
    </div>
  );
};

export default FAQ;
