import User from "../Models/user.js";

export async function logout (req, res) {
    // On client make sure to delete the accessToken
     
    const cookies = req.cookies;

    //Checks for JWT in cookies
    if(!cookies?.jwt) return res.sendStatus(204); //successfull and no content
    const refreshToken = cookies.jwt;

    //Checks refreshtoken in db
    const userExist = await User.findOne({ refreshToken: refreshToken });
    if(!userExist) {
        res.clearCookie('jwt', { httpOnly: true,  sameSite:'None', secure:true})
        return res.sendStatus(204);
    }

    //Delete rerefreshToken in db
    userExist.refreshToken = ''
    await userExist.save();

    res.clearCookie('jwt', { httpOnly: true, sameSite:'None', secure:true}); //in production add secure:true, only serves on https
    res.sendStatus(204);
}