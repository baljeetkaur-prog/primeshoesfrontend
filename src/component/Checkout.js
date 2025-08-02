import React from "react";
import Instagram from "./Instagram";
import { useEffect, useState, useContext } from "react";
import { dataContext, UserContext } from "../App"; // if email is stored there
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
const [totalBefore, setTotalBefore] = useState(0);
const [totalAfter, setTotalAfter] = useState(0);
const [promoDiscount, setPromoDiscount] = useState(0);
const [finalTotal, setFinalTotal] = useState(0);
const { user } = useContext(UserContext);
const { setitemcount } = useContext(dataContext);
const [deliveryCharge, setDeliveryCharge] = useState(0);
const navigate=useNavigate(); 
const [billingDetails, setBillingDetails] = useState({
  firstName: "",
  lastName: "",
  country: "",
  address: "",
  apartment: "",
  city: "",
  state: "",
  zip: "",
  phone: "",
  email: user?.email || "",
  note: "",
});
const [accountPassword, setAccountPassword] = useState("");
const [paymentMode, setPaymentMode] = useState(""); // "online" or "cod"

const API=process.env.REACT_APP_APIURL; 
useEffect(() => {
  const isBuyNowMode = sessionStorage.getItem("buyNowMode") === "true";
  const buyNowItemRaw = sessionStorage.getItem("buyNowItem");

  if (isBuyNowMode && buyNowItemRaw) {
    const item = JSON.parse(buyNowItemRaw);
    setCartItems([item]);

    const totalBefore = item.originalPrice * item.quantity;
    const totalAfter = item.discountPrice * item.quantity;
    const youSaved = totalBefore - totalAfter;

    setTotalBefore(totalBefore);
    setTotalAfter(totalAfter);
    setPromoDiscount(0); // No promo for buy now
    setFinalTotal(totalAfter);
  } else if (user?.email) {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`${API}/api/fetchcart/${user.email}`);
        const {
          cart,
          totalBeforeDiscount,
          totalAfterDiscount,
          promoDiscount,
          finalTotal,
        } = res.data;

        const items = Array.isArray(cart) ? cart : [];
        setCartItems(items);
        setTotalBefore(totalBeforeDiscount);
        setTotalAfter(totalAfterDiscount);
        setPromoDiscount(promoDiscount);
        setFinalTotal(finalTotal);
      } catch (err) {
        console.error("Checkout fetch error:", err);
      }
    };

    fetchCart();
  }
}, [user?.email]);



const handlePlaceOrder = async (e) => {
  e.preventDefault();

  const isBuyNowMode = sessionStorage.getItem("buyNowMode") === "true";
  const buyNowItemRaw = sessionStorage.getItem("buyNowItem");
  const buyNowItem = isBuyNowMode && buyNowItemRaw ? JSON.parse(buyNowItemRaw) : null;

  if (!paymentMode) {
    toast.error("Please select a payment method.");
    return;
  }

  const requiredFields = [
    "firstName", "lastName", "country", "address", "city", "state", "zip", "phone", "email"
  ];
  const isValid = requiredFields.every(field => billingDetails[field]?.trim()) && accountPassword;

  if (!isValid) {
    toast.error("Please fill in all required fields including password.");
    return;
  }

  // ✅ COD Flow
  if (paymentMode === "cod") {
    try {
      const res = await axios.post(`${API}/api/placeorder`, {
        email: user.email,
        billingDetails,
        password: accountPassword,
        paymentMode,
        note: billingDetails.note,
          deliveryCharge, 
        ...(buyNowItem && { buyNowItem })
      });

      const order = res.data?.order;

      toast.success("Order Placed Successfully");
      
      setCartItems([]);
      setitemcount(0);
      sessionStorage.removeItem("buyNowItem");
      sessionStorage.removeItem("buyNowMode");

      setBillingDetails({
        firstName: "", lastName: "", country: "", address: "",
        apartment: "", city: "", state: "", zip: "",
        phone: "", email: user?.email || "", note: ""
      });
      setAccountPassword("");
      setPaymentMode("");
      setTotalBefore(0);
      setTotalAfter(0);
      setPromoDiscount(0);
      setFinalTotal(0);

      if (order) {
        navigate("/thankyou", { state: { orderNumber: order.orderNumber } });
      } else {
        toast.error("Order created but no order number returned.");
      }

    } catch (err) {
      console.error("Place order error (COD):", err);
      toast.error(err.response?.data?.message || "Something went wrong.");
    }

    return;
  }

  // ✅ Razorpay Flow
  if (paymentMode === "razorpay") {
    toast.info("Redirecting to Razorpay...");

    try {
      // Step 1: Create Razorpay Order
      const createOrderRes = await axios.post(`${API}/api/create-razorpay-order`, {
      amount: (finalTotal + deliveryCharge) * 100,

        currency: "INR",
      });

      const razorpayOrder = createOrderRes.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.id,
        name: "PrimeShoes",
        description: "Order Payment",
        image: "/logo192.png",

    handler: async function (response) {
  try {
    // 🔺 Step 2: PLACE ORDER before verification
    const placeOrderRes = await axios.post(`${API}/api/placeorder`, {
      email: user.email,
      billingDetails,
      password: accountPassword,
      paymentMode,
      note: billingDetails.note,
        deliveryCharge, 
      ...(buyNowItem && { buyNowItem }),
      skipPaymentVerification: true // optional flag if needed
    });

    const order = placeOrderRes.data?.order;

    if (!order?._id) {
      toast.error("Order placement failed before payment verification.");
      return;
    }

    // 🔺 Step 3: VERIFY PAYMENT
    const verifyRes = await axios.post(`${API}/api/verify-payment`, {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      orderId: order._id, // 👈 This is critical!
    });

  if (verifyRes.data.success) {
  toast.success("Payment Verified and Order Confirmed");

  // ✅ Clear cart
  setCartItems([]);
  setitemcount(0);
  sessionStorage.removeItem("buyNowItem");
  sessionStorage.removeItem("buyNowMode");

  setBillingDetails({
    firstName: "", lastName: "", country: "", address: "",
    apartment: "", city: "", state: "", zip: "",
    phone: "", email: user?.email || "", note: ""
  });
  setAccountPassword("");
  setPaymentMode("");
  setTotalBefore(0);
  setTotalAfter(0);
  setPromoDiscount(0);
  setFinalTotal(0);

  navigate("/thankyou", { state: { orderNumber: order.orderNumber } });
}
 else {
      toast.error("Payment verification failed");
    }
  } catch (err) {
    console.error("Payment verification error:", err);
    toast.error("Payment verification failed.");
  }
},


        prefill: {
          name: billingDetails.firstName + " " + billingDetails.lastName,
          email: billingDetails.email,
          contact: billingDetails.phone,
        },

        theme: {
          color: "#f44",
        },
      };

      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        toast.error("Failed to load Razorpay. Please try again.");
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Error initiating Razorpay payment:", err);
      toast.error("Could not initiate payment. Try again.");
    }

    return;
  }
};


const calculateTotals = (items) => {
  let totalBefore = 0;
  let totalAfter = 0;
  let promoDiscount = 0;

  items.forEach(item => {
    const price = item.discountPrice ?? item.originalPrice;
    const quantity = item.quantity ?? 1;

    totalBefore += item.originalPrice * quantity;
    totalAfter += price * quantity;

    if (item.coupon) {
      const discount = item.coupon.type === "percent"
        ? (price * item.coupon.amount / 100)
        : item.coupon.amount;
      promoDiscount += discount * quantity;
    }
  });

  const finalTotal = Math.max(0, totalAfter - promoDiscount);

  // Update state
  setTotalBefore(totalBefore);
  setTotalAfter(totalAfter);
  setPromoDiscount(promoDiscount);
  setFinalTotal(finalTotal);
};
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
useEffect(() => {
const calculateDeliveryCharge = () => {
  if (cartItems.length === 0) {
    setDeliveryCharge(0);
    return;
  }

  const city = billingDetails.city?.trim().toLowerCase();
  const isCityOutsidePhagwara = city && city !== "phagwara";
  const isBelowFreeLimit = finalTotal < 1000;

  const charge = (isCityOutsidePhagwara || isBelowFreeLimit) ? 50 : 0;
  setDeliveryCharge(charge);
};


  calculateDeliveryCharge();
}, [billingDetails.city, finalTotal, cartItems]);




  return (
    <>
      <div className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__links">
                <a href="index.html"><i className="fa fa-home"></i> Home</a>
                <span>Shopping cart</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="checkout spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
             <h6 className="coupon__link" style={{ marginBottom: "25px" }}>
  <span className="icon_tag_alt"></span>&nbsp; 
  Use a valid promo code in cart to unlock exclusive discounts.
</h6>
            </div>
          </div>

         <form className="checkout__form" onSubmit={handlePlaceOrder}>

            <div className="row">
              <div className="col-lg-8">
                <h5>Billing detail</h5>
              <div className="row">
                  {/* First Name */}
                  <div className="col-lg-6">
                    <div className="checkout__form__input">
                      <p>First Name <span>*</span></p>
                      <input
                        type="text"
                        value={billingDetails.firstName}
                        onChange={(e) =>
                          setBillingDetails({ ...billingDetails, firstName: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  {/* Last Name */}
                  <div className="col-lg-6">
                    <div className="checkout__form__input">
                      <p>Last Name <span>*</span></p>
                      <input
                        type="text"
                        value={billingDetails.lastName}
                        onChange={(e) =>
                          setBillingDetails({ ...billingDetails, lastName: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div className="col-lg-12">
                    <div className="checkout__form__input">
                      <p>Country <span>*</span></p>
                      <input
                        type="text"
                        value={billingDetails.country}
                        onChange={(e) =>
                          setBillingDetails({ ...billingDetails, country: e.target.value })
                        }
                      />
                    </div>

                    {/* Address */}
                    <div className="checkout__form__input">
                      <p>Address <span>*</span></p>
                      <input
                        type="text"
                        value={billingDetails.address}
                        onChange={(e) =>
                          setBillingDetails({ ...billingDetails, address: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Apartment, suite, unit etc (optional)"
                        value={billingDetails.apartment}
                        onChange={(e) =>
                          setBillingDetails({ ...billingDetails, apartment: e.target.value })
                        }
                      />
                    </div>

                    {/* City */}
                    <div className="checkout__form__input">
                      <p>Town/City <span>*</span></p>
                      <input
                        type="text"
                        value={billingDetails.city}
                        onChange={(e) =>
                          setBillingDetails({ ...billingDetails, city: e.target.value })
                        }
                      />
                    </div>

                    {/* State */}
                    <div className="checkout__form__input">
                      <p>State <span>*</span></p>
                      <input
                        type="text"
                        value={billingDetails.state}
                        onChange={(e) =>
                          setBillingDetails({ ...billingDetails, state: e.target.value })
                        }
                      />
                    </div>

                    {/* Zip */}
                    <div className="checkout__form__input">
                      <p>Postcode/Zip <span>*</span></p>
                      <input
                        type="text"
                        value={billingDetails.zip}
                        onChange={(e) =>
                          setBillingDetails({ ...billingDetails, zip: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Phone & Email */}
                  <div className="col-lg-6">
                    <div className="checkout__form__input">
                      <p>Phone <span>*</span></p>
                      <input
                        type="text"
                        value={billingDetails.phone}
                        onChange={(e) =>
                          setBillingDetails({ ...billingDetails, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="checkout__form__input">
                      <p>Email <span>*</span></p>
                      <input
                        type="email"
                        value={billingDetails.email}
                        onChange={(e) =>
                          setBillingDetails({ ...billingDetails, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Account Password */}
                  <div className="col-lg-12">
                    <div className="checkout__form__input">
                      <p>Account Password <span>*</span></p>
                      <input
                        type="password"
                        value={accountPassword}
                        onChange={(e) => setAccountPassword(e.target.value)}
                      />
                    </div>

                    {/* Note */}
                    <div className="checkout__form__input">
                      <p>Order notes</p>
                      <input
                        type="text"
                        placeholder="Note about your order, e.g, special note for delivery"
                        value={billingDetails.note}
                        onChange={(e) =>
                          setBillingDetails({ ...billingDetails, note: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="checkout__order">
                  <h5>Your order</h5>
                  <div className="checkout__order__product">
  <ul>
    <li>
      <span className="top__text">Product</span>
      <span className="top__text__right">Total</span>
    </li>
    {cartItems.map((item, index) => (
      <li key={item._id}>
        {index + 1}. {item.title}
        {item.color && ` / Color: ${item.color}`}
        {item.size && ` / Size: ${item.size}`}
        {` × ${item.quantity}`}
        <span>₹{(((item?.discountPrice ?? item.originalPrice) || 0) * item.quantity)
.toFixed(2)}</span>

      </li>
    ))}
  </ul>
</div>

<div className="checkout__order__total">
  <ul>
    <li>Subtotal Before Discount<span>₹{totalBefore.toFixed(2)}</span></li>
    <li>Promo Discount <span style={{ color: "rgb(35, 187, 117)" }}>– ₹{promoDiscount.toFixed(2)}</span></li>
    <li>You Saved <span>₹{(totalBefore - finalTotal).toFixed(2)}</span></li>
    
    <li>Delivery Charge 
      <span>
        {deliveryCharge === 0 ? (
          <span style={{ color: "rgb(35, 187, 117)" }}>Free</span>
        ) : (
          `₹${deliveryCharge.toFixed(2)}`
        )}
      </span>
    </li>
        {deliveryCharge === 0 && (
      <p style={{ color: "rgb(35, 187, 117)", fontSize: "14px", marginTop: "5px", marginBottom: "5px", fontWeight:"400" }}>
        Free delivery on orders above ₹1000 in Phagwara
      </p>
    )}

    <li>Total 
      <span>₹{(finalTotal + deliveryCharge).toFixed(2)}</span>
    </li>
  </ul>
</div>




               <div className="checkout__order__widget">
  <label htmlFor="check-payment">
    Pay Online
    <input
      type="checkbox"
      id="check-payment"
      checked={paymentMode === "razorpay"}
onChange={() =>
  setPaymentMode(paymentMode === "razorpay" ? "" : "razorpay")
}
    />
    <span className="checkmark"></span>
  </label>

  <label htmlFor="paypal">
    Cash On Delivery
    <input
      type="checkbox"
      id="paypal"
      checked={paymentMode === "cod"}
      onChange={() =>
        setPaymentMode(paymentMode === "cod" ? "" : "cod")
      }
    />
    <span className="checkmark"></span>
  </label>
</div>

                  <button type="submit" className="site-btn">Place order</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
      <Instagram/>
    </>
  );
};

export default Checkout;