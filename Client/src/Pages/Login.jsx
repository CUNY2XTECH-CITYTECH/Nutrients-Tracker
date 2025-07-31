import {useState, useEffect} from "react"
import axios from "axios"

export function Login () {

    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [errorMes, setErrorMes] = useState('');

    //View user input in the console
    useEffect(() =>{
        console.log("User:",user, "Pass:",pass)
    }, [user,pass])

    async function signInHanndle (e) {
        e.preventDefault()
        try {
            const response = await axios.post("http://localhost:3000/login", 
                            JSON.stringify(
                                            {
                                                user:user,
                                                pass:pass
                                            }
                                        ))
            console.log(response.data)
        } catch(e){
            console.error(e)
        }
        
    }

    return (
        <div className = "page-parent">
        <section className="main-page-container">
            <h1>Login</h1>
            <form onSubmit={signInHanndle} className="login-form">

                {/*The title and input box of all the data the user going to add*/}
                <label htmlFor="user">Username:</label><br/>
                <input 
                    type="text" 
                    id="user" 
                    name="user" 
                    autoComplete="off"
                    onChange = {(e) => setUser(e.target.value)} /><br/>{/*When user fills input box, it updates the User state in our code*/}

                <label htmlFor="pass">Password:</label><br/>
                <input 
                    type="password" 
                    id="pass" 
                    name="pass" 
                    autoComplete="off"
                    onChange = {(e) => setPass(e.target.value)} /><br/>
                
                <button>Login</button>
                    


            </form>
        </section>
        </div>
    )
}