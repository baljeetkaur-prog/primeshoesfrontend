import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { encryptToken } from '../utils/securetoken';
import { decryptToken } from '../utils/securetoken';
import { dataContext } from '../App'; 


import 'swiper/css';
import 'swiper/css/navigation';
import './Productdetail.css'; // Your custom CSS
import Instagram from './Instagram';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const API = process.env.REACT_APP_APIURL;
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
const [selectedSize, setSelectedSize] = useState(null);
const { fetchCartCount } = useContext(dataContext);
const navigate = useNavigate();
 const [modalImage, setModalImage] = useState(null);
 const [relatedProducts, setRelatedProducts] = useState([]);
 useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}, []);



useEffect(() => {
  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API}/api/products/${id}`);
      setProduct(res.data);

      // Fetch related products by category (exclude current product)
      if (res.data.category) {
        const relatedRes = await axios.get(`${API}/api/products/category/${encodeURIComponent(res.data.category)}`);
        // Filter out current product from related list if present
        const filteredRelated = relatedRes.data.filter(p => p._id !== id);

        // Limit to 9 related products only
        setRelatedProducts(filteredRelated.slice(0, 9));
      } else {
        setRelatedProducts([]);
      }

    } catch (err) {
      console.error("Product not found", err);
    }
  };
  fetchProduct();
}, [id]);

const handleAddToCart = async () => {
  // Require color selection if applicable
if (product.colors?.filter(c => c.trim() !== '').length > 0 && !selectedColor) {
  setTimeout(()=>{
  toast.warn("Please select a color before adding to cart.");
},0);
  return;
}


  // Require size selection if applicable
if (product.sizes?.filter(size => size.trim() !== '').length > 0 && !selectedSize) {
  setTimeout(() => {
    toast.warn("Please select a size before adding to cart.");
  }, 0);
  return;
}


  try {
    const uinfo = JSON.parse(sessionStorage.getItem("uinfo"));
    const tokenObj = localStorage.getItem("token");

    if (!uinfo || !tokenObj) {
      toast.warning("Please login to add items to cart.");
     navigate("/login", { state: { from: window.location.pathname } });
    }

    const token = await decryptToken(tokenObj);

    const payload = {
      email: uinfo.email,
      productId: product._id,
      title: product.title,
      image: product.mainImage,
      quantity,
      discountPrice: product.discountedPrice,
      color: selectedColor || null,
      size: selectedSize || null
    };

    const res = await axios.post(`${API}/api/addtocart`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    if (res.data.success) {
      toast.success("Product added to cart!");
      fetchCartCount(uinfo.email);
      navigate("/cart");
    } else {
      toast.error(res.data.message || "Failed to add to cart.");
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};

const handleBuyNow = () => {
  // Require color selection if applicable
  if (product.colors?.filter(c => c.trim() !== '').length > 0 && !selectedColor) {
    setTimeout(() => {
      toast.warn("Please select a color before buying.");
    }, 0);
    return; // ✅ Prevent further execution
  }

  // Require size selection if applicable
  if (product.sizes?.filter(size => size.trim() !== '').length > 0 && !selectedSize) {
    setTimeout(() => {
      toast.warn("Please select a size before buying.");
    }, 0);
    return; // ✅ Prevent further execution
  }

  const uinfo = JSON.parse(sessionStorage.getItem("uinfo"));
  const tokenObj = localStorage.getItem("token");

  if (!uinfo || !tokenObj) {
    toast.warning("Please login to continue.");
    navigate("/login", { state: { from: window.location.pathname } });
    return; // ✅ Prevent navigation to checkout
  }

  const selectedItem = {
    productId: product._id,
    title: product.title,
    image: product.mainImage,
    quantity,
    color: selectedColor || null,
    size: selectedSize || null,
    originalPrice: product.originalPrice,
    discountPrice: product.discountedPrice
  };

  sessionStorage.setItem("buyNowItem", JSON.stringify(selectedItem));
  sessionStorage.setItem("buyNowMode", "true");

  navigate("/checkout");
};







  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__links">
                <Link to="/"><i className="fa fa-home"></i> Home</Link>
                <span>{product ? product.title : "Product Details"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
     <section className="product-details spad product-compact">
        <div className="container">
          <div className="row">
            {/* Left Column - Images */}
            <div className="col-lg-6">
              {product && (
                <div className="product__details__pic image-layout-wrapper">
                  
                  {/* Thumbnails vertically on left */}
                 <div className="vertical-thumbs">
  {product.otherImages && product.otherImages.length > 0 && (
    <>
      {/* Show mainImage as first thumbnail */}
      <img
        src={`/uploads/${product.mainImage}`}
        alt="main-thumb"
        className="thumb-img"
        onClick={() => {
          const swiper = document.querySelector('.custom-product-swiper')?.swiper;
          if (swiper) swiper.slideToLoop(0); // Main image is the first slide
        }}
      />

      {/* Then show otherImages */}
      {product.otherImages.map((img, i) => (
        <img
          key={i}
          src={`/uploads/${img}`}
          alt={`thumb-${i}`}
          className="thumb-img"
          onClick={() => {
            const swiper = document.querySelector('.custom-product-swiper')?.swiper;
            if (swiper) swiper.slideToLoop(i + 1); // Offset by 1 due to main image
          }}
        />
      ))}
    </>
  )}
</div>


                  {/* Main Swiper */}
                  <div className="product__details__slider__content flex-grow-1">
                    <Swiper
                      modules={[Navigation]}
                      navigation
                      className="custom-product-swiper"
                      loop
                    >
                      {[product.mainImage, ...(product.otherImages || [])].map((img, i) => (
                        <SwiperSlide key={i}>
                          <img
                            className="product__big__img"
                            src={`/uploads/${img}`}
                            alt={`Product ${i}`}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Info */}
            <div className="col-lg-6">
              {product ? (
                <div className="product__details__text">
                 <h3>
  {product.title}
  <span> Brand: {product.brand?.trim() || "Prime Shoes"}</span>
</h3>
                {typeof product.rating === 'number' && typeof product.numReviews === 'number' && (
  <div className="rating">
    {[...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`fa fa-star${i < (product.rating || 5) ? '' : '-o'}`}
        style={{ color: '#FFD700' }}
      ></i>
    ))}
   {product.numReviews > 0 && (
  <span>({product.numReviews} reviews)</span>
)}
  </div>
)}


               <div className="product__details__price">
  ₹{product.discountedPrice?.toFixed(1)}
  {product.originalPrice > product.discountedPrice && (
    <span>₹{product.originalPrice?.toFixed(1)}</span>
  )}
</div>
                  {product.promoCode && product.promoDiscountPercent > 0 && (
  <div className="promo-code-info" style={{ fontSize: '14px', color: 'rgb(35, 187, 117)', fontWeight: 500}}>
    Eligible for an exclusive discount at checkout!
  </div>
)}

                {product.description && (
  <p className="product__details__description">
    {product.description
      .split('.')
      .slice(0, 3)
      .map((line, index) =>
        line.trim() ? (
          <span key={index}>
            • {line.trim()}.
            <br />
          </span>
        ) : null
      )}
  </p>
)}

<div className="product__details__button">
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      rowGap: '20px',
    }}
  >
    {/* Quantity Section */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <span><strong>Quantity:</strong></span>
      <div className="pro-qty">
        <button
          className="qty-btn"
          onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
        >
          -
        </button>
        <input type="text" value={quantity} readOnly />
        <button
          className="qty-btn"
          onClick={() => setQuantity(prev => prev + 1)}
        >
          +
        </button>
      </div>
    </div>

    {/* Buttons Section */}
    <div
      style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
      }}
    >
      {product.quantity > 1 ? (
        <>
          <a
            href="#"
            className="cart-btn"
            style={{ minWidth: '140px', textAlign: 'center' }}
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart();
            }}
          >
            <span className="icon_bag_alt"></span> Add to cart
          </a>

          <a
            href="#"
            className="cart-btn"
            style={{ minWidth: '140px', textAlign: 'center' }}
            onClick={(e) => {
              e.preventDefault();
              handleBuyNow();
            }}
          >
            <span className="icon_bag_alt"></span> Buy Now
          </a>
        </>
      ) : (
        <p style={{ color: '#ca1515', fontWeight: '600' }}>
          This product is currently out of stock.
        </p>
      )}
    </div>
  </div>
</div>




                  <div className="product__details__widget">
  <ul>
    {/* Availability */}
    <li>
      <span>Availability:</span>
      <p style={{ display: 'inline-block', marginLeft: '8px', fontWeight: '600' }}>
        {product.quantity > 0 ? "In Stock" : "Out of Stock"}
      </p>
    </li>

    {/* Colors - Only show if available */}
{/* Colors - Only show if available and not blank */}
{product.colors && product.colors.filter(c => c.trim() !== '').length > 0 && (
  <li>
    <span>Colors:</span>
    <p style={{ display: 'inline-block', marginLeft: '8px', marginBottom: '0' }}>
      {product.colors
        .filter(color => color.trim() !== '')
        .map((color, idx) => (
          <label
            key={idx}
            onClick={() => setSelectedColor(color)}
            className={selectedColor === color ? 'active' : ''}
            style={{
              textTransform: 'capitalize',
              fontSize: '14px',
              color: selectedColor === color ? '#ca1515' : '#666666',
              fontWeight: selectedColor === color ? '600' : '400',
              marginRight: '10px',
              cursor: 'pointer',
            }}
          >
            <input type="radio" name="color" value={color} hidden />
            {color}
          </label>
        ))}
    </p>
  </li>
)}






    {/* Sizes - Only show if available */}
{product.sizes && product.sizes.filter(size => size.trim() !== '').length > 0 && (
  <li style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
  <span style={{ fontWeight: 600 }}>Sizes:</span>
  <p style={{ margin: 0, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>

      {product.sizes.map((size, idx) => (
        <label
          key={idx}
          onClick={() => setSelectedSize(size)}
          className={selectedSize === size ? 'active' : ''}
          style={{
            textTransform: 'uppercase',
            fontSize: '14px',
            color: selectedSize === size ? '#ca1515' : '#666666',
            fontWeight: selectedSize === size ? '600' : '400',
            marginRight: '10px',
            cursor: 'pointer',
          }}
        >
          <input type="radio" name="size" value={size} hidden />
          {size}
        </label>
      ))}
    </p>
  </li>
)}





  </ul>
</div>

                </div>
              ) : (
                <p>Loading product details...</p>
              )}
            </div>

            {/* Tabs Section */}
            <div className="col-lg-12">
              <div className="product__details__tab">
                <ul className="nav nav-tabs" role="tablist">
                  {['Description', 'Specification', 'Reviews'].map((tab, index) => (
                    <li key={index} className="nav-item">
                      <a
                        className={`nav-link ${index === 0 ? 'active' : ''}`}
                        data-toggle="tab"
                        href={`#tabs-${index + 1}`}
                        role="tab"
                      >
                        {tab}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="tab-content">
                 <div className="tab-content">
  {/* Description Tab */}
  <div className="tab-pane active" id="tabs-1" role="tabpanel">
    <h6>Description</h6>
    <p>{product?.description || 'No description available.'}</p>
  </div>

  {/* Specification Tab */}
  <div className="tab-pane" id="tabs-2" role="tabpanel">
    <h6>Specifications</h6>
    {product?.specifications ? (
<p className="product__details__description">
  {product.specifications
    .split(',')
    .map((spec, index) =>
      spec.trim() ? (
        <span key={index}>
          • {spec.trim()}
          <br />
        </span>
      ) : null
    )}
</p>


    ) : (
      <p>No specifications provided.</p>
    )}
  </div>

  {/* Reviews Tab */}
 <div className="tab-pane" id="tabs-3" role="tabpanel">
        <h6>Reviews</h6>
        {product?.reviews && product.reviews.length > 0 ? (
          <div className="reviews-list">
            {product.reviews.map((review, index) => (
              <div key={index} className="single-review" style={{ borderBottom: '1px solid #ddd', padding: '12px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* User picture if available */}
                  {review.image ? (
                    <img
  src={`/uploads/reviews/${review.image}`}
  alt={review.name}
  style={{ 
    width: '70px',           // wider than height for rectangle
    height: '80px',          // same height
    borderRadius: '4px',     // small rounded corners or 0 for sharp corners
    objectFit: 'cover', 
    cursor: 'pointer' 
  }}
  onClick={() => setModalImage(`/uploads/reviews/${review.image}`)}
/>
                  ) : (
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#ccc' }} />
                  )}
                  <div>
                    <strong>{review.name}</strong>
                    <br />
                    <small style={{ color: '#666' }}>{new Date(review.createdAt).toLocaleDateString()}</small>
                  </div>
                </div>

                {/* Star rating */}
                <div style={{ marginTop: '8px' }}>
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fa fa-star${i < review.rating ? '' : '-o'}`}
                      style={{ color: '#FFD700', marginRight: '2px' }}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p style={{ marginTop: '8px' }}>{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews yet.</p>
        )}

        {/* Modal Overlay for review image */}
        {modalImage && (
          <div
            onClick={() => setModalImage(null)} // clicking outside closes modal
            style={{
              position: 'fixed',
              top: 0, left: 0,
              width: '100vw', height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999,
              cursor: 'pointer',
            }}
          >
            <img
              src={modalImage}
              alt="Review Large"
              onClick={e => e.stopPropagation()} // prevent closing modal when clicking image
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                borderRadius: '8px',
                boxShadow: '0 0 10px rgba(255,255,255,0.5)',
              }}
            />
            {/* Close button */}
            <button
              onClick={() => setModalImage(null)}
              style={{
                position: 'fixed',
                top: '20px',
                right: '30px',
                fontSize: '24px',
                color: '#fff',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                zIndex: 10000,
              }}
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
        )}
      </div>

</div>

                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
         {/* Related Products */}
<div className="row">
  <div className="col-lg-12 text-center">
    <div className="related__title">
      <h5>RELATED PRODUCTS</h5>
    </div>
  </div>

  {/* Related Products */}
  {relatedProducts.length > 0 ? (
    relatedProducts.map((prod) => (
      <div key={prod._id} className="col-lg-3 col-md-4 col-sm-6 mb-3 px-2">
        <div className="product__item">
          <div className="product__item__pic">
            {/* Wrap image with Link */}
            <Link to={`/proddetail/${prod._id}`}>
              <img
                src={`/uploads/${prod.mainImage}`}
                alt={prod.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </Link>

            {/* Optional Labels */}
            {prod.isNew && <div className="label new">New</div>}
            {prod.quantity === 0 && <div className="label stockout">Out of Stock</div>}

            <ul className="product__hover">
              <li>
                <Link to={`/proddetail/${prod._id}`}>
                  <span className="arrow_expand"></span>
                </Link>
              </li>
              <li>
                <Link to={`/proddetail/${prod._id}`}>
                  <span className="icon_bag_alt"></span>
                  </Link>
              </li>
            </ul>
          </div>

          <div className="product__item__text">
            <h6>
             <Link to={`/proddetail/${prod._id}`} title={prod.title}>
  {prod.title.length > 35 ? prod.title.substring(0, 35) + '...' : prod.title}
</Link>
            </h6>
          <div className="rating">
  {[...Array(5)].map((_, star) => (
    <i
      key={star}
      className={`fa fa-star${star < (typeof prod.rating === 'number' && prod.numReviews > 0 ? prod.rating : 5) ? '' : '-o'}`}
      style={{ color: '#FFD700' }}
    ></i>
  ))}
</div>

            <div className="product__price" style={{fontSize: '16px'}}>₹{prod.discountedPrice?.toFixed(1)}</div>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p className="text-center w-100">No related products found.</p>
  )}
</div>


        </div>
      </section>
      <Instagram/>
    </>
  );
};

export default ProductDetail;
