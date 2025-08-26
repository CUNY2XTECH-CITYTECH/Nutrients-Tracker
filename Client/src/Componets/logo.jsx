import { Link } from "react-router-dom"

export function Logo ({className = "", endpoint="/"}) {
    return(
    <Link to={endpoint} className ="logo-link"><div className={`logo ${className}`}>Nutrient Tracker</div></Link>
)}