
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';
import { useDispatch, useSelector } from 'react-redux';

import NavDropdown from 'react-bootstrap/NavDropdown';
import LinkContainer from 'react-bootstrap/NavLink';
import { Logout } from '../userRedux/userActions';

const Navbar = () => {

  
  const dispatch = useDispatch()
  const userLogin =useSelector(state =>state.userLogin)
  const {userInfo} =userLogin

  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(Logout())
    navigate("/login");
}
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-custom">
      <div className="container">
        <Link to="/" className="navbar-brand">Logo</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">About</Link>
            </li>
            {/* Add more navbar items as needed */}
          </ul>
          <form className="d-flex">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>
          {userInfo?(
           <div style={{marginLeft: '120px',marginTop: '-1.8px'}} > 
                    <NavDropdown  
                     title={userInfo.lastName + " " + userInfo.firstName } id="username"
                     style={{ }}        
                     >
                        <LinkContainer  to='/profile'>
                <lord-icon
                    src="https://cdn.lordicon.com/bhfjfgqz.json"
                    trigger="hover"
                    colors="primary:#121331"
                    title="Profile"
                    >

                </lord-icon>
                                      
                       
                        </LinkContainer>
                        <LinkContainer  to='/userupdate'>
                            <NavDropdown.Item id="profile" > UPDATE PROFILE</NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Item id="logout" onClick={logoutHandler} >LOGOUT</NavDropdown.Item>
                    </NavDropdown>  </div>
            
            )  : 
            <Link className="nav_links" to={"/login"} >
                SIGNIN
                </Link>         
            }  
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
