import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Row, Col, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "./register.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { register } from "../../userRedux/userActions";
import ReCAPTCHA from "react-google-recaptcha";
import SpecialButton from "../../components/button/button";

const Register = () => {
  //State  captcha keni verified wala le
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  //3in icon 
  const [showPassword, setShowPassword] = useState(false);

  // states of simple user
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 

  //validateurs simple user
  const [validFirstName, setValidFirstName] = useState(false);
  const [validLastName, setValidLastName] = useState(false);
  const [validPhone, setValidPhone] = useState(false);
  const [validImageUrl, setValidImageUrl] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [registration, setRegistration] = useState({});

  //box taa terms and conditions
  function handleRadioChange() {
    setIsChecked(!isChecked);
  }

  // Clear the input field when the user interacts with it

  function handleInputFocus(e) {
    e.target.value = "";
  }

  //Controle de saisie   user
  const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{2,23}$/;
  //const CIN_REGEX = /^[0-1][0-9]{7}$/;

  const PHONE_REGEX = /^[2-9][0-9]{7}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;
  /*const DATE_REGEX =
    /^(?:19|20)\d{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;*/
  const IMAGE_REGEX = /\.(png|jpe?g)$/i;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const dispatch = useDispatch();
  //use selector tjibli fel reducer eli houwa userRegister eml store 
  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error,messageSuccess } = userRegister;
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  //hedhi bch taamelek el redirection
  const navigate = useNavigate();

  //Fonction etat el captcha
  const handleCaptcha = (value) => {
    if (value) {
      setIsCaptchaVerified(true);
    } else {
      setIsCaptchaVerified(false);
    }
  };
    //RADIOBOX taa terms and conditions

  const [isChecked, setIsChecked] = useState(false);

  dispatch({
    type: 'REGISTER_SUCCESS',
    payload: { success: true },
  });
  
  // Creating the user
  const submitHandler = async (e) => {
    e.preventDefault(); // Prevent the form from submitting
  
    try {
      await dispatch(register({ firstName, lastName, phone, imageUrl, email, password }));
      // Registration successful
      navigate('/login'); // Navigate to the login page
    } catch (error) {
      // Registration failed
      console.log(error);
      setRegistration(null);
      navigate('/login', { state: { error } }); // Reset the registration state
    }
  };
  
  
  
    /* use effects du controle de saisie */
  

  useEffect(() => {
    const result = USER_REGEX.test(firstName);
    console.log(result);
    console.log(firstName);
    setValidFirstName(result);
  }, [firstName]);

  useEffect(() => {
    const result = USER_REGEX.test(lastName);
    console.log(result);
    console.log(lastName);
    setValidLastName(result);
  }, [lastName]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    console.log(result);
    console.log(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    console.log(result);
    console.log(password);
    setValidPassword(result);
  }, [password]);

  
  useEffect(() => {
    const result = PHONE_REGEX.test(phone);
    console.log(result);
    console.log(phone);
    setValidPhone(result);
  }, [phone]);

  useEffect(() => {
    const result = IMAGE_REGEX.test(imageUrl.name);
    console.log(result);
    console.log(imageUrl.name);
    setValidImageUrl(result);
  }, [imageUrl]);


  
  return (
    <>
      <div className="hero-container">
       
        {/* el message taa el controle de saisie w el loader   */}
       
        <section className="marginTops">
          {error && <div className="alert">{error}</div>}
          {messageSuccess && <div className="alertgreen">{messageSuccess}</div>}

          {loading}
        </section>
        {/* form start    */}
        <form
          className="register"
          encType="multipart/form-data"
        >
          <div
            align="center"
            style={{ marginBottom: "10px", marginTop: "" }}
          >
          
          </div>

          {/* step lowla mtaa el form eli fiha el info taa simple user */}
        
            <>
            <div style={{ marginTop: "-10%"}}>          
                 <h2>Sign Up</h2>
 </div> 
              <input
                id="firstName"
                type="text"
                placeholder="First Name"
                value={firstName}
                required
                onChange={(e) => setFirstName(e.target.value)}
              ></input>

              <p
                id="notefirstname"
                className={firstName && !validFirstName ? "none" : "hide"}
              >
                First Name is at least 3 letters and cannot contain special
                characters or numbers
              </p>
              <input
                id="lastName"
                required
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              ></input>
              <p
                id="notelastname"
                className={lastName && !validLastName ? "none" : "hide"}
              >
                Last Name is at least 3 letters and cannot contain special
                characters or numbers
              </p>
              <input
                id="email"
                required
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
              <p
                id="noteemail"
                className={email && !validEmail ? "none" : "hide"}
              >
                Enter a valid e-mail adress{" "}
              </p>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>

<div className="visibility-icon" onClick={toggleShowPassword}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
            
              <p
                id="notepwd"
                className={password && !validPassword ? "none" : "hide"}
              >
                Password needs to contain at least 1 UpperCase letter , 1
                LowerCase letter, 1 Number and at least 8{" "}
              </p>

              <input
                id="phone"
                type="phone"
                placeholder="phone number"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              ></input>
              <p
                id="noteephone"
                className={phone && !validPhone ? "none" : "hide"}
              >
                Phone contains 8 digits{" "}
              </p>

              <input
                id="imageUrl"
                type="file"
                name="imageUrl"
                accept=".png, .jpg, .jpeg"
                onChange={(e) => setImageUrl(e.target.files[0])}
              ></input>

              <p
                id="noteimag"
                className={imageUrl && !validImageUrl ? "none" : "hide"}
              >
                Enter Valid image type : png , jpg or jpeg{" "}
              </p>

             
            </>
            <>
            <div className="tacbox"  style={{ marginTop: "10px" }}>
                <input
                  id="checkbox"
                  type="checkbox"
                  onChange={handleRadioChange}
                />

                <label htmlFor="checkbox">
                  {" "}
                  I agree to these <a href="#">Terms and Conditions</a>.
                </label>
              </div>
           <ReCAPTCHA style={{ marginTop: "7%" }}
                sitekey="6Ldzy-UkAAAAAOF98pseL_XgounD7zAY-IT1kms1"
                onChange={handleCaptcha}
              />
             

             <section className="marginTops">
  {error && registration === null && (
    <div className="alert">{error}</div>
  )}
  {messageSuccess && (
    <div className="alertgreen">{messageSuccess}</div>
  )}
  {loading}
</section>

<Button
  style={{ marginTop: "-50px" }}
  type="submit"
  disabled={!isChecked || !isCaptchaVerified || !email || !lastName || !password}
  onClick={submitHandler}
>
  Sign Up
</Button>
              <Row className="py-3" style={{ marginTop: "-5%"}}>
                <Col>
                  Have an account?{""} <Link to="/login">Login</Link>
                </Col>
              </Row>

            </>
        
        </form>
        {/* fin form */}
      </div>{" "}
      {/* fin video background */}
    </>
  );
};

export default Register;
