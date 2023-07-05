import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Dashboard from './pages/Dashboard.jsx';
import About from './pages/About.jsx';
import Analytics from './pages/Analytics.jsx';
import Comment from './pages/Comment.jsx';
import Product from './pages/Product.jsx';
import ProductList from './pages/ProductList.jsx';
import Navbar from './components/navbar';
import Login from './pages/login/login';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email/:emailToken" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/about" element={<About />} />
      <Route path="/comment" element={<Comment />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/product" element={<Product />} />
      <Route path="/productList" element={<ProductList />} />
    </Routes>
  </BrowserRouter>
      );
    
    
}

export default App;
