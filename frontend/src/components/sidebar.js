import React, { useState } from 'react';
import { FaTh, FaBars, FaUserAlt, FaRegChartBar, FaCommentAlt, FaShoppingBag, FaThList } from "react-icons/fa";
import { NavLink } from 'react-router-dom';

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const menuItem = [
    {
      path: "/",
      name: "Accueil",
      icon: <FaTh />
    },
    {
      path: "/a-propos",
      name: "À Propos",
      icon: <FaUserAlt />
    },
    {
      path: "/analytics",
      name: "Analytique",
      icon: <FaRegChartBar />
    },
    {
      path: "/commentaires",
      name: "Commentaires",
      icon: <FaCommentAlt />
    },
    {
      path: "/produit",
      name: "Produit",
      icon: <FaShoppingBag />
    },
    {
      path: "/liste-produits",
      name: "Liste des Produits",
      icon: <FaThList />
    }
  ];

  return (
    <div className="container">
      <div style={{ width: isOpen ? "200px" : "50px" }} className="sidebar">
        <div className="top_section">
          <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">Logo</h1>
          <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars">
            <FaBars onClick={toggle} />
          </div>
        </div>
        {
          menuItem.map((item, index) => (
            <NavLink to={item.path} key={index} className="link" activeClassName="active">
              <div className="icon">{item.icon}</div>
              <div style={{ display: isOpen ? "block" : "none" }} className="link_text">
                <span className="link_name">{item.name}</span>
              </div>
            </NavLink>
          ))
        }
      </div>
      <main>{children}</main>
    </div>
  );
};

export default Sidebar;
