import {useState, useEffect} from "react"
import axios from "axios"

export function SignUp () {

    //All of the dynamic data the user are going to add
    const [name, setName] = useState('');
    const [birthday, setBirthday] = useState('')
    const [height, setHeight] = useState('')
    const [weight, setWeight] = useState('')
    const [gender, setGender] = useState('')
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');

    //View user input in the console
    useEffect(() =>{
        console.log("User:",user, "Pass:",pass)
    }, [user,pass])

    //Runs when form is submitted
    async function signUpHanndle (e) {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/register",
                                        JSON.stringify(
                                            {
                                                name:name,
                                                birthday:birthday,
                                                height:height,
                                                gender:gender,
                                                weight:weight,
                                                username:user, 
                                                password: pass,
                                            }
                                        ),
                                        {
                                            headers: {'Content-Type': 'application/json'}
                                        })
        console.log(response.data)
        } catch (error){
            console.error(error)
        }
    }

    return (
        <section className="main-page-container">
            <h1>Sign Up</h1>
            {/* sign up form*/}
            <form onSubmit={signUpHanndle}>
            
                {/*The title and input box of all the data the user going to add*/}
                <label htmlFor="name">Full Name:</label><br/>
                <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    autoComplete="off"
                    onChange = {(e) => setName(e.target.value)} /><br/>{/*When user fills input box, it updates the User state in our code*/}
                    
                <label htmlFor="birthday">Birthday:</label><br/>
                <input 
                    type="date" 
                    id="birthday" 
                    name="birthday" 
                    autoComplete="off"
                    onChange = {(e) => setBirthday(e.target.value)} /><br/>
                    
                <label htmlFor="height">Height(in):</label><br/>
                <input 
                    type="text" 
                    id="height" 
                    name="height" 
                    autoComplete="off"
                    onChange = {(e) => setHeight(e.target.value)} /><br/>

                <label htmlFor="weight">Weight(pounds):</label><br/>
                <input 
                    type="text" 
                    id="weight" 
                    name="weight" 
                    autoComplete="off"
                    onChange = {(e) => setWeight(e.target.value)} /><br/>
                
                <label htmlFor="gender">Gender:</label><br/>
                <input 
                    type="text" 
                    id="gender" 
                    name="gender" 
                    autoComplete="off"
                    onChange = {(e) => setGender(e.target.value)} /><br/>

                <label htmlFor="user">UserName:</label><br/>
                <input 
                    type="text" 
                    id="user" 
                    name="user" 
                    autoComplete="off"
                    onChange = {(e) => setUser(e.target.value)} /><br/>
                <label htmlFor="pass">Password:</label><br/>
                <input 
                    type="password" 
                    id="pass" 
                    name="pass"
                    onChange = {(e) => setPass(e.target.value)}
                    /><br/>
                <button>Regrister</button>
            </form>
        </section>
    )
}