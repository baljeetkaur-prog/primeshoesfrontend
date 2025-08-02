import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Trends = () => {
  const [trends, setTrends] = useState({
    newArrivals: [],
    trendingNow: [],
    justLaunched: [],
  });

  const API = process.env.REACT_APP_APIURL;

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const { data } = await axios.get(`${API}/api/trendproducts`);
        setTrends({
          newArrivals: data.newArrivals.slice(0, 4),
          trendingNow: data.trendingNow.slice(0, 4),
          justLaunched: data.justLaunched.slice(0, 4),
        });
      } catch (err) {
        console.error('Error fetching trend data:', err);
      }
    };
    fetchTrends();
  }, [API]);

  const renderItems = (items) =>
    items.map((item, index) => {
      const imageUrl = item.mainImage
        ? `${API}/uploads/${item.mainImage}`
        : '/default.png';

      return (
        <div className="trend__item mb-3" key={index}>
          <Link to={`/proddetail/${item._id}`}>
            <div className="trend__item__pic">
              <img
                src={imageUrl}
                alt={item.title || 'Product'}
                className="img-fluid"
                style={{
                  objectFit: 'cover',
                  height: '350px',
                  width: '100%',
                  borderRadius: '8px',
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default.png';
                }}
              />
            </div>
          </Link>
          <div className="trend__item__text">
            <h6>
              <Link
                to={`/proddetail/${item._id}`}
                style={{ color: '#000', textDecoration: 'none' }}
              >
                {item.title.length > 35 ? item.title.substring(0, 35) + '...' : item.title}
              </Link>
            </h6>
            <div className="rating">
              {[...Array(5)].map((_, i) => (
                <i className="fa fa-star" key={i}></i>
              ))}
            </div>
            <div className="product__price">
              {item.discountedPrice && item.discountedPrice !== item.originalPrice ? (
                <>
                  <span style={{ textDecoration: 'line-through', color: '#999', marginRight: '8px' }}>
                    ₹{item.originalPrice}
                  </span>
                  <span style={{ color: 'rgb(202, 21, 21)', fontWeight: '600' }}>
                    ₹{item.discountedPrice}
                  </span>
                </>
              ) : (
                <span>₹{item.originalPrice}</span>
              )}
            </div>
          </div>
        </div>
      );
    });

  return (
    <section className="trend spad">
      <div className="container">
        <div className="row">
          {/* New Arrivals */}
          <div className="col-lg-4 col-md-4 col-12 trend-col">
            <div className="trend__content">
              <div className="section-title">
                <h4>New Arrivals</h4>
              </div>
              {renderItems(trends.newArrivals)}
            </div>
          </div>

          {/* Trending Now */}
          <div className="col-lg-4 col-md-4 col-12 trend-col">
            <div className="trend__content">
              <div className="section-title">
                <h4>Trending Now</h4>
              </div>
              {renderItems(trends.trendingNow)}
            </div>
          </div>

          {/* Just Launched */}
          <div className="col-lg-4 col-md-4 col-12 trend-col">
            <div className="trend__content">
              <div className="section-title">
                <h4>Just Launched</h4>
              </div>
              {renderItems(trends.justLaunched)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trends;
