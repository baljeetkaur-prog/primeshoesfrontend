import React from 'react';
import { FaInstagram } from 'react-icons/fa';

const instagramImages = [
  '/img/footer1.jpg',
  '/img/footer2.jpg',
  '/img/footer3.jpg',
  '/img/footer4.jpg',
  '/img/footer5.jpg',
  '/img/footer6.jpg',
];

const Instagram = () => {
  return (
    <div className="instagram">
      <div className="container-fluid px-2"> {/* small padding */}
        <div className="row g-0"> {/* removes gaps between cols */}
          {instagramImages.map((img, index) => (
            <div
              className="col-lg-2 col-md-4 col-6 p-1" // better breakpoints for mobile
              key={index}
            >
              <div
                className="instagram__item"
                style={{
                  backgroundImage: `url(${img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '200px',
                  position: 'relative',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div className="instagram__text">
                  <FaInstagram />
                  <a href="#" className="insta-link">
                    @ Prime_Shoes
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Instagram;
