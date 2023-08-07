import React, { useState } from "react";
import "./style.css";
import SignUpForm from "./resetPassword";

export default function Interface() {
  const [type, setType] = useState("signUp");
  const handleOnClick = text => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");
  return (
    <div className="Interface">
      <div className={containerClass} id="container">
        <SignUpForm />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please reset your password
              </p>
              
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button
                className="ghost "
                id="signUp"
                onClick={() => handleOnClick("signUp")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
