import User from "../Models/user.js";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function refreshToken (req, res) {
    const cookies = req.cookies;

    //Checks for JWT in cookies
    if(!cookies?.jwt) return res.sendStatus(401);
    console.log(cookies.jwt)
    const refreshToken = cookies.jwt;

    //Gets copy of refreshtoken saved in db
    const userExist = await User.findOne({ refreshToken: refreshToken });
    if(!userExist) return res.sendStatus(403); //Forbidden
    
    //evaluate JWT
    JWT.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || userExist.username !== decoded.username) return res.sendStatus(403);


    //Object that gets enrypted by access and refresh token
    const userInfo = 
        {
            "username":userExist.username,
            "birthday":userExist.birthday,
            "height":userExist.height,
            "gender":userExist.gender,
            "weight":userExist.weight,
            "name":userExist.name
        }

            //creates new access token
            const accessToken = JWT.sign(
                userInfo,
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '15m'}
            );
            res.json({accessToken})
        }
    )    
}