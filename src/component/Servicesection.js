import React from 'react';
import { FaCar, FaMoneyBill, FaHeadset, FaLifeRing } from 'react-icons/fa';

const Servicesection = () => {
  const services = [
    {
      icon: <FaCar />,
      title: 'Free Shipping',
      desc: 'On all orders over ₹1000',
    },
    {
      icon: <FaMoneyBill />,
      title: 'Money Back Guarantee',
      desc: 'Refunds for defective goods',
    },
    {
      icon: <FaLifeRing />,
      title: 'Online Support 24/7',
      desc: 'Get help anytime you need',
    },
    {
      icon: <FaHeadset />,
      title: 'Secure Payment',
      desc: '100% safe and encrypted',
    },
  ];

  return (
    <section className="service-section spad" data-aos="fade-up">
      <div className="container">
        <div className="row justify-content-center">
          {services.map((service, index) => (
            <div
              className="col-lg-3 col-md-6 col-sm-12 mb-4"
              key={index}
              data-aos="zoom-in"
              data-aos-delay={index * 150}
            >
              <div className="service-card text-center h-100">
                <div className="icon-wrapper mx-auto mb-3">
                  {service.icon}
                </div>
                <h6 className="service-title">{service.title}</h6>
                <p className="service-desc">{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Servicesection;
