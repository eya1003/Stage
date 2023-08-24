


import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function SignUpForm() {
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    imageUrl: null,
  });

  //Controle de saisie   user
  const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{2,23}$/;
  //const CIN_REGEX = /^[0-1][0-9]{7}$/;

  //const PHONE_REGEX = /^[2-9][0-9]{7}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;


  /*const DATE_REGEX =
    /^(?:19|20)\d{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;*/
    const IMAGE_REGEX = /\.(png|jpe?g)$/i;

      const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleImageChange = (evt) => {
    const imageFile = evt.target.files[0];
  
    if (imageFile) {
      if (!IMAGE_REGEX.test(imageFile.name)) {
        Swal.fire({
          icon: 'error',
          text: 'Please select a valid PNG or JPG image file.',
        });
        evt.target.value = ''; // Optionally, reset the input value
        return;
      }
  
      setState({
        ...state,
        image: imageFile,
      });
    }
  };
  
  
  const navigate = useNavigate();

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();

    const { firstName, lastName, email, password, imageUrl } = state;

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("image", imageUrl);

    try {
      const response = await axios.post("http://localhost:5000/user/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const userData = response.data;
      console.log(userData);

      setState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        imageUrl: null,
      });

      // Check if the sign-up was successful and navigate to /login if it was
      if (userData && userData._id) {
        navigate("/login");
        Swal.fire(
          'Check Your Email Please!',
        ) 
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          // Handle different error messages based on the response from the server
          if (error.response.data.message === 'User with this E-mail adress already exists') 
          // Handle other error scenarios or show a generic error message
          Swal.fire({
            icon: 'error',
            text: 'E-mail Already Exists'
          })
        }
      } else {
        // Handle network errors or other issues
        alert('An error occurred during login. Please check your internet connection and try again.');
      }    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Create Account</h1>
        <span>or use your email for registration</span>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            name="firstName"
            value={state.firstName}
            onChange={handleChange}
            placeholder="First Name"
            pattern={USER_REGEX.source}
            title="First name must start with a letter and can contain only letters, numbers, hyphens, and underscores (3 to 24 characters)."
            required
          />
          <input
            type="text"
            name="lastName"
            value={state.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            pattern={USER_REGEX.source}
            title="Last name must start with a letter and can contain only letters, numbers, hyphens, and underscores (3 to 24 characters)."
            required
          />
        </div>
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
          pattern={EMAIL_REGEX.source}
          title="Invalid email address format."
          required
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
          pattern={PWD_REGEX.source}
          title="Password must contain at least one lowercase letter, one uppercase letter, one digit, and be 8 to 24 characters long."
          required
        />

            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              accept=".png, .jpg, .jpeg"
              required
            />


        <button>Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpForm;
