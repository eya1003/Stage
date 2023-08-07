
import Dashboard from "views/Dashboard.js";
import Email from "views/Email";
import TableList from "views/Tables.js";
import UserPage from "views/User.js";
import QueuePage from "views/Queue";
import FilePage from "views/File";

const storedUser = localStorage?.getItem('userData');
const user = JSON.parse(storedUser);
const isAdmin = user?.email === "eya.amor23@gmail.com";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/queue",
    name: "Queue",
    icon: "nc-icon nc-bank",
    component: <QueuePage />,
    layout: "/admin",
  },
  {
    path: "/file",
    name: "File",
    icon: "nc-icon nc-bank",
    component: < FilePage/>,
    layout: "/admin",
  },
  {
    path: "/mail",
    name: "Mail",
    icon: "nc-icon nc-bank",
    component: <Email />,
    layout: "/admin",
  },
  
  {
    path: "/user-page",
    name: "User Profile",
    icon: "nc-icon nc-single-02",
    component: <UserPage />,
    layout: "/admin",
  },
 
  // Conditionally include the "Table List" route
  ...(isAdmin
    ? [
        {
          path: "/tables",
          name: "Users List",
          icon: "nc-icon nc-tile-56",
          component: <TableList />,
          layout: "/admin",
        },
      ]
    : []),
 
];
export default routes;
/* 
import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './views/Dashboard';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/dashboard" element={<Dashboard/>} />
     

    </Routes>
  </BrowserRouter>
      );
    
    
}

export default App;
 */
