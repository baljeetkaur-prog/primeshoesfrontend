import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Categories = () => {
  const [counts, setCounts] = useState({});
  const API = process.env.REACT_APP_APIURL;

  // ✅ AOS Init
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  // ✅ Set background images + Refresh AOS
  useEffect(() => {
    const setBgElements = document.querySelectorAll('.set-bg');
    setBgElements.forEach(el => {
      const bg = el.getAttribute('data-setbg');
      if (bg) {
        el.style.backgroundImage = `url(${bg})`;
      }
    });

    AOS.refresh(); // ✅ Important when backgrounds are set dynamically
  }, []);

  // ✅ Fetch category counts
  useEffect(() => {
    axios.get(`${API}/api/category-counts`)
      .then(res => setCounts(res.data))
      .catch(err => console.error('Failed to fetch counts', err));
  }, []);

  return (
    <section className="categories">
      <div className="container-fluid">
        <div className="row">

          {/* Left Large Banner */}
          <div className="col-lg-6 p-0">
            <div
              className="categories__item categories__large__item set-bg"
              data-setbg="/img/categories/category11.jpg"
              data-aos="fade-right"
            >
              <div className="categories__text">
                <h1>Women Fashion</h1>
                <p>
                  Discover styles that blend elegance and <br />
                  comfort only at Prime Shoes.
                </p>
                <p>{counts['women'] || 0} items</p>
                <Link to="/products?category=women">Shop now</Link>
              </div>
            </div>
          </div>

          {/* Right 4 Smaller Cards */}
          <div className="col-lg-6">
            <div className="row">
              {[
                { title: "Men Fashion", key: "men", bg: "/img/categories/category2.jpg" },
                { title: "Kids Wear", key: "kids", bg: "/img/categories/category3.jpg" },
                { title: "Hand Bags", key: "handbags", bg: "/img/categories/category4.jpg" },
                { title: "Accessories", key: "accessories", bg: "/img/categories/category5.jpg" },
              ].map((category, index) => (
                <div className="col-lg-6 col-md-6 col-sm-6 p-0" key={index}>
                  <div
                    className="categories__item set-bg"
                    data-setbg={category.bg}
                    data-aos={index % 2 === 0 ? 'fade-up' : 'fade-down'}
                    data-aos-delay={`${index * 100}`} // ✅ Correct format for delay
                  >
                    <div className="categories__text">
                      <h4>{category.title}</h4>
                      <p>{counts[category.key] || 0} items</p>
                      <Link to={`/products?category=${category.key}`}>Shop now</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Categories;
