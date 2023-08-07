import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch  } from "react-redux";
import Swal from "sweetalert2";


function SignInForm() {
  
  const [state, setState] = useState({
    email: "",
    password: ""
  });
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState([]);

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
        setMessages("Please Verify Your Email")
      }
    };

    const handleForgetPassword = async (email) => {
      try {
        const response = await axios.post(
          'http://localhost:5000/user/forget-password',
          { email } // Pass the email as part of the request body
        );
    
        const verificationData = response.data;
        // Handle the verification response, show a message, etc.
        console.log(verificationData);
      } catch (error) {
        console.error('Error during email verification:', error);
        setMessages('Please Verify Your Email');
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



  const handleLogin = async (evt) => {

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
            if (!userData){
              console.log("there is no user")
            }
            if (userData && userData.token) {
              // Save the user data or token in local storage if needed
              localStorage.setItem("userData", JSON.stringify(userData));

              // Navigate to /admin/dashboard
              navigate("/admin/dashboard");
            }
                
              } catch (error) {
                if (error.response) {
                  if (error.response.status === 400) {
                    // Handle different error messages based on the response from the server
                    if (error.response.data.message === 'Please Sign up!') {
                      Swal.fire(
                        'Please Sign up!'
                      ) 
                    } else if (error.response.data.message === 'Password is incorrect !') {
                      Swal.fire(
                        'Password is incorrect !'
                      )           
                    }else if (error.response.data.message === 'Your email is not verified! Please verify your email') {
                      Swal.fire(
                        'Your email is not verified!',
                        'Please Check Your Email'
                      )           
                    }else if (error.response.data.message === 'Please Reset your password') 
                     {
                      Swal.fire(
                        'Please Reset your password',
                        'Check Your Email'
                      )           
                    }
                    else if (error.response.data.message === 'This user is blocked') 
                     {
                      Swal.fire(
                        'This account is blocked',
                      )           
                    }
                  } else {
                    // Handle other error scenarios or show a generic error message
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Something went wrong! Please try again'
                    })
                  }
                } else {
                  // Handle network errors or other issues
                  alert('An error occurred during login. Please check your internet connection and try again.');
                }
              }
};



  return (
    <div className="form-container sign-in-container">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <h1>Sign in</h1>
        <span>or use your account</span>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={state.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
          required
        />
        <a href="#" 
        onClick={() => {
          Swal.fire({
            title: "Enter Your Adresse ",
            html: '<input type="email" id="emailInput" class="swal2-input.custom-input" placeholder="Enter your email">',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            preConfirm: () => {
              const email = document.getElementById('emailInput').value;
              return handleForgetPassword(email);
            },
            customClass: {
              popup: 'custom-popup', // Add the custom class for the SweetAlert dialog

              confirmButton: 'custom-confirm', // Add the custom class to the "Confirm" button
              cancelButton: 'custom-cancel', // Add the custom class to the "Cancel" button

            },
          }).then((result) => {
            if (result.isConfirmed) {
              const email = result.value;
              handleForgetPassword(email);
            }
          });
        }}>Forgot your password?</a>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default SignInForm;
