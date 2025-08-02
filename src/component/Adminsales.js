import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCalendarAlt } from 'react-icons/fa';
import Adminsidebar from './Adminsidebar';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import './Adminsales.css';
import { decryptToken } from '../utils/securetoken';

const API = process.env.REACT_APP_APIURL;
const iconStyle = { marginRight: '6px', color: '#ca1515', fontSize: '13px' };

const Adminsales = () => {
  const [sales, setSales] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDate, setFilterDate] = useState('');
  const [filterTitle, setFilterTitle] = useState('');
  const [adminName, setAdminName] = useState('Admin User');
  const salesPerPage = 20;

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get(`${API}/api/admin/orders`);
        setSales(res.data.orders || []);
      } catch {
        toast.error('Failed to fetch sales data');
      }
    };
    fetchSales();
  }, []);

  useEffect(() => {
    const fetchAdminName = async () => {
      try {
        const encryptedToken = sessionStorage.getItem('adminToken');
        if (!encryptedToken) return;

        const decrypted = await decryptToken(encryptedToken);
        const decodedToken = jwtDecode(decrypted);
        setAdminName(decodedToken.adminname || 'Admin User');
      } catch (err) {
        console.error('Failed to decrypt and decode admin token:', err);
        setAdminName('Admin User');
      }
    };

    fetchAdminName();
  }, []);

  const filteredSales = sales.filter((order) => {
    const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
    const matchesDate = filterDate ? orderDate === filterDate : true;
    const matchesProduct = filterTitle
      ? order.items.some((item) =>
          item.title.toLowerCase().includes(filterTitle.toLowerCase())
        )
      : true;
    return matchesDate && matchesProduct;
  });

  const totalPages = Math.ceil(filteredSales.length / salesPerPage);
  const indexOfLastSale = currentPage * salesPerPage;
  const indexOfFirstSale = indexOfLastSale - salesPerPage;
  const currentSales = filteredSales.slice(indexOfFirstSale, indexOfLastSale);

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    toast.success('Logged out');
    window.location.href = '/adminlogin';
  };

  return (
    <div className="admin-layout">
      <div className="admin-sidebar-wrapper">
        <Adminsidebar adminName={adminName} handleLogout={handleLogout} />
      </div>

      <div className="admin-main-content">
        <div className="sales-container">
          <h5 className="admin-users-title">SALES SUMMARY</h5>

          {/* Filters */}
          <div className="filter-controls">
            <label>Date:</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => {
                setCurrentPage(1);
                setFilterDate(e.target.value);
              }}
            />
            <label>Product:</label>
            <input
              type="text"
              placeholder="Product title"
              style={{width:'300px'}}
              value={filterTitle}
              onChange={(e) => {
                setCurrentPage(1);
                setFilterTitle(e.target.value);
              }}
            />
            <button
              onClick={() => {
                setFilterDate('');
                setFilterTitle('');
                setCurrentPage(1);
              }}
              disabled={!filterDate && !filterTitle}
            >
              Clear
            </button>
          </div>

          {/* Table */}
          <div className="table-responsive-wrapper">
            <table className="sales-table">
             <thead>
  <tr>
    <th><FaCalendarAlt style={iconStyle} />Date</th>
    <th>Product</th>
    <th>Qty</th>
    <th>Price (₹)</th>
    <th>Promo (₹)</th>
    <th>Delivery (₹)</th>
    <th>Final (₹)</th>
  </tr>
</thead>

              <tbody>
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No sales to display.
                    </td>
                  </tr>
                ) : (
                  currentSales.map((order) =>
                    order.items
                      .filter((item) =>
                        filterTitle
                          ? item.title.toLowerCase().includes(filterTitle.toLowerCase())
                          : true
                      )
                      .map((item, idx) => (
                        <tr key={order._id + idx}>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>{item.title}</td>
                          <td>{item.quantity}</td>
                         <td>{item.discountPrice}</td>
<td>{order.promoDiscount || 0}</td>
<td>{order.deliveryCharge || 0}</td>
<td>{order.finalTotal + (order.deliveryCharge || 0)}</td>
                        </tr>
                      ))
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredSales.length > salesPerPage && (
            <div className="pagination-container">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Adminsales;
