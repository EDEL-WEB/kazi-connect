import "./admin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
 
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import kazlogo from './img/kazlogo.png'


function admin () {
    return (
        <div className="admin-page">
            <img src={kazlogo} className="logo" alt="" />
            <div className="wrapper">
            <form action="">
                <h2>Welcome Admin</h2>
                <div className="put-box">
                    <FontAwesomeIcon icon={faUser} />
              <input type="text" placeholder="Admin" />
                </div>

                <div className="put-box">
                    <FontAwesomeIcon icon={faLock} />
              <input type="password" placeholder="Passkey" />
                </div>

                {/* <div className="forgot-pass">
                    <a href="#">Forgot password?</a>
                </div> */}

                <button type="submit">Allow me in</button>

                {/* <div className="register-link">
                    <p>Not yet registered to Kazi Connect. <br /><br />
                       <Link to="/work2">Register now.</Link>
                    </p>
                </div> */}

            </form>
        </div>
        </div>
    );
}
export default admin;