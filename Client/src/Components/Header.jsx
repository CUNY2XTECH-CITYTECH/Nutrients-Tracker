import { Link } from "react-router-dom"

export function Header() {
    return(
    <div className="header-container">
            <Link to="/" className ="header-logo-link"><div className="logo">Nutrient Tracker</div></Link>
            <Link to="/login" className ="header-btn-link"><button className="login-btn header-btn">Login</button></Link>
            <Link to="/signUp" className ="header-btn-link"><button className="sign-up-btn header-btn">Sign Up</button></Link>
     </div>

)}