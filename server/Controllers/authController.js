import User from "../Models/user.js";
import bcrypt from "bcrypt"
import JWT from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

export async function userLogin (req, res) {
    const data = req.body;

    //Checks if username and passsword were received
    if(!data.username || !data.password) return res.status(400).json({"errorMes" : "**Username and Password are required.**"});

    //Checks if username exists in db
    const userExist = await User.findOne({ username: data.username });
    if(!userExist)  return res.status(401).json({'errorMes': "**Username or password are incorrect**"})

    //Get the password
    const match = await bcrypt.compare(data.password, userExist.password)
    if(!match) return res.status(401).json({'errorMes': "**Username or password are incorrect**"})
    
    //create JWT
    const accessToken = JWT.sign(
        {"username": userExist.username},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '30s'}
    );
    const refreshToken = JWT.sign(
        {"username": userExist.username},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '1d'}
    );

    //Update user with refresh token. Allows user to logout before refresh token expires.
    userExist.refreshToken = refreshToken
    await userExist.save();

    //Send refreshToken to client as http cookie. Can't be accessed with js 
    res.cookie('jwt', refreshToken, {httpOnly: true, sameSite:"None", secure:true, maxAge: 24 * 60 * 60 * 1000}); //24 hours, recorded in milliseconds
    
    //Send accessToken to client
    res.json({accessToken});
}