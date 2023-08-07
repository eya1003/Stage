import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { emailToken } = useParams(); // Get the emailToken from the URL using useParams

  const handleResetPassword = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/user/reset-password/${emailToken}`,
        {
          email,
          newPassword,
        }
      );
      setMessage(response.data.message);
      navigate("/login")
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An error occurred while processing your request.");
      }
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form>
        <h1>Reset Your Password</h1>
        <span>or use your email for registration</span>

        <input
          style={{ marginTop: "28px" }}
          type="email"
          name="email"
          placeholder="Email"
          title="Invalid email address format."
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Add the onChange handler to update the state
        />
        <input
          style={{ marginTop: "28px" }}
          type="password"
          name="password"
          placeholder="New Password"
          title="Password must be between 8 and 24 characters and contain at least one lowercase letter, one uppercase letter, and one digit."
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)} // Add the onChange handler to update the state
        />
        <button
          style={{ marginTop: "28px" }}
          type="button"
          onClick={handleResetPassword}
        >
          Reset
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default SignUpForm;
