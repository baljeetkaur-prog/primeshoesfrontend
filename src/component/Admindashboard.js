import React, { useEffect, useState } from 'react';
import {
  FaUserShield, FaUsers, FaShoppingCart, FaMoneyBill, FaBoxOpen,
  FaExclamationTriangle, FaLock, FaSignOutAlt, FaTable
} from 'react-icons/fa';
import axios from 'axios';
import { encodePayload } from '../utils/encode';
import './Admindashboard.css';
import Adminsidebar from './Adminsidebar';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { decryptToken } from '../utils/securetoken';


const Admindashboard = () => {
  const API = process.env.REACT_APP_APIURL;
 const [adminName, setAdminName] = useState("Admin User");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalSales: 0,
    totalProducts: 0,
    lowStock: [],
    allProducts: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 100;

  const [password, setPassword] = useState({ oldPass: '', newPass: '' });

useEffect(() => {
  const loadAdminData = async () => {
    const encrypted = sessionStorage.getItem('adminToken');
    if (!encrypted) {
      toast.error("No admin token found");
      return;
    }

    try {
      const decrypted = await decryptToken(encrypted);
      if (decrypted) {
        const decoded = jwtDecode(decrypted);
        if (decoded.adminname) {
          setAdminName(decoded.adminname);
        } else if (decoded.name) {
          setAdminName(decoded.name);
        }
        fetchStats(decrypted); // 🔁 Pass decrypted token
      } else {
        toast.error("Failed to decrypt token");
      }
    } catch (err) {
      console.error("Token decryption error:", err);
      toast.error("Invalid or expired admin session");
    }
  };

  loadAdminData();
}, []);


const fetchStats = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const resProducts = await axios.get(`${API}/api/admin/products/all`, config);
    const resOrders = await axios.get(`${API}/api/admin/orders`, config);
    const resUsers = await axios.get(`${API}/api/users`, config);

    const orders = resOrders.data?.orders || [];
  const totalSales = orders.reduce((acc, order) => {
  const delivery = order.deliveryCharge || 0;
  return acc + ((order.finalTotal || 0) + delivery);
}, 0);

    setStats(prev => ({
      ...prev,
      allProducts: resProducts.data || [],
      totalProducts: resProducts.data?.length || 0,
      totalOrders: orders.length,
      totalSales: totalSales.toFixed(2),
      totalUsers: resUsers.data?.length || 0,
    }));
  } catch (err) {
    toast.error('Failed to load dashboard data');
  }
};





  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    toast.success("Logged out");
    window.location.href = "/adminlogin";
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = stats.allProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(stats.allProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-layout">
        <Adminsidebar adminName={adminName} handleLogout={handleLogout} />

        <div className="admin-main">
          {/* Dashboard Cards */}
         <div className="dashboard-cards">
  <Link to="/manageproducts" className="card-link">
    <div className="card">
      <h6>Total Products</h6>
      <p>{stats.totalProducts}</p>
    </div>
  </Link>
  <Link to="/adminsales" className="card-link">
    <div className="card">
      <h6>Total Sales</h6>
      <p>₹{stats.totalSales}</p>
    </div>
  </Link>
  <Link to="/adminorders" className="card-link">
    <div className="card">
      <h6>Total Orders</h6>
      <p>{stats.totalOrders}</p>
    </div>
  </Link>
  <Link to="/adminusers" className="card-link">
    <div className="card">
      <h6>Total Users</h6>
      <p>{stats.totalUsers}</p>
    </div>
  </Link>
</div>


          {/* Product Cards Section */}
          <div className="product-list-section">
            <h5>
              <FaTable style={{ marginRight: '8px', color: '#ca1515' }} />
              All Products
            </h5><br/>

           <div className="row gx-3 gy-4">
              {currentProducts.length === 0 ? (
                <div className="col-12">
                  <p>No products found</p>
                </div>
              ) : (
                currentProducts.map((product, index) => (
                  <div className="col-lg-3 col-md-4 col-sm-6 col-6 mb-4" key={index}>
                    <Link to={`/adminproduct/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className={`product__item ${product.label === "Sale" ? "sale" : ""}`}>
                      <div
                        className="product__item__pic set-bg"
                        style={{
                          backgroundImage: `url(/uploads/${product.mainImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          height: '350px',
                          borderRadius: '6px'
                        }}
                      >
                        {(product.quantity <= 1 || product.label === 'Out Of Stock') && (
                          <div className="label stockout stockblue">Out Of Stock</div>
                        )}
                        {(product.quantity > 1 && product.label && product.label !== 'Out Of Stock') && (
                          <div className={`label ${product.label === 'Sale' ? 'sale' : 'new'}`}>
                            {product.label}
                          </div>
                        )}
                      </div>
                     <div className="product__item__text text-center mt-2">
  <h6>{product.title.length > 35 ? `${product.title.slice(0, 35)}...` : product.title}</h6>
  <div>Stock: <strong>{product.quantity}</strong></div>
  <div className="product__price">
    ₹{product.discountedPrice?.toFixed(1)}
    {product.originalPrice > product.discountedPrice && (
      <span> ₹{product.originalPrice?.toFixed(1)}</span>
    )}
  </div><br/>
</div>

                    </div>
                    </Link>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Buttons */}
            {totalPages > 1 && (
              <div className="pagination d-flex justify-content-center mt-4">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`btn btn-sm mx-1 ${currentPage === i + 1 ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admindashboard;
