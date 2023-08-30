
import Dashboard from "views/Dashboard.js";
import Email from "views/Email";
import UserPage from "views/User.js";
import QueuePage from "views/checkQueue";
import QueueِConfig from "views/Queue";
import FileConfig from "views/File";
import FilePage from "views/CheckFiles";
import UsersList from "views/UsersList";
import { Navigate } from "react-router-dom";

const storedUser = localStorage?.getItem('userData');
const user = JSON.parse(storedUser);
const isAdmin = user?.email === "eya.amor23@gmail.com";
const userLoggedIn = !!storedUser;

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: userLoggedIn ? <Dashboard /> : <Navigate to="/login" />, // Use Navigate to redirect

    layout: "/admin",
  },
  
  {
    path: "/configQueue",
    name: "Queue Config",
    icon: "nc-icon nc-bank",
    component: userLoggedIn ? <QueueِConfig /> : <Navigate to="/login" />, // Use Navigate to redirect
    layout: "/admin",
  },
  {
    path: "/queue",
    name: "Queue",
    icon: "nc-icon nc-bank",
    component: userLoggedIn ? <QueuePage /> : <Navigate to="/login" />,
    layout: "/admin",
  },
  {
    path: "/fileConfig",
    name: "File Config",
    icon: "nc-icon nc-bank",
    component: userLoggedIn ? <FileConfig /> : <Navigate to="/login" />, 
    layout: "/admin",
  },
  {
    path: "/file",
    name: "File ",
    icon: "nc-icon nc-bank",
    component: userLoggedIn ? <FilePage /> : <Navigate to="/login" />, 
    layout: "/admin",
  },
  {
    path: "/mail",
    name: "Mail",
    icon: "nc-icon nc-bank",
    component: userLoggedIn ? <Email /> : <Navigate to="/login" />, 
    layout: "/admin",
  },
        {
          path: "/tables",
          name: "Users List",
          icon: "nc-icon nc-tile-56",
          component: <UsersList />,
          layout: "/admin",
        },
  
  {
    path: "/user-page",
    name: "User Profile",
    icon: "nc-icon nc-single-02",
    component: <UserPage />,
    layout: "/admin",
  },
];
export default routes;
