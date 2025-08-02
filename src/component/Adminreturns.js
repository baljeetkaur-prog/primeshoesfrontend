import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Adminsidebar from './Adminsidebar';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import './Adminreturns.css';
import { decryptToken } from '../utils/securetoken';

const API = process.env.REACT_APP_APIURL;

const Adminreturns = () => {
  const [orders, setOrders] = useState([]);
  const [adminName, setAdminName] = useState('Admin User');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const ordersPerPage = 20;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API}/api/admin/orders`);
        const filtered = res.data.orders.filter(
          (o) =>
            o.items.some((item) => item.isCancelled || item.isReturned)
        );
        setOrders(filtered);
      } catch (err) {
        toast.error('Failed to fetch orders');
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const encoded = sessionStorage.getItem('adminToken');
    if (encoded) {
      decryptToken(encoded)
        .then((token) => {
          const decoded = jwtDecode(token);
          setAdminName(decoded.adminname || 'Admin User');
        })
        .catch((err) => {
          console.error('Token decryption failed:', err);
          toast.error('Session expired. Please login again.');
          window.location.href = '/adminlogin';
        });
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    toast.success('Logged out');
    window.location.href = '/adminlogin';
  };

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
    const matchesDate = filterDate ? orderDate === filterDate : true;
    const hasMatchingItem =
      filterStatus === 'All'
        ? order.items.some((i) => i.isCancelled || i.isReturned)
        : filterStatus === 'Cancelled'
        ? order.items.some((i) => i.isCancelled)
        : order.items.some((i) => i.isReturned);
    return matchesDate && hasMatchingItem;
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);

  return (
    <div className="admin-layout">
      <div className="admin-sidebar-wrapper">
        <Adminsidebar adminName={adminName} handleLogout={handleLogout} />
      </div>

      <div className="admin-main-content">
        <div className="returns-container">
          <div className="text-center mb-4">
            <h5 className="admin-users-title">CANCELLED & RETURNED ORDERS</h5>
          </div>

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

            <label>Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setCurrentPage(1);
                setFilterStatus(e.target.value);
              }}
            >
              <option value="All">All</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Returned">Returned</option>
            </select>

            <button
              onClick={() => {
                setFilterDate('');
                setFilterStatus('All');
                setCurrentPage(1);
              }}
              disabled={!filterDate && filterStatus === 'All'}
            >
              Clear
            </button>
          </div>

          {filteredOrders.length === 0 ? (
            <p className="text-center">No matching orders found.</p>
          ) : (
            <>
              <table className="returns-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Order No</th>
                    <th>Product(s)</th>
                    <th>Status</th>
                    <th>Amount Paid (₹)</th>
                    <th>Delivery (₹)</th>
                    <th>Payment Mode</th>
                    <th>Reason</th>
                    <th>Refund Status</th>
                    <th>Billing Info</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.flatMap((order) =>
                    order.items
                      .filter((item) =>
                        filterStatus === 'Cancelled'
                          ? item.isCancelled
                          : filterStatus === 'Returned'
                          ? item.isReturned
                          : item.isCancelled || item.isReturned
                      )
                      .map((item, idx) => (
                        <tr key={`${order._id}-${idx}`}>
                          <td>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td>{order.orderNumber}</td>
                          <td>
                            {item.title} × {item.quantity}
                          </td>
                          <td>
                            {item.isCancelled
                              ? 'Cancelled'
                              : item.isReturned
                              ? 'Returned'
                              : '-'}
                          </td>
                          <td>{order.finalTotal}</td>
                          <td>{order.deliveryCharge || 0}</td>
                          <td>
                            {order.paymentMode.toUpperCase()}
                            <br />
                            {order.paymentInfo?.method && (
                              <small>({order.paymentInfo.method})</small>
                            )}
                          </td>
                          <td>
                            {item.cancellationReason ||
                              item.returnReason ||
                              '-'}
                          </td>
                          <td>
                            {order.paymentMode === 'razorpay'
                              ? item.refundStatus ||
                                order.refundStatus ||
                                'Not initiated'
                              : 'N/A'}
                          </td>
                       <td>
  <strong>
    {order.billing?.firstName} {order.billing?.lastName}
  </strong>
  <br />
  {order.billing?.email}
  <br />
  {order.billing?.phone}
  <br />
  {order.billing?.addressLine1}
  {order.billing?.addressLine2 ? `, ${order.billing.addressLine2}` : ''}
  <br />
  {order.billing?.city}, {order.billing?.state} - {order.billing?.zip}
  <br />
  {order.billing?.country}
</td>

                        </tr>
                      ))
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              {filteredOrders.length > ordersPerPage && (
                <div className="pagination-container">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`pagination-button ${
                        currentPage === i + 1 ? 'active' : ''
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Adminreturns;
