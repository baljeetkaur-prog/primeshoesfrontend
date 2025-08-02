import React, { useEffect, useState } from 'react';
import {
  FaUserShield, FaUsers, FaShoppingCart, FaMoneyBill, FaBoxOpen,
  FaExclamationTriangle, FaLock, FaSignOutAlt, FaUserPlus, FaUndo, FaBan
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Admindashboard.css'
import { decryptToken } from '../utils/securetoken';


const Adminsidebar = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('Admin User');

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

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    localStorage.removeItem('adminToken');
    window.dispatchEvent(new Event("adminLogin"));
    navigate('/adminlogin');
  };

  const linkStyle = {
    color: 'inherit',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  return (
    <div className="admin-sidebar">
      <h4 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FaUserShield /> {adminName}
      </h4>

      <ul>
        <li>
          <Link to="/adminorders" style={linkStyle}><FaShoppingCart /> View Orders</Link>
        </li>
        <li>
          <Link to="/adminsales" style={linkStyle}><FaMoneyBill /> View Sales</Link>
        </li>
         <li>
         <Link to="/adminreturnsandcancel" style={linkStyle}><FaBan /> Returns & Cancels
</Link>

        </li>
        
        <li>
          <Link to="/manageproducts" style={linkStyle}><FaBoxOpen /> Manage Products</Link>
        </li>
        <li>
          <Link to="/adminlowstock" style={linkStyle}><FaExclamationTriangle /> Low Stock</Link>
        </li>
        <li>
          <Link to="/adminusers" style={linkStyle}><FaUsers /> View Users</Link>
        </li>
        <li>
          <Link to="/adminchangepass" style={linkStyle}><FaLock /> Change Password</Link>
        </li>
        <li>
          <Link to="/addadmin" style={linkStyle}><FaUserPlus /> Add New Admin</Link>
        </li>
        <li
          onClick={handleLogout}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FaSignOutAlt /> Logout
        </li>
      </ul>
    </div>
  );
};

export default Adminsidebar;
