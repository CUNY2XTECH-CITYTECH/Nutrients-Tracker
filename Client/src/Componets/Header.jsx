import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="header-container">
      <Link to="/" className="header-logo-link">
        <div className="logo">Nutrient Tracker</div>
      </Link>
      <nav className="header-nav">
        <Link to="/login" className="header-btn-link">
          <button className="login-btn header-btn">Login</button>
        </Link>
        <Link to="/signUp" className="header-btn-link">
          <button className="sign-up-btn header-btn">Sign Up</button>
        </Link>
      </nav>
    </header>
  );
}