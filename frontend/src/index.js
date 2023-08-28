
  import React from "react";
  import ReactDOM from "react-dom/client";
  import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

  import "bootstrap/dist/css/bootstrap.css";
  import "assets/scss/paper-dashboard.scss?v=1.3.0";
  import "assets/demo/demo.css";
  import "perfect-scrollbar/css/perfect-scrollbar.css";

  import AdminLayout from "layouts/Admin.js";
  import BLogin from "./components/Login/Interface";
  import Reset from "./components/ResetPassword/Interface";

  const root = ReactDOM.createRoot(document.getElementById("root"));

  root.render(
    
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminLayout />} />
        {/* <Route path="/login" element={< Login/>} /> */}
        <Route path="/login" element={< BLogin/>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/verify-email/:emailToken" element={<BLogin/> } />
        <Route path="/reset-password/:emailToken" element={<Reset/> } />
        <Route path="*" element={<BLogin/> } />

      </Routes>
    </BrowserRouter>
  );