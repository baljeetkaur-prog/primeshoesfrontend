import React, { useEffect, useState } from 'react';
import {
  FaBox, FaCalendarAlt, FaRupeeSign, FaUser,
  FaMapMarkerAlt, FaPhone, FaTags
} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Adminorders.css';
import Adminsidebar from './Adminsidebar';
import { jwtDecode } from 'jwt-decode';
import { decryptToken } from '../utils/securetoken';

const iconStyle = { marginRight: '8px', color: '#ca1515' };
const infoIconStyle = { marginRight: '6px', color: '#ca1515', fontSize: '13px' };

const Adminorders = () => {
  const [orders, setOrders] = useState([]);
  const API = process.env.REACT_APP_APIURL;
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDate, setFilterDate] = useState('');
  const [adminName, setAdminName] = useState("Admin User");
  const ordersPerPage = 20;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API}/api/admin/orders`);
        setOrders(res.data.orders);
      } catch (err) {
        toast.error('Failed to fetch orders');
      }
    };
    fetchOrders();
  }, [API]);

useEffect(() => {
  const getAdminName = async () => {
    const encrypted = sessionStorage.getItem('adminToken');
    if (!encrypted) return;

    const decrypted = await decryptToken(encrypted);
    if (!decrypted) return;

    try {
      const decoded = jwtDecode(decrypted);
      setAdminName(decoded.adminname || "Admin User");
    } catch (err) {
      console.error("Invalid token");
    }
  };

  getAdminName();
}, []);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const filteredOrders = filterDate
    ? orders.filter(order =>
        new Date(order.createdAt).toISOString().slice(0, 10) === filterDate
      )
    : orders;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    toast.success("Logged out");
    window.location.href = "/adminlogin";
  };

  return (
  <div className="admin-layout">
    <div className="admin-sidebar-wrapper">
      <Adminsidebar adminName={adminName} handleLogout={handleLogout} />
    </div>

<div className="admin-orders-content">
  <div className="orders-container">
    <div className="text-center mb-4">
      <h5 className="admin-users-title">ALL ORDERS</h5>
    </div>



          {/* Filter */}
          <div className="date-filter">
            <label htmlFor="filterDate">Filter by Date:</label>
            <input
              type="date"
              id="filterDate"
              value={filterDate}
              onChange={(e) => {
                setCurrentPage(1);
                setFilterDate(e.target.value);
              }}
            />
            <button
              onClick={() => {
                setCurrentPage(1);
                setFilterDate('');
              }}
              disabled={!filterDate}
            >
              Clear
            </button>
          </div>

          {currentOrders.length === 0 ? (
            <p className="text-center">No orders found.</p>
          ) : (
            currentOrders.map((order) => (
              <div key={order._id} className="admino-order-card mb-4 p-3 shadow-sm" style={{ backgroundColor: '#fff', borderRadius: '6px' }}>
                <h6><FaBox style={infoIconStyle} /> Order No: #{order.orderNumber}</h6>
                <p><FaCalendarAlt style={infoIconStyle} /> <strong>Placed:</strong> {new Date(order.createdAt).toLocaleString()}</p>

                <div className="row">
                  <div className="col-md-6">
                    <p><FaUser style={infoIconStyle} /> <strong>Email:</strong> {order.email}</p>
                    <p><FaPhone style={infoIconStyle} /> <strong>Phone:</strong> {order.billing.phone}</p>
                    <p><FaMapMarkerAlt style={infoIconStyle} /> <strong>Address:</strong> {order.billing.addressLine1}, {order.billing.city}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Mode:</strong> {order.paymentMode.toUpperCase()}</p>
                    {order.paymentMode.toLowerCase() !== 'cod' && (
                      <p><strong>Paid:</strong> {order.isPaid ? `Yes (${new Date(order.paidAt).toLocaleString()})` : 'No'}</p>
                    )}
                   <div className="admino-final-total">
  <p style={{ marginBottom: '4px' }}>
    <strong>Subtotal:</strong> ₹{order.finalTotal}
  </p>
  {order.deliveryCharge > 0 ? (
    <p style={{ marginBottom: '4px' }}>
      <strong>Delivery Charge:</strong> ₹{order.deliveryCharge}
    </p>
  ) : (
    <p style={{ color: 'green', marginBottom: '4px' }}>
      <strong>Free Delivery</strong>
    </p>
  )}
  <p style={{ fontWeight: 'bold' }}>
    Final Paid: ₹{order.finalTotal + (order.deliveryCharge || 0)}
  </p>
</div>

                  </div>
                </div>

                {/* Items */}
                <div className="mt-3">
                  <h6 className="admino-subheading">Items</h6>
                  <div className="row mt-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="col-md-6 d-flex mb-2">
                        {item.productId?.mainImage && (
                          <img
                            src={`${API}/uploads/${item.productId.mainImage}`}
                            alt={item.title}
                            className="admino-product-img me-3"
                          />
                        )}
                        <div>
                          <p className="product-title mb-1"><FaTags style={infoIconStyle} /><strong>{item.title}</strong></p>
                          <p className="mb-1">Qty: {item.quantity} | ₹{item.discountPrice}</p>
                          {item.color && <p className="mb-1">Color: {item.color}</p>}
                          {item.size && <p className="mb-1">Size: {item.size}</p>}
                          {item.coupon?.code && (
                            <p className="mb-0 text-success">Coupon: {item.coupon.code} ({item.coupon.amount}% off)</p>
                          )}
                          <p className="mb-1">
  <strong>Status:</strong>&nbsp;
<select
  value={item.status}
  className="form-select d-inline-block w-auto ms-2"
  disabled={item.isCancelled || item.isReturned}
  onChange={async (e) => {
    const newStatus = e.target.value;
    try {
      await axios.put(`${API}/api/orders/${order._id}/item/${i}/status`, { status: newStatus });
      toast.success('Item status updated');

      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o._id === order._id
            ? {
                ...o,
                items: o.items.map((itm, idx) =>
                  idx === i ? { ...itm, status: newStatus } : itm
                ),
              }
            : o
        )
      );
    } catch (err) {
      toast.error('Failed to update item status');
    }
  }}
>

    <option value="Pending">Pending</option>
    <option value="Confirmed">Confirmed</option>
    <option value="Processing">Processing</option>
    <option value="Shipped">Shipped</option>
    <option value="Delivered">Delivered</option>
    <option value="Cancelled">Cancelled</option>
    <option value="Returned">Returned</option>
  </select>
</p>
{(item.isCancelled || item.isReturned) && (
  <small className="text-muted">Status locked after user {item.isCancelled ? 'cancellation' : 'return'}.</small>
)}


                        </div>
                        
                      </div>
                    ))}
                    
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Pagination */}
          {filteredOrders.length > ordersPerPage && (
            <div className="pagination-container text-center mt-4 mb-4">
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

export default Adminorders;
