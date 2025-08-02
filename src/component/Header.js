import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext, dataContext } from '../App';
import { jwtDecode } from 'jwt-decode';
import { useLocation } from 'react-router-dom';
import { decryptToken } from '../utils/securetoken';
import './Header.css'
import { toast } from 'react-toastify';
const Header = ({ onSearchClick }) => {
  const { user, setUser } = useContext(UserContext);
  const { itemcount, fetchCartCount } = useContext(dataContext);
  const navigate = useNavigate();
  const location = useLocation();
  const hideHeaderElements = location.pathname === '/adminlogin' || location.pathname === '/adminregister';

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
const [loadingSuggestions, setLoadingSuggestions] = useState(false);
const [isAdmin, setIsAdmin] = useState(false);
const [adminRole, setAdminRole] = useState(null);
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const toggleMobileMenu = () => {
  setMobileMenuOpen(prev => !prev);
};




useEffect(() => {
  const checkAdmin = async () => {
    const encryptedToken = sessionStorage.getItem("adminToken");
    if (!encryptedToken) {
      setIsAdmin(false);
      setAdminRole(null);
      return;
    }

    try {
      const decryptedToken = await decryptToken(encryptedToken); // 🔓 decrypt first
      const decoded = jwtDecode(decryptedToken); // ✅ then decode
      setIsAdmin(true);
      setAdminRole(decoded.role);
    } catch (err) {
      console.error("Invalid admin token", err);
      setIsAdmin(false);
      setAdminRole(null);
    }
  };

  checkAdmin();
  window.addEventListener("adminLogin", checkAdmin);
  window.addEventListener("storage", checkAdmin);

  return () => {
    window.removeEventListener("adminLogin", checkAdmin);
    window.removeEventListener("storage", checkAdmin);
  };
}, []);



  const searchRef = useRef();

const handleLogout = () => {
  setUser(null);
  sessionStorage.removeItem("adminToken");
  sessionStorage.removeItem("uinfo");
  toast.success("Logged out successfully"); // ✅ Show toast
  navigate('/');
};
  const handleInputChange = async (e) => {
  const value = e.target.value;
  setSearchQuery(value);

  if (value.trim()) {
    setLoadingSuggestions(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Suggestion fetch failed", err);
    } finally {
      setLoadingSuggestions(false);
    }
  } else {
    setSuggestions([]);
  }
};

  useEffect(() => {
    if (user?.email) {
      fetchCartCount(user.email);
    }
  }, [user, fetchCartCount]);

  const handleSearchToggle = () => {
    setShowSearch(prev => !prev);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
     navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  // Optional: Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="container-fluid">
        <div className="row align-items-center">
          {/* Logo */}
          
<div className="col-xl-2 col-lg-2 d-flex align-items-center justify-content-between">
  <div className="header__logo">
    <Link to="/"><img src="/img/logo.png" alt="Ashion Logo" /></Link>
  </div>

  {/* Hamburger icon shown only on mobile */}
  {!hideHeaderElements && (
    <div className="canvas__open d-lg-none" onClick={toggleMobileMenu}>
      <i className="fa fa-bars"></i>
    </div>
  )}
</div>


          {/* Navigation */}
          <div className="col-xl-7 col-lg-7 d-flex justify-content-center justify-content-lg-start">
            <nav className="header__menu" style={{ width: '100%' }}>
             <ul className={`d-flex justify-content-${user ? 'start' : 'center'}`} style={{ flexWrap: 'wrap', gap: '15px', listStyle: 'none', padding: 0, marginBottom: 0 }}>
 {isAdmin ? (
  <li className="active"><Link to="/admindashboard">Admin Home</Link></li>
) : (
  <li className="active"><Link to="/">Home</Link></li>
)}


    <>
      <li><Link to="/products?category=women">Women’s</Link></li>
      <li><Link to="/products?category=men">Men’s</Link></li>
      <li><Link to="/products?category=kids">Kid's</Link></li>
      <li><Link to="/products?category=handbags">Handbags</Link></li>
      <li><Link to="/contact">Contact</Link></li>
    </>

  {user && !isAdmin && (
    <>
      <li><Link to="/orders">Orders</Link></li>
      <li><Link to="/changepassword">Password</Link></li>
    </>
  )}
</ul>

            </nav>
          </div>

          {/* Right - Auth + Icons + Search */}
          <div className="col-xl-3 col-lg-3">
            {!hideHeaderElements && (
              
            <div className="header__right d-flex align-items-center justify-content-end" style={{ gap: '15px' }}>
{isAdmin ? (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      whiteSpace: 'nowrap',
    }}
    title={`Welcome, ${adminRole === 'superadmin' ? 'Super Admin' : 'Admin'}`}
  >
    <span style={{ fontWeight: 'bold', color: '#ca1515' }}>
      Welcome, {adminRole === 'superadmin' ? 'Super Admin' : 'Admin'}
    </span>
    <button
      onClick={() => {
        sessionStorage.removeItem("adminToken");
        setIsAdmin(false);
        setAdminRole(null);
        window.dispatchEvent(new Event("adminLogin")); // 👈 Triggers Header update
        navigate("/adminlogin");
      }}
      style={{
        background: 'none',
        border: 'none',
        color: '#ca1515',
        cursor: 'pointer',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
      }}
    >
      Logout
    </button>
  </div>
) : user ? (
  //...

  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      whiteSpace: 'nowrap',
    }}
    title={`Welcome, ${user.name}`}
  >
    <span style={{ fontWeight: 'bold' }}>
      Welcome, {user.name.split(' ')[0]}
    </span>
    <button
      onClick={handleLogout}
      style={{
        background: 'none',
        border: 'none',
        color: '#ca1515',
        cursor: 'pointer',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
      }}
    >
      Logout
    </button>
  </div>
) : (
  <>
    <Link to="/login" style={{ color: '#ca1515', fontWeight: 'bold' }}>
      Login
    </Link>
    <Link to="/register" style={{ color: '#ca1515', fontWeight: 'bold' }}>
      Register
    </Link>
  </>
)}


              <ul className="header__right__widget d-flex align-items-center" style={{ marginLeft: '10px', gap: '15px', listStyle: 'none', padding: 0, marginBottom: 0 }}>
                {!isAdmin && (
<li className="d-none d-lg-block position-relative" ref={searchRef}>
  <button
    className="search-switch"
    onClick={handleSearchToggle}
    style={{
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '18px',
      color: '#111',
    }}
    title="Search"
  >
    <span className="icon_search"></span>
  </button>

  {showSearch && (
<form
  onSubmit={handleSearchSubmit}
  className="search-dropdown-form"
  style={{
    position: 'absolute',
    top: '80%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#fff',
    border: '1px solid #eee',
    borderRadius: '30px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    padding: '6px 10px',
    zIndex: 999,
    width: '250px',
    maxWidth: '90vw', // Make it shrink on small screens
  }}
>
  <input
    type="text"
    value={searchQuery}
    onChange={handleInputChange}
    placeholder="Search products..."
    autoFocus
    style={{
      border: 'none',
      outline: 'none',
      flex: 1,
      fontSize: '14px',
      padding: '6px 8px',
      borderRadius: '30px',
      color: '#333',
      minWidth: 0, // Prevent overflow on small screens
    }}
  />
  <button
    type="submit"
    style={{
      backgroundColor: '#ca1515',
      color: '#fff',
      border: 'none',
      padding: '6px 12px',
      fontSize: '14px',
      borderRadius: '30px',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    }}
  >
    Go
  </button>

      {suggestions.length > 0 && (
  <ul
    style={{
      position: 'absolute',
      top: '100%',
      left: '0',
      right: '0',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '0 0 10px 10px',
      listStyle: 'none',
      margin: 0,
      padding: '10px 0',
      maxHeight: '200px',
      overflowY: 'auto',
      zIndex: 999,
    }}
  >
    {suggestions.map((item) => (
      <li
        key={item._id}
        onClick={() => {
         navigate(`/products?q=${encodeURIComponent(item.name)}`);
          setSearchQuery('');
          setSuggestions([]);
          setShowSearch(false);
        }}
        style={{
          padding: '8px 16px',
          cursor: 'pointer',
          borderBottom: '1px solid #eee',
        }}
      >
        {item.name}
      </li>
    ))}
  </ul>
)}

    </form>
  )}
</li>
                )}



             {!isAdmin && (
  <li>
    <Link to={user ? "/cart" : "/login"}>
      <span className="icon_bag_alt"></span>
      {itemcount > 0 && <div className="tip">{itemcount}</div>}
    </Link>
  </li>
)}

              </ul>
            </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}

<div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
  <ul>
    {isAdmin ? (
      <li><Link to="/admindashboard" onClick={() => setMobileMenuOpen(false)}>Admin Home</Link></li>
    ) : (
      <>
        <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
        <li><Link to="/products?category=women" onClick={() => setMobileMenuOpen(false)}>Women’s</Link></li>
        <li><Link to="/products?category=men" onClick={() => setMobileMenuOpen(false)}>Men’s</Link></li>
        <li><Link to="/products?category=kids" onClick={() => setMobileMenuOpen(false)}>Kid's</Link></li>
        <li><Link to="/products?category=handbags" onClick={() => setMobileMenuOpen(false)}>Handbags</Link></li>
        <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
        {user && (
          <>
            <li><Link to="/orders" onClick={() => setMobileMenuOpen(false)}>My Orders</Link></li>
            <li><Link to="/changepassword" onClick={() => setMobileMenuOpen(false)}>Password</Link></li>
          </>
        )}
      </>
    )}
  </ul>
</div>


      </div>
    </header>
  );
};

export default Header;
