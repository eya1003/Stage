import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();
  const { emailToken } = useParams(); // Get the emailToken from the URL using useParams

  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;

  const handleResetPassword = async () => {
    if (!PWD_REGEX.test(newPassword)) {
      setPasswordError("Password must contain at least one lowercase letter, one uppercase letter, one digit, and be 8 to 24 characters long.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/user/reset-password/${emailToken}`,
        {
          email,
          newPassword,
        }
      );
      setMessage(response.data.message);
      navigate("/login");
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
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={{ marginTop: "28px" }}
          type="password"
          name="password"
          placeholder="New Password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
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
