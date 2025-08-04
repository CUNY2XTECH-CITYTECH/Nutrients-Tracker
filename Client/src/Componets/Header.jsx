import { Link } from "react-router-dom"
import { Logo } from "./logo"

export function Header() {
    return(
    <div className="header-container">
            <Logo/>
            <Link to="/login" className ="header-login-link btn">Login</Link>
            <Link to="/signUp" className ="header-signup-link btn">Sign Up</Link>
     </div>

)}