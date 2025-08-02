import React, { useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import Adminsidebar from './Adminsidebar';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import './Adminusers.css';
import { decryptToken } from '../utils/securetoken';

const iconStyle = { marginRight: '6px', color: '#ca1515' };

const Adminusers = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [adminName, setAdminName] = useState("Admin User");
  const usersPerPage = 10;
  const API = process.env.REACT_APP_APIURL;

  useEffect(() => {
    fetchUsers();
  }, [API]);

useEffect(() => {
  const encoded = sessionStorage.getItem('adminToken');
  if (encoded) {
    decryptToken(encoded)
      .then(token => {
        const decoded = jwtDecode(token);
        setAdminName(decoded.adminname || "Admin User");
      })
      .catch(err => {
        console.error("Token decryption failed:", err);
        toast.error("Session expired. Please login again.");
        window.location.href = "/adminlogin";
      });
  }
}, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/api/users`);
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to fetch users');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${API}/api/users/${id}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err) {
      toast.error('Error deleting user');
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    toast.success("Logged out");
    window.location.href = "/adminlogin";
  };

  return (
    <div className="admin-layout d-flex">
      <Adminsidebar adminName={adminName} handleLogout={handleLogout} />

      <div className="flex-grow-1 users-container">
        <h5 className="admin-users-title">All Registered Users</h5>

        <div className="table-wrapper">
          {currentUsers.length === 0 ? (
            <p className="text-center">No users found.</p>
          ) : (
            <table className="sales-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th><FaUser style={iconStyle} /> Name</th>
                  <th><FaEnvelope style={iconStyle} /> Email</th>
                  <th><FaPhone style={iconStyle} /> Phone</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, idx) => (
                  <tr key={user._id}>
                    <td>{indexOfFirstUser + idx + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.role || 'User'}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteUser(user._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {users.length > usersPerPage && (
          <div className="pagination-container">
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
  );
};

export default Adminusers;
