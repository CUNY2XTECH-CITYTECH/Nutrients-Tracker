import axios from "axios"
import AuthContext from "../context/authProvider"
import { useContext } from "react"
axios.defaults.withCredentials = true;



// If our initial request fails because our access token expires, This function will give the user a new access token and retry the request
const UseRefreshToken = () => {
    const { setAuth } = useContext(AuthContext)

    //Get a new access token from /check api endpoint in server. Requires refresh token saved in cookie
    const refresh = async () => {
        const response = await axios.get("http://localhost:3000/check", {
            withCredentials: true       //Sends our refresh token in our http only cookie
        });


        //After getting the new access token, save it by updating our global auth context
        setAuth(prev => {
            return {...prev, accessToken: response.data.accessToken}
        });
        return response.data.accessToken       //funciton returns the new access token
    }
    return refresh;
};

export default UseRefreshToken;