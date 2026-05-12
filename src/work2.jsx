import { useState } from "react";
import "./work2.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faPhone,
  faMailBulk,
  faGlobeAfrica,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import kazlogo from './img/kazlogo.png';

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

function Work2() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  // Password Generator Function
  function generatePassword() {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars[Math.floor(Math.random() * chars.length)];
    }
    setPassword(pass);
  }

  return (
    <div className="work2-page">
      <img src={kazlogo} className="logo" alt="Kazi Logo" />
      <div className="wrapper">
        <form>
          <h2>Sign Up As A Worker</h2>

          {/* Username */}
          <div className="put-box">
            <FontAwesomeIcon icon={faUser} />
            <input type="text" placeholder="User" />
          </div>

          {/* Email */}
          <div className="put-box">
            <FontAwesomeIcon icon={faMailBulk} />
            <input type="email" placeholder="Email" />
          </div>

          {/* Phone */}
          <div className="put-box">
            <FontAwesomeIcon icon={faPhone} />
            <input type="text" placeholder="Contact Details" />
          </div>

          {/* Password with Eye Toggle */}
          <div className="put-box password-input">
            <FontAwesomeIcon icon={faLock} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="toggle-eye"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          {/* Generate Password Button */}
          <button
            type="button"
            className="generate-pass-btn"
            onClick={generatePassword}
            style={{ marginBottom: "15px" }}
          >
            Generate Strong Password
          </button>

          {/* Country */}
          <div className="put-box">
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

          <button type="submit">Allow me in</button>

          <div className="register-link">
            <p>
              Already registered to Kazi Connect? <br /><br />
              <Link to="/work">Log Me In</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Work2;
