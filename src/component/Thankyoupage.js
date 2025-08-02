import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaCheckCircle } from "react-icons/fa";
import Instagram from "./Instagram";

const Thankyoupage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderNumber = location.state?.orderNumber;

  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__links">
                <a href="/" className="text-decoration-none">
                  <FaHome style={{ marginRight: "8px", color: "#ca1515" }} /> Home
                </a>
                <span className="ms-2">Thank You</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thank You Section */}
      <section className="checkout spad" style={{ backgroundColor: "#fff5f5" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <div
                className="thankyou-wrapper p-4 rounded-4"
                style={{
                  background: "#fff",
                  border: "1px solid #ffd6d6",
                  boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
                  padding: "40px 30px",
                }}
              >
                {/* Success Icon */}
                <div
                  style={{
                    backgroundColor: "#e7fbe9",
                    width: "70px",
                    height: "70px",
                    margin: "0 auto 20px auto",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 0 6px #d0f0d4",
                  }}
                >
                  <FaCheckCircle size={38} style={{ color: "#28a745" }} />
                </div>

                {/* Stylish Heading */}
                <h2
                  className="mb-2"
                  style={{
                    color: "#ca1515",
                    fontWeight: "600",
                    fontSize: "1.6rem",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Thank You for Your Order
                </h2>

                {/* Order Number */}
                {orderNumber && (
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#444",
                      marginBottom: "10px",
                    }}
                  >
                    We’ve received your order.<br />
                    <span style={{ fontWeight: "600" }}>
                      Order #{orderNumber}
                    </span>
                  </p>
                )}

                <p
                  className="mt-2"
                  style={{
                    fontSize: "15px",
                    color: "#777",
                    marginBottom: "25px",
                  }}
                >
                  You can view the details in <strong>My Orders</strong>.
                </p>

                {/* CTA Button */}
                <button
                  onClick={() => navigate("/orders")}
                  className="site-btn mt-3"
                  style={{
                    backgroundColor: "#ca1515",
                    color: "#fff",
                    border: "none",
                    padding: "10px 24px",
                    fontSize: "15px",
                    fontWeight: "500",
                    borderRadius: "25px",
                    boxShadow: "0 5px 12px rgba(202, 21, 21, 0.2)",
                    transition: "all 0.3s ease",
                  }}
                >
                  View My Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Instagram />
    </>
  );
};

export default Thankyoupage;
