import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch  } from "react-redux";

function SignInForm() {
  const [state, setState] = useState({
    email: "",
    password: ""
  });

   const {emailToken}=useParams()
  console.log(emailToken)

    // New function to handle email verification
    const handleEmailVerification = async () => {
      try {
        const response = await axios.put(
          `http://localhost:5000/user/verifyEmail/${emailToken}`
        );
        const verificationData = response.data;
  
        // Handle the verification response, show a message, etc.
        console.log(verificationData);
      } catch (error) {
        console.error("Error during email verification:", error);
      }
    };
  
    // Check if emailToken exists in the URL on component mount
    useEffect(() => {
      if (emailToken) {
        handleEmailVerification();
      }
    }, [emailToken]);
 
  const navigate = useNavigate();

  const [error, setError] = useState(null); // Change the initial value to null

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();

    const { email, password } = state;

    try {
      const response = await axios.post("http://localhost:5000/user/login", { email, password });
      const userData = response.data; // This will contain the user data or error message from the backend
      console.log(userData);

      // Reset the form
      setState({
        email: "",
        password: ""
      });

      // Check if login was successful and user data is present
      if (userData && userData.token) {
        // Save the user data or token in local storage if needed
        localStorage.setItem("userData", JSON.stringify(userData));

        // Navigate to /admin/dashboard
        navigate("/admin/dashboard");
      } else {
        // Handle login failure
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="form-container sign-in-container">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleOnSubmit}>
        <h1>Sign in</h1>
        <span>or use your account</span>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={state.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
        />
        <a href="#">Forgot your password?</a>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default SignInForm;
