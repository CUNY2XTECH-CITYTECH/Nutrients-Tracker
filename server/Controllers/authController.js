import User from "../Models/user.js";

export async function saveUser(newUser) {
    try {
        const user = new User({
            name: newUser.name,
            birthday: newUser.birthday,
            height: newUser.height,
            gender: newUser.gender,
            weight: newUser.weight,
            username: newUser.username,
            password: newUser.password,
        });
        await user.save();
        console.log("User Saved to db:");
        console.log(user);
        return user._id;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const createUser = async (req, res) => {
    try {
        const data = req.body;
        const id = await saveUser(data);
        res.json({ id: id });
    } catch (error) {
        res.status(500).json({ error: "Failed to save user to database" });
    }
}

export const checkCred = async (req, res) => {
    try{
        console.log(req.body)
        res.json({Message: "Working"});
    }catch(e){
        console.error(e)
    }
}