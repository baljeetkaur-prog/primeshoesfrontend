import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { dataContext } from "../../App";

const useFetchCart = () => {
  const [cartdata, setcartdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [youSaved, setYouSaved] = useState(0);
  const [totalMRP, setTotalMRP] = useState(0);
  const [totalFinal, setTotalFinal] = useState(0);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [coupon, setCoupon] = useState(null);

  const { setcarttotal, setitemcount } = useContext(dataContext);

  const email = JSON.parse(sessionStorage.getItem("uinfo"))?.email;

  const fetchcart = async () => {
    if (!email) return;

    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_APIURL}/api/fetchcart/${email}`);

      if (res.status >= 200 && res.status < 300) {
        const { cart, totalBeforeDiscount, totalAfterDiscount, promoDiscount, finalTotal, coupon } = res.data;

        if (!cart || !Array.isArray(cart)) {
          setcartdata([]);
          toast.error("Cart is empty or invalid.");
          return;
        }

        setcartdata(cart);
        setTotalMRP(totalBeforeDiscount);
        setYouSaved(totalBeforeDiscount - totalAfterDiscount);
        setPromoDiscount(promoDiscount || 0);
        setTotalFinal(finalTotal);
        setCoupon(coupon || null);

        setcarttotal(finalTotal);
        setitemcount(cart.reduce((acc, item) => acc + item.quantity, 0));
      } else {
        toast.error("Some error occurred. Please try again.");
      }
    } catch (e) {
      toast.error("Error occurred: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchcart();
  }, []);

  return {
    cartdata,
    fetchcart,
    loading,
    email,
    youSaved,
    totalMRP,
    totalFinal,
    promoDiscount,
    coupon
  };
};

export default useFetchCart;
