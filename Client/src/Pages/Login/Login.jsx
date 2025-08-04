import {useState, useEffect} from "react"
import { Link } from "react-router-dom";
import axios from "axios"
import "../SignUp/Signup.css"
import { Logo } from "../../Componets/logo";

export function Login () {

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
                                        })
            console.log(response.data)
        } catch(e){
            console.error(e)
            if (e.response.data?.errorMes) return setErrorMes(e.response.data.errorMes)
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