import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import "./log.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import {
  faUser,
  faLock,
  faPhone,
  faMailBulk,
  faGlobeAfrica,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import WorkersDashboard from './worker/WorkersDashboard';

import order from "./img/order.svg";
import work from "./img/work.svg";

function Login() {
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [signUpPassword, setSignUpPassword] = useState("");

  useEffect(() => {
    document.title = "Sign in & Sign up";

    const signUpBtn = document.querySelector("#sign-up-btn");
    const signInBtn = document.querySelector("#sign-in-btn");
    const container = document.querySelector(".container");

    signUpBtn.addEventListener("click", () => {
      container.classList.add("sign-up-mode");
    });

    signInBtn.addEventListener("click", () => {
      container.classList.remove("sign-up-mode");
    });
  }, []);

  // Generate Password Function
  function generatePassword() {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars[Math.floor(Math.random() * chars.length)];
    }
    setSignUpPassword(pass);
  }

  const africanCountries = [
    "Algeria","Angola","Benin","Botswana","Burkina Faso","Burundi",
    "Cabo Verde","Cameroon","Central African Republic","Chad","Comoros",
    "Congo (Republic)","Congo (Democratic Republic)","Djibouti","Egypt",
    "Equatorial Guinea","Eritrea","Eswatini","Ethiopia","Gabon","Gambia",
    "Ghana","Guinea","Guinea-Bissau","Kenya","Lesotho","Liberia","Libya",
    "Madagascar","Malawi","Mali","Mauritania","Mauritius","Morocco","Mozambique",
    "Namibia","Niger","Nigeria","Rwanda","Sao Tome and Principe","Senegal",
    "Seychelles","Sierra Leone","Somalia","South Africa","South Sudan","Sudan",
    "Tanzania","Togo","Tunisia","Uganda","Zambia","Zimbabwe",
  ];

  return (
    <div className="container">
      {/* FORMS */}
      <div className="forms-container">
        <div className="signin-signup">
          
          {/* SIGN IN FORM */}
          <form className="sign-in-form">
            <h2 className="title">Customer Log In</h2>

            <div className="input-field">
              <FontAwesomeIcon icon={faUser} />
              <input type="text" placeholder="Username" />
            </div>

            <div className="input-field" style={{ position: "relative" }}>
              <FontAwesomeIcon icon={faLock} />
              <input
                type={showSignInPassword ? "text" : "password"}
                placeholder="Password"
              />
              <span
                onClick={() => setShowSignInPassword(!showSignInPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#555",
                }}
              >
                <FontAwesomeIcon
                  icon={showSignInPassword ? faEyeSlash : faEye}
                />
              </span>
            </div>

            <input type="submit" value="Log In" className="btn solid" />

            <p className="social-text">Contact us via</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faWhatsapp} />
              </a>
            </div>
          </form>

          {/* SIGN UP FORM */}
          <form className="sign-up-form">
            <h2 className="title">Customer Sign Up</h2>

            <div className="input-field">
              <FontAwesomeIcon icon={faUser} />
              <input type="text" placeholder="Username" />
            </div>

            <div className="input-field">
              <FontAwesomeIcon icon={faMailBulk} />
              <input type="email" placeholder="Email" />
            </div>

            <div className="input-field">
              <FontAwesomeIcon icon={faPhone} />
              <input type="text" placeholder="Contact Details" />
            </div>

            {/* PASSWORD WITH GENERATOR */}
            <div className="input-field" style={{ position: "relative" }}>
              <FontAwesomeIcon icon={faLock} />
              <input
                type={showSignUpPassword ? "text" : "password"}
                placeholder="Password"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
              />
              <span
                onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#555",
                }}
              >
                <FontAwesomeIcon
                  icon={showSignUpPassword ? faEyeSlash : faEye}
                />
              </span>
            </div>

            {/* GENERATE PASSWORD BUTTON */}
            <button
              type="button"
              onClick={generatePassword}
              className="btn solid"
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                cursor: "pointer",
              }}
            >
              Generate Strong Password
            </button>

            <div className="input-field">
              <FontAwesomeIcon icon={faGlobeAfrica} />
              <select id="country-select">
                <option value="">Select Country</option>
                {africanCountries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <input type="submit" value="Sign Up" className="btn solid" />

            <p className="social-text">Contact us via</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faWhatsapp} />
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* PANELS */}
      <div className="panels-container">
        {/* LEFT PANEL */}
        <div className="panel left-panel">
          <div className="content">
            <h3>Welcome back</h3>
            <p>If new, kindly sign up now and connect with skilled household workers near you.😊</p>
            <button className="btn transparent" id="sign-up-btn">
              Sign Up
            </button>
          </div>
          <img src={order} className="image" alt="Order" />
        </div>

        {/* RIGHT PANEL */}
        <div className="panel right-panel">
          <div className="content">
            <h3>Already have an account here?</h3>
            <p>Good to see you! Log in to manage your home tasks effortlessly!😉</p>
            <button className="btn transparent" id="sign-in-btn">
              Sign In
            </button>
          </div>
          <img src={work} className="image" alt="Work" />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page (default route) */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        
        {/* Worker Dashboard Route */}
        <Route path="/worker/dashboard" element={<WorkersDashboard />} />
        
        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;