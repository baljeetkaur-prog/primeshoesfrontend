import React, { useEffect, useState } from 'react';
import { FaBoxOpen } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import Adminsidebar from './Adminsidebar';
import './Adminorders.css'; // Use existing consistent styles
import { jwtDecode } from 'jwt-decode';
import './Adminlowstock.css'
import { decryptToken } from '../utils/securetoken'; 

const API = process.env.REACT_APP_APIURL;

const iconStyle = { marginRight: '6px', color: '#ca1515', fontSize: '13px' };

const Adminlowstock = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [updatedQuantities, setUpdatedQuantities] = useState({});
  const [adminName, setAdminName] = useState("Admin User");

  useEffect(() => {
    fetchLowStock();
  }, []);

useEffect(() => {
  const encoded = sessionStorage.getItem('adminToken');
  if (encoded) {
    decryptToken(encoded)
      .then(token => {
        const decoded = jwtDecode(token);
        setAdminName(decoded.adminname || "Admin User");
      })
      .catch(() => {
        console.error("Invalid token");
        toast.error("Session expired. Please login again.");
        window.location.href = "/adminlogin";
      });
  }
}, []);


const fetchLowStock = async () => {
  try {
    const encoded = sessionStorage.getItem('adminToken');
    const token = await decryptToken(encoded);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get(`${API}/api/admin/products/all`, config);
    const lowStock = res.data.filter(prod => prod.quantity <= 2);
    setLowStockProducts(lowStock);
  } catch (err) {
    toast.error("Failed to fetch low stock products");
  }
};


  const handleStockChange = (productId, value) => {
    setUpdatedQuantities(prev => ({
      ...prev,
      [productId]: value
    }));
  };
const updateStock = async (productId) => {
  const newQuantity = updatedQuantities[productId];
  if (newQuantity === '' || isNaN(newQuantity) || Number(newQuantity) < 0) {
    return toast.error("Please enter a valid quantity.");
  }

  let stockStatus = "In Stock";
  if (Number(newQuantity) === 0) {
    stockStatus = "Out of Stock";
  } else if (Number(newQuantity) <= 2) {
    stockStatus = "Low Stock";
  }

  try {
    const encoded = sessionStorage.getItem('adminToken');
    const token = await decryptToken(encoded);
    const config = { headers: { Authorization: `Bearer ${token}` } };

    await axios.put(`${API}/api/products/updatestock/${productId}`, {
      quantity: Number(newQuantity),
      stockStatus
    }, config);

    toast.success("Stock updated successfully!");
    setUpdatedQuantities(prev => ({ ...prev, [productId]: '' }));
    fetchLowStock();
  } catch (err) {
    toast.error("Failed to update stock.");
  }
};


  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    toast.success("Logged out");
    window.location.href = "/adminlogin";
  };

  return (
   <div className="admin-layout">
<Adminsidebar adminName={adminName} handleLogout={handleLogout} />

  <div className="admin-main">
    <section className="contact spad" style={{ paddingTop: '0px', marginTop: '0' }}>
      <div className="container">
        <div className="text-center mb-4">
          <h5 className="admin-users-title">LOW STOCK PRODUCTS</h5>
        </div>

        <div className="row">
          {lowStockProducts.length === 0 ? (
            <div className="col-12 text-center">
              <p>No low stock products found.</p>
            </div>
          ) : (
            lowStockProducts.map((product, index) => {
              const label = product.quantity === 0 ? "Out of Stock" : "Low Stock";
              const labelClass = product.quantity === 0 ? "text-danger" : "text-warning";

              return (
              <div className="col-md-6 col-lg-4 mb-4" key={index}>
  <div className="lowstock-product">
    <img src={`${API}/uploads/${product.mainImage}`} alt={product.title} />
    <h6 className="lowstock-prod-title">{product.title}</h6>
    <p>Status: <span className={product.quantity === 0 ? "label-out" : "label-low"}>{label}</span></p>
    <p>Current Stock: <strong>{product.quantity}</strong></p>
    <p>Discounted Price: ₹{product.discountedPrice?.toFixed(1)}</p>

    <input
      type="number"
      placeholder="Enter new quantity"
      className="stock-update-input"
      value={updatedQuantities[product._id] || ''}
      onChange={(e) => handleStockChange(product._id, e.target.value)}
    />
    <button
      className="stock-update-btn"
      onClick={() => updateStock(product._id)}
    >
      Update Stock
    </button>
  </div>
</div>

              );
            })
          )}
        </div>
      </div>
    </section>
  </div>
</div>

  );
};

export default Adminlowstock;
