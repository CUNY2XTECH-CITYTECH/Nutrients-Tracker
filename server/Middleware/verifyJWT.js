import JWT from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

//Checks if the JWT token is valid
export function verifyJWT (req, res, next) {
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.sendStatus(401);
    console.log(authHeader)

    const token = authHeader.split(' ')[1]      //authHeader in format 'header <token>'. split by space and grab token in index 1
    JWT.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        //callback function receives error and decoded token
        (err, decoded) => {
            if (err) return res.sendStatus(403); //Invalid 403 forbidden
            req.userInfo = decoded
            next()
        }
    )
}