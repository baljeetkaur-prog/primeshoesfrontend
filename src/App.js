import { useEffect, useState, createContext } from 'react';
import './App.css';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Offcanvas from './component/Offcanvas';
import Header from './component/Header';
import Footer from './component/Footer';
import Searchmodal from './component/Searchmodal';
import SiteRoutes from './component/Siteroutes';
import Scrolltotop from './component/Scrolltotop';

export const UserContext = createContext(null);
export const dataContext = createContext(null);

function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const getInitialUser = () => {
    const userData = sessionStorage.getItem("uinfo");
    return userData ? JSON.parse(userData) : null;
  };
  const [user, setUser] = useState(getInitialUser);
  const [carttotal, setcarttotal] = useState(0);
  const [itemcount, setitemcount] = useState(0);

  const API = process.env.REACT_APP_APIURL;

  // ✅ Define fetchCartCount
  const fetchCartCount = async (email) => {
    try {
      const res = await axios.get(`${API}/api/cart-count/${email}`);
      if (res.data.success) {
        setitemcount(res.data.count || 0);
      } else {
        setitemcount(0);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setitemcount(0);
    }
  };

  // ✅ Keep user in sessionStorage
  useEffect(() => {
    if (user) {
      sessionStorage.setItem("uinfo", JSON.stringify(user));
      fetchCartCount(user.email); // ✅ fetch count when user is set (login or refresh)
    } else {
      sessionStorage.removeItem("uinfo");
      setitemcount(0);
    }
  }, [user]);
useEffect(() => {
  AOS.init({
    duration: 700,
    easing: 'ease-in-out',
    once: true,
    mirror: false,
  });
}, []);




  return (
    <>
      <ToastContainer
  position="top-right"
  autoClose={3000}            // closes after 3s
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="colored"
/>
      <UserContext.Provider value={{ user, setUser }}>
        <dataContext.Provider value={{ carttotal, setcarttotal, itemcount, setitemcount, fetchCartCount }}>
          <Offcanvas />
          <Header onSearchClick={() => setSearchOpen(true)} />
            <Scrolltotop/>
          <SiteRoutes />
          <Footer />
          <Searchmodal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </dataContext.Provider>
      </UserContext.Provider>
    </>
  );
}

export default App;
