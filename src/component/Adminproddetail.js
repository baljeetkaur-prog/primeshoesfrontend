import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import Adminsidebar from './Adminsidebar';
import { decryptToken } from '../utils/securetoken'; 

const Adminproddetail = () => {
  const { id } = useParams();
  const API = process.env.REACT_APP_APIURL;
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [adminName, setAdminName] = useState('Admin User');

useEffect(() => {
  const fetchProduct = async () => {
    try {
      const encoded = sessionStorage.getItem('adminToken');
      const token = encoded ? await decryptToken(encoded) : null;

      const res = await axios.get(`${API}/api/adminproducts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProduct(res.data);
      setSelectedImage(res.data.mainImage);
    } catch (err) {
      console.error('Failed to fetch product:', err);
      toast.error('Session expired. Please login again.');
      window.location.href = '/adminlogin';
    }
  };

  fetchProduct();
}, [id]);


useEffect(() => {
  const fetchAdmin = async () => {
    const encoded = sessionStorage.getItem('adminToken');
    if (encoded) {
      try {
        const token = await decryptToken(encoded);
        const decoded = jwtDecode(token);
        setAdminName(decoded.adminname || 'Admin User');
      } catch (err) {
        console.error('Invalid or expired token');
        toast.error('Session expired. Please login again.');
        window.location.href = '/adminlogin';
      }
    }
  };

  fetchAdmin();
}, []);


  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    toast.success('Logged out');
    window.location.href = '/adminlogin';
  };

  if (!product) return <div className="text-center mt-5">Loading product details...</div>;

  return (
    <div className="admin-layout container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 p-0">
          <Adminsidebar adminName={adminName} handleLogout={handleLogout} />
        </div>

        {/* Product Content */}
        <div className="col-md-9 col-lg-10 p-3">
          <section className="product-details">
            <div className="row">
              {/* Images */}
             <div className="col-lg-6">
  <div style={{ display: 'flex', gap: '15px' }}>
    {product.otherImages?.length > 0 && (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <img
          src={`/uploads/${product.mainImage}`}
          alt="Main View"
          onClick={() => setSelectedImage(product.mainImage)}
          style={{
            width: '70px',
            height: '70px',
            objectFit: 'cover',
            borderRadius: '6px',
            border: selectedImage === product.mainImage ? '2px solid red' : '1px solid #ccc',
            cursor: 'pointer',
          }}
        />
        {product.otherImages.map((img, idx) => (
          <img
            key={idx}
            src={`/uploads/${img}`}
            alt={`Other view ${idx + 1}`}
            onClick={() => setSelectedImage(img)}
            style={{
              width: '70px',
              height: '70px',
              objectFit: 'cover',
              borderRadius: '6px',
              border: selectedImage === img ? '2px solid red' : '1px solid #ccc',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    )}
    <div style={{ flex: 1 }}>
      <img
        src={`/uploads/${selectedImage}`}
        alt={product.title}
        style={{
          width: '100%',
          borderRadius: '10px',
          objectFit: 'cover',
          border: '1px solid #ddd',
        }}
      />
    </div>
  </div>
</div>


              {/* Info */}
              <div className="col-lg-6 mt-4 mt-lg-0">
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '16px', lineHeight: '1.6', color: '#333' }}>
                  <h3 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '10px' }}>
                    {product.title}
                    {product.brand && (
                      <span style={{ fontSize: '16px', fontWeight: 400 }}>
                        {' '}— Brand: {product.brand}
                      </span>
                    )}
                  </h3>

                  <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '10px', color: 'rgb(202, 21, 21)' }}>
                    ₹{product.discountedPrice?.toFixed(1)}
                    {product.originalPrice > product.discountedPrice && (
                      <span style={{ textDecoration: 'line-through', color: '#888', marginLeft: '10px' }}>
                        ₹{product.originalPrice?.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <p style={{ marginBottom: '15px' }}>{product.description || 'No description available.'}</p>

                  <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
                    <li><strong>Original Price:</strong> ₹{product.originalPrice?.toFixed(1)}</li>
                    <li><strong>Discounted Price:</strong> ₹{product.discountedPrice?.toFixed(1)}</li>
                    <li><strong>Brand:</strong> {product.brand || 'N/A'}</li>
                    <li><strong>Stock:</strong> {product.quantity > 0 ? 'In Stock' : 'Out of Stock'} ({product.quantity})</li>
                    {product.colors?.length > 0 && <li><strong>Colors:</strong> {product.colors.join(', ')}</li>}
                    {product.sizes?.length > 0 && <li><strong>Sizes:</strong> {product.sizes.join(', ')}</li>}
                    <li><strong>Label:</strong> {product.label}</li>
                    <li><strong>Promo Code:</strong> {product.promoCode || 'None'}</li>
                    <li><strong>Promo Discount:</strong> {product.promoDiscountPercent || 0}%</li>
                    {product.specifications && (
                      <li>
                        <strong>Specifications:</strong>
                        <ul style={{ listStyle: 'circle', marginTop: '5px', paddingLeft: '20px' }}>
                          {product.specifications.split(',').map((spec, idx) => (
                            <li key={idx}>{spec.trim()}</li>
                          ))}
                        </ul>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Adminproddetail;
