import {useState, useEffect} from "react"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios"
import {Logo} from "../../Components/logo"
import "./SignUp.css"

export function SignUp () {

    //All of data in form saved in formData object using useState
    const [formData, setFormData] = useState({
        name: { value: '', isValid: false, focus: false},
        birthday: { value: '', isValid: false, focus:false},
        height: { value: '', isValid: false, focus: false},
        weight: { value: '', isValid: false, focus: false},
        gender: { value: '', isValid: false, focus: false},
        user: { value: '', isValid: false, focus: false},
        pass: { value: '', isValid: false, focus: false},
        passConfirm: { value: '', isValid: true, focus: false}
    });
    const [success, setSuccess] = useState(false); //States if account been created
    const [errorMes, setErrorMes] = useState('');    //Stores error message from server
    const isFormValid = Object.values(formData).every(input => input.isValid); //Checks if all inputs are valid


    //Client side validation

    // Name: upper and lower char, up to 20 chars
    const nameRegex = /^[A-Za-z\s]{3,20}$/;

    // Username: Char limit between 8-20 (letters, numbers, underscores)
    const userRegex = /^[A-Za-z0-9_]{8,20}$/;

    // Password: 8-20 chars, at least 1 uppercase, 1 number, 1 symbol
    const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,20}$/;

    // Gender: must be male or female, upper or lower
    const genderRegex = /^(male|female)$/;

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

    //PassConfirm: must match the password
    function validatePassConfirm (passConfirm) {
        return formData.pass.value == passConfirm
    }



    //takes name and value from form and tests on validation created above
    const validateField = (name, value) => {
        switch(name) {
            case 'name': return nameRegex.test(value);
            case 'birthday': return validateBirthday(value);
            case 'height': return validateHeight(value);
            case 'weight': return validateWeight(value);
            case 'gender': return genderRegex.test(value);
            case 'user': return userRegex.test(value);
            case 'pass': return passRegex.test(value);
            case "passConfirm": return validatePassConfirm(value);
            default: return false;
        }
    };




    //Updates repective attribute in formData state*/}    
    const handleChange = (e) => {
        const { name, value } = e.target;   //Decrostrut user input  
        const isValid = validateField(name, value);     //checks if it vaild
  
        setFormData(prev => ({          //updates formData state
            ...prev,                    //Keeps previous attruibes
            [name]: {...prev[name], value, isValid }  //Update respective attribute with its value and validity
        }));
        if (name == "pass"){
            passMatch(e)
        }
        // console.log("name:", name,"value:" , value,"isValid:" , isValid,"focus:" , formData[name].focus);
    };

    //Whenever password gets changes, checks if it matches confirm password
    function passMatch (e) {
        const { name, value } = e.target;
        const match = formData.passConfirm.value == value
        setFormData(prev => ({          
            ...prev,                    
            passConfirm: {...prev.passConfirm, isValid:match }  
        }));
    }

    //Sets the focus when user click on input box to display the instructions
    function setFocus (e) {
        const name = e.target.name
        setFormData(prev => ({
            ...prev,
            [name]: {
                ...prev[name],
                focus:true
            }
        }))
    }


    //Runs when form is submitted, sends data to server, resets all states*/}
    async function signUpHandle(e) {
    e.preventDefault();
    setErrorMes(''); // Clear previous error
    setSuccess(false); // Reset success state

    try {
        const response = await axios.post(
        "http://localhost:3000/register",
        {
            name: formData.name.value,
            birthday: formData.birthday.value,
            height: formData.height.value,
            gender: formData.gender.value,
            weight: formData.weight.value,
            username: formData.user.value,
            password: formData.pass.value,
        },
        {
            headers: { 'Content-Type': 'application/json' },
        }
        );

        if (response.data?.success) {
        setSuccess(true);
        return;
        }

    } catch (error) {
        console.error('Signup failed:', error);
        if (error.response.data?.errorMes) 
            return setErrorMes(error.response.data.errorMes);
         }
    }

    

    return (
        <div className="signup-page-parent">
        <div className="logo-header">
            <Logo/>
        </div>
        <section className="signup-main-page-container">
            <h1 className="signup-title">Sign Up</h1>
            {success ? (
                <p className="signup-acc-made">Account Created! <Link to="/login">Login</Link></p>
            ):(
                <>
            {/* sign up form*/}
            <form onSubmit={signUpHandle} className="sign-form">
            
                {/*The title and input box of all the data the user going to add*/}
                <label htmlFor="name">Full Name:</label>
                <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    autoComplete="off"
                    onFocus={setFocus}      //Updates focus state for repective attribute to display instructions
                    onChange = {handleChange} />{/*When user fills input box, it updates repective attribute in formData state*/}

                <p className ={formData.name.focus == true && formData.name.isValid == false ? "signup-instructions": "offscreen"}>  {/*Sets the error message on or off screen wheather it has focus and invalid*/}
                    <FontAwesomeIcon icon={faInfoCircle}/> Name must have only letters and 3-20 characters long.
                </p>
                    
                <label htmlFor="birthday">Birthday:</label>
                <input 
                    type="date" 
                    id="birthday" 
                    name="birthday" 
                    onFocus={setFocus}
                    onChange = {handleChange} />

                <p className ={formData.birthday.focus == true && formData.birthday.isValid == false ? "signup-instructions": "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle}/> Name must be at between 12-100 years old.
                </p>
                    
                <label htmlFor="height">Height(in):</label>
                <input 
                    type="text" 
                    id="height" 
                    name="height"
                    autoComplete="off"
                    onFocus={setFocus}
                    onChange = {handleChange} />
                
                <p className ={formData.height.focus == true && formData.height.isValid == false ? "signup-instructions": "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle}/> Must be between 36-86 inches
                </p>

                <label htmlFor="weight">Weight(lb):</label>
                <input 
                    type="text" 
                    id="weight" 
                    name="weight" 
                    autoComplete="off"
                    onFocus={setFocus}
                    onChange = {handleChange} />
                
                <p className ={formData.weight.focus == true && formData.weight.isValid == false ? "signup-instructions": "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle}/> You need to be between 70-500 pounds
                </p>
                
                <label htmlFor="gender">Gender:</label>
                <select 
                    id="gender" 
                    name="gender"
                    onFocus={setFocus}
                    onChange = {handleChange}>
                        <option value=""></option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                </select>

                <p className ={formData.gender.focus == true && formData.gender.isValid == false ? "signup-instructions": "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle}/> Please select your gender
                </p>

                <label htmlFor="user">UserName:</label>
                <input 
                    type="text" 
                    id="user" 
                    name="user" 
                    autoComplete="off"
                    onFocus={setFocus}
                    onChange = {handleChange} />

                <p className ={formData.user.focus == true && formData.user.isValid == false ? "signup-instructions": "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle}/> Username may include upper and lower case latters, number, and underscores. 8-20 charracters only.
                </p>
                    
                <label htmlFor="pass">Password:</label>
                <input 
                    type="password" 
                    id="pass" 
                    name="pass"
                    onFocus={setFocus}
                    onChange = {handleChange}/>

                <p className ={formData.pass.focus == true && formData.pass.isValid == false ? "signup-instructions": "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle}/> Password must have upper and lower case letter, one number and symbol. 8 characters only.  
                </p>

                <label htmlFor="passConfirm">Comfirm Password:</label>
                <input 
                    type="password" 
                    id="passConfirm" 
                    name="passConfirm"
                    onFocus={setFocus}
                    onChange = {handleChange}/>

                <p className ={formData.passConfirm.isValid == false ? "signup-instructions": "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle}/> Passwords must match  
                </p>

                <p className={errorMes ==''?"offscreen":"signup-error-mes"}>{errorMes}</p>

                <button className="signup-regrister-btn"disabled={!isFormValid}>Regrister</button>
            </form>
            <p className="signup-login-text">Already have an account, <Link to="/login" className="signup-login-link">Login!</Link></p>
            </>
        )}
        </section>
        </div>
    )
}
