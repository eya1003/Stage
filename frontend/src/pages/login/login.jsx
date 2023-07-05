import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { login } from '../../userRedux/userActions';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  useEffect(() => {
    if (userInfo && userInfo.verify) {
      navigate('/dashboard');
    } else if (userInfo && !userInfo.verify) {
      alert('Your email is not verified! Please verify your email.');
    }
  }, [userInfo, navigate]);

  return (
    <>
      <div className="hero-container">
        <form className="login" onSubmit={submitHandler}>
          {error && <div className="alert">{error}</div>}
          <center>
            <h1 className="sign">Sign In</h1>
          </center>

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            required
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" variant="primary">
            Sign In
          </Button>

          <Link to="/">New Customer? Register</Link>
        </form>
      </div>
    </>
  );
};

export default Login;
