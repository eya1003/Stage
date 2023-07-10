import React from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
      <img src="../../../public/logo1.png" alt="Logo" className="logo-image" />
      </div>
      <ul className="sidebar-nav" style={{marginTop: "30%"}}>
        <li className="sidebar-item">
          <Link to="/dashboard" className="sidebar-link">Dashboard</Link>
        </li>
        <li className="sidebar-item">
          <Link to="/about" className="sidebar-link">About</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
