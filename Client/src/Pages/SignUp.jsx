import {useState, useEffect} from "react"
import axios from "axios"

export function SignUp () {

    //All of the dynamic data the user are going to add

    const [name, setName] = useState(''); //Saves the text the user inputs for repective input box
    const [validName, setValidName] = useState(false) //States if data entered is valid 


    const [birthday, setBirthday] = useState('')
    const [validBirthday, setValidBirthday] = useState(false)


    const [height, setHeight] = useState('')
    const [validHeight, setValidHeight] = useState(false)


    const [weight, setWeight] = useState('')
    const [validWeight, setValidWeight] = useState(false)


    const [gender, setGender] = useState('')
    const [validGender, setValidGender] = useState(false)


    const [user, setUser] = useState('');
    const [validUser, setValidUser] = useState(false)

    const [pass, setPass] = useState('');
    const [validPass, setValidPass] = useState(false)



// Name: upper and lower char, up to 20 chars
const nameRegex = /^[A-Za-z]{3,20}$/;

// Username: Char limit between 8-20 (letters, numbers, underscores)
const userRegex = /^[A-Za-z0-9_]{8,20}$/;

// Password: 8-20 chars, at least 1 uppercase, 1 number, 1 symbol
const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,20}$/;

// Weight: must be a number in range 70-500
function validateWeight(weight) {
  const num = Number(weight);
  return !isNaN(num) && num >= 70 && num <= 500;
}

// Height: must be number in range 48-96
function validateHeight(height) {
  const num = Number(height);
  return !isNaN(num) && num >= 48 && num <= 96;
}

// Birthday: must be at least 12 years before current date, not more than 100 years old
function validateBirthday(dateString) {
  const birthDate = new Date(dateString);
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 12, today.getMonth(), today.getDate());
  const maxDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
  
  return birthDate <= minDate && birthDate >= maxDate;
}

// Gender: must be "male" or "female" (case insensitive)
const genderRegex = /^(male|female)$/i;


    //View user input in the console
    

    useEffect(() =>{
        const valid = nameRegex.test(name) //Returns boolean if "name" is valid
        console.log(name)
        console.log(valid)
        setValidName(valid) //Sets vaildName  
    }, [name]) //Runs whenever "name" input gets changed

    useEffect(() =>{
        const valid = validateBirthday(birthday) 
        console.log(birthday)
        console.log(valid)
        setValidBirthday(valid) 
    }, [birthday])
    
    useEffect(() =>{
        const valid = validateHeight(height) 
        console.log(height)
        console.log(valid)
        setValidHeight(valid) 
    }, [height])

    useEffect(() =>{
        const valid = validateWeight(weight) 
        console.log(weight)
        console.log(valid)
        setValidWeight(valid) 
    }, [weight])

    useEffect(() =>{
        const valid = genderRegex.test(gender) 
        console.log(gender)
        console.log(valid)
        setValidGender(valid) 
    }, [gender]) 

    useEffect(() =>{
        const valid = userRegex.test(user) 
        console.log(user)
        console.log(valid)
        setValidUser(valid) 
    }, [user]) 

    useEffect(() =>{
        const valid = passRegex.test(pass) 
        console.log(pass)
        console.log(valid)
        setValidPass(valid) 
    }, [pass]) 


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