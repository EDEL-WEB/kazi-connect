import { useState } from "react";
import "./work.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import kazlogo from "./img/kazlogo.png";

function Work() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="work-page">
      <img src={kazlogo} className="logo" alt="Kazi Logo" />

      <div className="wrapper">
        <form>
          <h2>Log In As A Worker</h2>

          {/* Username */}
          <div className="put-box">
            <FontAwesomeIcon icon={faUser} />
            <input type="text" placeholder="User" />
          </div>

          {/* Password */}
          <div className="put-box password-input">
            <FontAwesomeIcon icon={faLock} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="toggle-eye"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          {/* Forgot Password */}
          <div className="forgot-pass">
            <a href="#">Forgot password?</a>
          </div>

          {/* Submit Button */}
          <button type="submit">Allow me in</button>

          {/* Register Link */}
          <div className="register-link">
            <p>
              Not yet registered to Kazi Connect? <br />
              <Link to="/work2">Register now.</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Work;
