import React, { useEffect, useState, useContext } from 'react';
import { FaHome, FaBoxOpen } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Instagram from './Instagram';
import { UserContext } from '../App';
import './Orders.css'; // custom CSS for responsiveness
import { toast } from 'react-toastify';
import ReturnCancelModal from './Returncancelmodal';

const iconStyle = { marginRight: '8px', color: '#ca1515' };
const badgeStyle = {
  background: '#ca1515',
  color: '#fff',
  padding: '2px 10px',
  borderRadius: '12px',
  fontSize: '12px',
  textTransform: 'capitalize',
};
    const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

const Orders = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const API = process.env.REACT_APP_APIURL;
   const isMobile = useIsMobile();
   const [modalOpen, setModalOpen] = useState(false);
const [modalType, setModalType] = useState(null); // 'cancel' or 'return'
const [activeOrder, setActiveOrder] = useState({ orderId: null, productId: null });

const openModal = (orderId, productId, type) => {
  setActiveOrder({ orderId, productId });
  setModalType(type);
  setModalOpen(true);
};


const handleModalSubmit = async (reason) => {
  try {
    const url =
      modalType === 'cancel'
        ? `${API}/api/cancel/${activeOrder.orderId}`
        : `${API}/api/return/${activeOrder.orderId}`;

    const res = await axios.post(url, { reason, productId: activeOrder.productId });

    toast.success(res.data.message);
    window.location.reload();
  } catch (err) {
    toast.error(err.response?.data || "Action failed");
  }
};




  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API}/api/uorders/${user?.email}`);
        setOrders(res.data.orders || []);
      } catch (err) {
        toast.error("Failed to fetch your orders.");
      }
    };

    if (user?.email) fetchOrders();
  }, [user]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const isSameDay = (createdAt) => {
  const today = new Date().toDateString();
  const createdDate = new Date(createdAt).toDateString();
  return today === createdDate;
};

const handleCancel = async (orderId) => {
  const reason = prompt("Please provide a reason for cancellation:");
  if (!reason) return;

  try {
    const res = await axios.post(`${API}/api/cancel/${orderId}`, { reason });
    toast.success(res.data.message);
    window.location.reload(); // refresh orders
  } catch (err) {
    toast.error(err.response?.data || "Cancellation failed");
  }
};

const handleReturn = async (orderId) => {
  const reason = prompt("Please provide a reason for return:");
  if (!reason) return;

  try {
    const res = await axios.post(`${API}/api/return/${orderId}`, { reason });
    toast.success(res.data.message);
    window.location.reload(); // refresh orders
  } catch (err) {
    toast.error(err.response?.data || "Return failed");
  }
};



  return (
    <div>

      {/* Breadcrumb */}
      <div className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__links">
                <Link to="/"><FaHome style={iconStyle} /> Home</Link>
                <span>My Orders</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Section */}
         <section className="contact spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h5 className="mb-4" style={{textAlign:'left'}}><FaBoxOpen style={iconStyle} /> Your Orders</h5><br/>

              {orders.length === 0 ? (
                <p>You have not placed any orders yet.</p>
              ) : (
                <>
                  {!isMobile ? (
                    // Table view for desktop
                    <div className="responsive-table-wrapper">
  <table className="table table-bordered align-middle orders-table">
    <thead>
      <tr style={{ textAlign: 'center' }}>
        <th>Order No</th>
        <th>Date</th>
        <th>Products</th>
        <th>Qty</th>
        <th>Total Paid</th>
        <th>Payment</th>
        <th>Status</th>
        <th>Shipping Address</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {currentOrders.map((order) =>
        order.items.map((item, itemIndex) => (
          
          <tr key={`${order._id}-${itemIndex}`} style={{ verticalAlign: 'middle' }}>
            <td className="text-center fw-bold">
              ORD-{order._id.slice(-6).toUpperCase()}
            </td>
            <td className="text-center">
              {new Date(order.createdAt).toLocaleDateString()}
            </td>
            <td>
              <div className="d-flex align-items-center flex-md-row flex-column text-start order-product-info">
                {item.productId?.mainImage && (
                  <img
                    src={`${API}/uploads/${item.productId.mainImage}`}
                    alt="Product"
                    width="60"
                    height="60"
                    className="rounded mb-2 mb-md-0"
                    style={{ objectFit: 'cover' }}
                  />
                )}
                <div className="ms-md-3">
                  <div className="fw-bold">{item.productId?.title || item.title}</div>
                  <div className="text-muted" style={{ fontSize: '12px' }}>
                    {item.size && <>Size: {item.size} </>}
                    {item.color && <>| Color: {item.color}</>}
                  </div>
                </div>
              </div>
            </td>
            <td className="text-center">{item.quantity}</td>
<td style={{ lineHeight: '1.6', fontSize: '13px' }}>
 <div><b>MRP:</b> ₹{item.originalPrice} × {item.quantity} = ₹{item.originalPrice * item.quantity}</div>
  <div><b>After Product Discount:</b> ₹{item.discountPrice} × {item.quantity} = ₹{item.discountPrice * item.quantity}</div>
{(() => {
  let parsedCoupon = null;
  try {
    parsedCoupon = typeof item.coupon === 'string' ? eval('(' + item.coupon + ')') : item.coupon;
  } catch (err) {
    parsedCoupon = null;
  }

  if (parsedCoupon?.amount > 0) {
    const discount = Math.round((item.discountPrice * parsedCoupon.amount) / 100) * item.quantity;
    return (
      <div>
        <b>Promo Discount:</b> ₹{discount}
      </div>
    );
  }
  return null;
})()}


  {order.deliveryCharge > 0 && (
  <div>
    <b>Delivery:</b> ₹
    {(() => {
      const totalItems = order.items.reduce((acc, itm) => acc + itm.quantity, 0);
      return Math.round((order.deliveryCharge / totalItems) * item.quantity);
    })()}
  </div>
)}

 <div style={{ marginTop: '4px' }}>
  <b>Final Paid:</b> ₹
  {(() => {
    const base = item.discountPrice * item.quantity;

    let parsedCoupon = null;
    try {
      parsedCoupon = typeof item.coupon === 'string' ? eval('(' + item.coupon + ')') : item.coupon;
    } catch (err) {
      parsedCoupon = null;
    }

    const promo = parsedCoupon?.amount
      ? Math.round((item.discountPrice * parsedCoupon.amount) / 100) * item.quantity
      : 0;

    const totalItems = order.items.reduce((acc, itm) => acc + itm.quantity, 0);
    const itemDelivery = order.deliveryCharge
      ? Math.round((order.deliveryCharge / totalItems) * item.quantity)
      : 0;

    return base - promo + itemDelivery;
  })()}
</div>

</td>


            <td className="text-center">{order.paymentMode}</td>
            <td className="text-center">
           <div style={{ fontSize: '12px', marginTop: '4px' }}>
  <span
    style={{
      ...badgeStyle,
      background:
        item.status === 'Cancelled'
          ? '#999'
          : item.status === 'Returned'
          ? '#f39c12'
          : '#ca1515',
    }}
  >
    {item.status || order.status || 'Pending'}
  </span>
</div>


            </td>
            <td style={{ fontSize: '13px' }}>
              <div>{order.billing.firstName} {order.billing.lastName}</div>
              <div>{order.billing.phone}</div>
              <div>{order.billing.addressLine1}</div>
              {order.billing.addressLine2 && <div>{order.billing.addressLine2}</div>}
              <div>{order.billing.city}, {order.billing.state}</div>
              <div>{order.billing.zip}</div>
            </td>
            <td className="text-center">
  {order.status === 'Delivered' ? (
  <>
    <Link to={`/rate/${item.productId?._id}`} className="rate-btn-table">Rate</Link>
    {!order.isReturned && (
    <button className="return-btn-table" onClick={() => openModal(order._id, item.productId._id, 'return')}>
Return</button>
    )}
  </>
) : (
  <>
    <button className="rate-btn-table disabled" onClick={() => toast.info("Please wait until delivery to rate.")}>Rate</button>
    {isSameDay(order.createdAt) && !order.isCancelled && (
    <button className="cancel-btn-table" onClick={() => openModal(order._id, item.productId._id, 'cancel')}>Cancel</button>
    )}
  </>
)}
{(order.status === 'Delivered' || isSameDay(order.createdAt)) && (
  <p style={{ fontSize: '11px', color: '#888', marginTop: '6px' }}>
    Note: Delivery charge is refunded only for damaged or wrong items.
  </p>
)}


            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

                  ) : (
                    // Card view for mobile
                    <>
                      {currentOrders.map((order) =>
                        order.items.map((item, itemIndex) => (
                          <div key={`${order._id}-${itemIndex}`} className="order-card">
                            <div className="order-card-header">
                              Order: ORD-{order._id.slice(-6).toUpperCase()}
                            </div>
                            <div>Date: {new Date(order.createdAt).toLocaleDateString()}</div>
                            <div className="order-card-product">
                              <img src={`${API}/uploads/${item.productId?.mainImage}`} alt="Product" />
                              <div className="order-card-product-details">
                                <div><b>{item.productId?.title || item.title}</b></div>
                                <div className="text-muted" style={{ fontSize: '12px' }}>
                                  {item.size && <>Size: {item.size} </>}
                                  {item.color && <>| Color: {item.color}</>}
                                </div>
                                <div>Qty: {item.quantity}</div>
                              </div>
                            </div>
                            <div className="order-card-footer">
                              <div><b>MRP:</b> ₹{item.originalPrice} × {item.quantity} = ₹{item.originalPrice * item.quantity}</div>
  <div><b>After Product Discount:</b> ₹{item.discountPrice} × {item.quantity} = ₹{item.discountPrice * item.quantity}</div>

  {(() => {
    let parsedCoupon = null;
    try {
      parsedCoupon = typeof item.coupon === 'string' ? eval('(' + item.coupon + ')') : item.coupon;
    } catch (err) {
      parsedCoupon = null;
    }

    if (parsedCoupon?.amount > 0) {
      const discount = Math.round((item.discountPrice * parsedCoupon.amount) / 100) * item.quantity;
      return <div><b>Promo Discount:</b> ₹{discount}</div>;
    }
    return null;
  })()}

  {order.deliveryCharge > 0 && (
    <div>
      <b>Delivery:</b> ₹
      {(() => {
        const totalItems = order.items.reduce((acc, itm) => acc + itm.quantity, 0);
        return Math.round((order.deliveryCharge / totalItems) * item.quantity);
      })()}
    </div>
  )}

  <div><b>Final Paid:</b> ₹
    {(() => {
      const base = item.discountPrice * item.quantity;

      let parsedCoupon = null;
      try {
        parsedCoupon = typeof item.coupon === 'string' ? eval('(' + item.coupon + ')') : item.coupon;
      } catch (err) {
        parsedCoupon = null;
      }

      const promo = parsedCoupon?.amount
        ? Math.round((item.discountPrice * parsedCoupon.amount) / 100) * item.quantity
        : 0;

      const totalItems = order.items.reduce((acc, itm) => acc + itm.quantity, 0);
      const itemDelivery = order.deliveryCharge
        ? Math.round((order.deliveryCharge / totalItems) * item.quantity)
        : 0;

      return base - promo + itemDelivery;
    })()}
  </div>
                              <div>Payment Mode: {order.paymentMode}</div>
                              <div className="order-card-status">
      <span
        style={{
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '12px',
          background:
            item.status === 'Cancelled'
              ? '#999'
              : item.status === 'Returned'
              ? '#f39c12'
              : '#ca1515',
          color: '#fff',
        }}
      >
        {item.status || order.status || 'Pending'}
      </span>
    </div>

                              <div><b>Ship To:</b> {order.billing.firstName} {order.billing.lastName}, {order.billing.addressLine1}, {order.billing.city}</div>
                            {order.status === 'Delivered' ? (
  <>
    <Link to={`/rate/${item.productId?._id}`} className="rate-btn-mobile">Rate</Link>
    {!order.isReturned && (
     <button className="return-btn-mobile" onClick={() => openModal(order._id, 'return')}>Return</button>
    )}
  </>
) : (
  <>
    <button className="rate-btn" onClick={() => toast.info("Please wait until delivery to rate.")}>Rate</button>
    {isSameDay(order.createdAt) && !order.isCancelled && (
     <button className="cancel-btn-mobile" onClick={() => openModal(order._id, 'cancel')}>Cancel</button>
    )}
  </>
)}
{(order.status === 'Delivered' || isSameDay(order.createdAt)) && (
  <p style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>
    *Delivery charges refunded only for damaged/wrong products.
  </p>
)}



                            </div>
                          </div>
                        ))
                      )}
                    </>
                  )}

                  {/* Pagination */}
                  {orders.length > ordersPerPage && (
                    <div className="product__pagination text-center mt-4">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                          style={{
                            border: 'none',
                            padding: '8px 14px',
                            margin: '0 4px',
                            borderRadius: '50%',
                            background: currentPage === i + 1 ? '#ca1515' : '#f0f0f0',
                            color: currentPage === i + 1 ? '#fff' : '#111',
                            cursor: 'pointer',
                          }}
                          onClick={() => setCurrentPage(i + 1)}
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
      </section>
      <ReturnCancelModal
  isOpen={modalOpen}
  type={modalType}
  onClose={() => setModalOpen(false)}
  onSubmit={handleModalSubmit}
/>


      <Instagram />
    </div>
  );
};

export default Orders;
