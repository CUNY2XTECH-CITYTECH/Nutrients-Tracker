import { Link } from "react-router-dom";

export function SideBar () {
    return(
        <div className = "side-bar-container">
            <Link to="/login" className="side-bar-link first-link"><button className = "side-bar-btn">Login</button></Link>
            <Link to="/signUp" className="side-bar-link"><button className = "side-bar-btn">Signup</button></Link>
            <Link to="/home" className="side-bar-link"><button className = "side-bar-btn">Home</button></Link>
            <Link to="/logs" className="side-bar-link"><button className = "side-bar-btn">Logs</button></Link>
            <Link to="/food" className="side-bar-link"><button className = "side-bar-btn">Food</button></Link>
            <Link to="/stats" className="side-bar-link"><button className = "side-bar-btn">Stats</button></Link>
            <Link to="/suggestions" className="side-bar-link"><button className = "side-bar-btn">Suggestions</button></Link>

        </div>
    )
}