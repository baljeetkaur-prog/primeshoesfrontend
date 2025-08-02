import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const filters = ['All', 'Women’s', 'Men’s', 'Kid’s', 'Handbags', 'Accessories'];

const categoryMap = {
  'All': '*',
  'Women’s': 'women',
  'Men’s': 'men',
  'Kid’s': 'kids',
  'Handbags': 'handbags',
  'Accessories': 'accessories'
};

const Productsection = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [products, setProducts] = useState([]);
  const [modalImage, setModalImage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const API = process.env.REACT_APP_APIURL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const selectedKey = categoryMap[activeFilter];
        const categoryParam = selectedKey && selectedKey !== '*' ? `?category=${selectedKey}` : '';
        const res = await axios.get(`${API}/api/latest${categoryParam}`);
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, [API, activeFilter]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const elements = document.querySelectorAll('.set-bg');
      elements.forEach((el) => {
        const bg = el.getAttribute('data-setbg');
        el.style.backgroundImage = `url(${bg})`;
      });
    }, 0);

    return () => clearTimeout(timeout);
  }, [products]);

  return (
    <section className="product spad">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-4">
          <div className="section-title" data-aos="fade-right">
  <h4>New Products</h4>
</div>
          </div>
          <div className="col-lg-8 col-md-8">
            <ul className="filter__controls">
              {filters.map((filter) => (
                <li
                  key={filter}
                  className={activeFilter === filter ? 'active' : ''}
                  onClick={() => setActiveFilter(filter)}
                  style={{ cursor: 'pointer' }}
                >
                  {filter}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="row property__gallery">
          
         {products.map((product, index) => (
  <div
    key={product._id}
    className={`col-lg-3 col-md-4 col-sm-6 mix ${product.category}`}
    data-aos="fade-up"
    data-aos-delay={`${index * 100}`} // Incremental delay
  >
    <div className={`product__item ${product.label === 'Sale' ? 'sale' : ''}`}>
      <Link to={`/proddetail/${product._id}`}>
        <div
          className="product__item__pic set-bg"
          data-setbg={`/uploads/${product.mainImage}`}
        >
          {(product.quantity <= 1 || product.label === 'Out Of Stock') ? (
            <div className="label stockout stockblue">Out Of Stock</div>
          ) : (
            product.label && (
              <div className={`label ${product.label.toLowerCase().replace(/ /g, '')}`}>
                {product.label}
              </div>
            )
          )}

          <ul className="product__hover">
            <li>
              <a
                href="#!"
                onClick={(e) => {
                  e.preventDefault();
                  setModalImage(`/uploads/${product.mainImage}`);
                  setShowModal(true);
                }}
              >
                <span className="arrow_expand"></span>
              </a>
            </li>
            {product.quantity > 1 && product.label !== 'Out Of Stock' && (
              <li>
                <a href="#"><span className="icon_bag_alt"></span></a>
              </li>
            )}
          </ul>
        </div>
      </Link>

      <div className="product__item__text">
        <h6>
          <Link to={`/proddetail/${product._id}`}>
            {product.title.length > 35
              ? product.title.substring(0, 35) + '...'
              : product.title}
          </Link>
        </h6>
        <div className="rating">
          {[...Array(5)].map((_, i) => (
            <i
              key={i}
              className={`fa fa-star${i < (product.rating || 5) ? '' : '-o'}`}
            ></i>
          ))}
        </div>
        <div className="product__price">
          ₹{product.discountedPrice}
          {product.originalPrice > product.discountedPrice && (
            <span>₹{product.originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  </div>
))}

          {products.length === 0 && (
            <div className="col-12 text-center mt-4">
              <p>No products found in this category.</p>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Shared Modal */}
      {showModal && (
        <div className="image-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={modalImage} alt="Zoomed" />
            <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Productsection;
