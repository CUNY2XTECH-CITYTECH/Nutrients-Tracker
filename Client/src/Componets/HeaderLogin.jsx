import { Link } from "react-router-dom";
import { Logo } from "./logo";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function HeaderLogin() {
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await axios.get("http://localhost:3000/logout", {       //Deletes refresh token cookie
                withCredentials: true 
            });
            navigate('/login');          // Redirect to login page after successful logout
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className = "home-header-container">
            <div className="home-header-top">
                <Logo endpoint="/home" className="logged-in-logo"/>
                <button className="header-logout-btn" onClick={handleLogout}>Log Out</button>
            </div>
            <div className="home-header-bottom">
                <Link to="/home" className="side-bar-link"><button className = "home-header-btn">Home</button></Link>
                <Link to="/logs" className="side-bar-link"><button className = "home-header-btn">Logs</button></Link>
                <Link to="/food" className="side-bar-link"><button className = "home-header-btn">Food</button></Link>
                <Link to="/stats" className="side-bar-link"><button className = "home-header-btn">Stats</button></Link>
                <Link to="/suggestions" className="side-bar-link"><button className = "home-header-btn">Suggestions</button></Link>
            </div>
        </div>
        
    );
}