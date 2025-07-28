import { Link } from "react-router-dom";


export function Login () {
    return (
    <>
    <div className="side-bar-container">
            <Link to="/home"><button>Home</button></Link>
            <Link to="/logs"><button>Logs</button></Link>
            <Link to="/food"><button>Food</button></Link>
            <Link to="/stats"><button>Stats</button></Link>
     </div>
    <div>
        <h1>This is the login page</h1>
    </div>
    </>
    )
}