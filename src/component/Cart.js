import React, { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import usefetchcart from "./customhooks/usefetchcart";
import { UserContext } from "../App";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Instagram from "./Instagram";

const Cart = () => {
  const {
    cartdata,
    loading,
    coupon,
    fetchcart,
    email
  } = usefetchcart();
  
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [promo, setPromo] = React.useState("");
  const [promoApplied, setPromoApplied] = React.useState(false);

  useEffect(() => {
    const uinfo = JSON.parse(sessionStorage.getItem("uinfo"));
    const encryptedToken = JSON.parse(localStorage.getItem("token"));

    if (!uinfo || !uinfo.email || !encryptedToken?.iv || !encryptedToken?.data) {
      toast.warning("Login first to add to cart");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    setPromoApplied(!!coupon); // update when coupon is detected
  }, [coupon]);

  const handleQtyChange = async (index, value) => {
    const updatedQty = parseInt(value);
    if (!updatedQty || updatedQty < 1) return;

    const item = cartdata[index];
    try {
      const res = await axios.put(`${process.env.REACT_APP_APIURL}/api/updatecart`, {
        email,
        productId: item._id,
        quantity: updatedQty,
      });

      if (res.status === 200) {
        toast.success("Cart updated");
        fetchcart();
      } else {
        toast.error("Failed to update cart");
      }
    } catch (err) {
      toast.error("Error updating cart");
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_APIURL}/api/removefromcart/${email}/${productId}`
      );

      if (res.status === 200) {
        toast.success("Item removed from cart");
        fetchcart();
      } else {
        toast.error("Failed to remove item");
      }
    } catch (err) {
      toast.error("Error removing item");
    }
  };

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    const enteredCode = promo.trim().toUpperCase();

    if (!enteredCode) {
      return toast.warning("Please enter a promo code.");
    }

    if (coupon && coupon.code === enteredCode) {
      return toast.info("This promo code is already applied.");
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_APIURL}/api/apply-coupon`, {
        email,
        coupon: enteredCode
      });

      if (res.status === 200) {
        if (res.data.alreadyApplied) {
          toast.info("You’ve already used this promo code.");
          setPromo("");
          return;
        }

        toast.success("Promo applied successfully!");
        fetchcart();
        setPromo("");
        setPromoApplied(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply coupon.");
    }
  };

  // === Price Calculations ===
  const subtotal = cartdata.reduce(
    (sum, item) => sum + (item.originalPrice || item.price) * item.quantity,
    0
  );

  const totalBeforePromo = cartdata.reduce(
    (sum, item) => sum + item.discountPrice * item.quantity,
    0
  );

  const couponDiscount = cartdata.reduce((sum, item) => {
    return item.coupon?.type === "percent" && item.coupon.amount
      ? sum + (item.discountPrice * item.quantity * item.coupon.amount) / 100
      : sum;
  }, 0);

  const finalTotal = totalBeforePromo - couponDiscount;
  const youSaved = subtotal - finalTotal;

  return (
    <div>
      <div className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__links">
                <Link to="/"><i className="fa fa-home"></i> Home</Link>
                <span>Shopping cart</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="shop-cart spad">
        <div className="container">
          {loading ? (
            <p>Loading cart...</p>
          ) : (
            <>
              <div className="row">
                <div className="col-lg-12">
                  <div className="shop__cart__table">
                    <table>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Discount</th>
                          <th>Quantity</th>
                          <th>Total</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartdata.length === 0 ? (
                          <tr>
                            <td colSpan={6}>Your cart is empty.</td>
                          </tr>
                        ) : (
                          cartdata.map((item, index) => (
                            <tr key={item._id}>
                              <td className="cart__product__item">
                                <img src={`/uploads/${item.image}`} alt={item.title} style={{ width: 70 }} />
                           <div className="cart__product__item__title">
  <h6>{item.title}</h6>
  <div className="rating">
    {[...Array(5)].map((_, i) => (
      <FaStar key={i} color={i < (item.rating || 0) ? "#ffc107" : "#ffc107"} />
    ))}
  </div>
  
  {/* Show discount % if promo is applied to this product */}
  {item.coupon?.type === "percent" && item.coupon?.amount && (
    <p style={{ color: "rgb(35, 187, 117)", fontSize: "12px", marginTop: "5px" }}>
      -{item.coupon.amount}% OFF
    </p>
  )}
</div>

                              </td>

                              <td className="cart__price">
                                <span style={{ textDecoration: "line-through", color: "#888" }}>
                                  ₹{item.originalPrice || item.price}
                                </span>
                              </td>

                              <td className="cart__price" style={{ color: "#ca1515", fontWeight: "bold" }}>
                                ₹{item.discountPrice}
                              </td>

                           <td className="cart__quantity">
  <div
    style={{
      display: "flex",
      alignItems: "center",
      border: "1px solid #ddd",
      borderRadius: "4px",
      overflow: "hidden",
      width: "110px",
    }}
  >
    <button
      onClick={() =>
        handleQtyChange(index, item.quantity > 1 ? item.quantity - 1 : 1)
      }
      style={{
        padding: "6px 10px",
        background: "#fff",
        border: "none",
        fontSize: "16px",
        cursor: "pointer",
        width: "33%",
      }}
    >
      −
    </button>
    <input
      type="text"
      readOnly
      value={item.quantity}
      style={{
        textAlign: "center",
        border: "none",
        width: "34%",
        background: "#fff",
        fontWeight: "500",
      }}
    />
    <button
      onClick={() => handleQtyChange(index, item.quantity + 1)}
      style={{
        padding: "6px 10px",
        background: "#fff",
        border: "none",
        fontSize: "16px",
        cursor: "pointer",
        width: "33%",
      }}
    >
      +
    </button>
  </div>
</td>


                              <td className="cart__total">
                                ₹{(
                                  item.discountPrice * item.quantity -
                                  (item.coupon?.type === "percent" && item.coupon.amount
                                    ? (item.discountPrice * item.quantity * item.coupon.amount) / 100
                                    : 0)
                                ).toFixed(2)}
                              </td>

                              <td className="cart__close">
                                <span
                                  className="icon_close"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleRemove(item._id)}
                                ></span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="row">
                <div className="col-lg-6">
                  <div className="discount__content">
                    <h6>Discount codes</h6>
                    <form onSubmit={handleApplyPromo}>
                      <input
                        type="text"
                        placeholder="Enter your coupon code"
                        value={promo}
                        onChange={(e) => setPromo(e.target.value)}
                        disabled={promoApplied}
                      />
                      <button type="submit" className="site-btn-cart" disabled={promoApplied}>
                        {promoApplied ? "Applied" : "Apply"}
                      </button>
                    </form>
                    {promoApplied && (
                      <p style={{ color: "rgb(35, 187, 117)", marginTop: "10px" }}>
                         You’ve unlocked an exclusive offer!
                      </p>
                    )}
                  </div>
                </div>

                {/* Cart Totals */}
                <div className="col-lg-4 offset-lg-2">
                  <div className="cart__total__procced">
                    <h6>Cart total</h6>
                    <ul>
                      <li>Subtotal <span>₹{!isNaN(subtotal) ? subtotal.toFixed(2) : "0.00"}</span></li>
                      {!isNaN(couponDiscount) && couponDiscount > 0 && (
                        <li>
                          Exclusive Discount
                          <span style={{ color: "rgb(35, 187, 117)" }}>
                            -₹{couponDiscount.toFixed(2)}
                          </span>
                        </li>
                      )}
                      <li>You Saved <span>₹{!isNaN(youSaved) ? youSaved.toFixed(2) : "0.00"}</span></li>
                      <li>Total <span>₹{!isNaN(finalTotal) ? finalTotal.toFixed(2) : "0.00"}</span></li>
                    </ul>
                  <button
  className="primary-btn"
  onClick={() => {
    sessionStorage.removeItem("buyNowMode");
    sessionStorage.removeItem("buyNowItem");

    navigate("/checkout", {
      state: {
        cartdata,
        email,
        finalTotal,
        subtotal,
        couponDiscount,
        totalBeforePromo,
      },
    });
  }}
>
  Proceed to checkout
</button>


                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
      <Instagram/>
    </div>
  );
};

export default Cart;
