import {useState, useContext} from "react"
import AuthContext from "../../context/authProvider";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios"
import "../SignUp/Signup.css"
import { Logo } from "../../Componets/logo";

export function Login () {

    const {setAuth} = useContext(AuthContext); //state of global AuthConext to save user's info

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/home";  //If user was redirected to login trying to access private routes, This saves that route to redirect user to that endpoint after login otherwise redirect to home

    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [errorMes, setErrorMes] = useState('');

    async function signInHanndle (e) {
        e.preventDefault()
        setErrorMes('')
        try {
            const response = await axios.post("http://localhost:3000/login", 
                            JSON.stringify(
                                            {
                                                username:user,
                                                password:pass
                                            }
                                        ),
                                        {
                                            headers: {'Content-Type': 'application/json',
                                            withCredentials: true
                                            }
                                        });
            // console.log(response.data)
            const accessToken = response?.data?.accessToken;  //Checks to see if we were sent access token          
                
            setAuth({user, pass, accessToken})  //saves access token in our global context
            setUser('')     //clear our state
            setPass('')     //clear our state
            navigate(from, {replace: true}); //redirects user to 
        } catch(e){
            console.error(e)
            if (e.response.data?.errorMes) return setErrorMes(e.response.data.errorMes)
            if (!e?.response) return setErrorMes("No server response")
        }
        
    }

    return (
        
        <div className = "login-page-parent">
        <div className="logo-header">
            <Logo/>
        </div>
        <section className="login-main-page-container">
            <h1 className="login-title">Login</h1>
            <form onSubmit={signInHanndle} className="login-form">

                {/*The title and input box of all the data the user going to add*/}
                <label htmlFor="user">Username:</label>
                <input 
                    type="text" 
                    id="user" 
                    name="user" 
                    autoComplete="off"
                    onChange = {(e) => setUser(e.target.value)} /><br/>{/*When user fills input box, it updates the User state in our code*/}

                <label htmlFor="pass">Password:</label>
                <input 
                    type="password" 
                    id="pass" 
                    name="pass" 
                    autoComplete="off"
                    onChange = {(e) => setPass(e.target.value)} />

                    <p className={errorMes==''?"offscreen":"login-error-mes"}>{errorMes}</p>
                
                <button disabled={user && pass ? false: true} className="login-login-btn">Login</button>
            </form>
            <p className="signup-login-text">Don't have an account, <Link to="/signup" className="login-signup-link">Sign up!</Link></p>
        </section>
        </div>
    )
}