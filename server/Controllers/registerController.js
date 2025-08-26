import User from "../Models/user.js";
import bcrypt from "bcrypt"

//function to store user in database
export async function saveUser(newUser, hashedPass) {
    try {
        const user = new User({
            name: newUser.name,
            birthday: newUser.birthday,
            height: newUser.height,
            gender: newUser.gender,
            weight: newUser.weight,
            username: newUser.username,
            password: hashedPass,
        });
        await user.save();
        console.log("User Saved to db:");
        console.log(user);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const createUser = async (req, res) => {
    try {
        const data = req.body;

        //Checks if data from all fields was received
        if (!data.name || !data.birthday || !data.height || !data.gender || !data.weight || !data.username || !data.password)
            return res.status(400).json({"errorMes" : "**All fields are required.**"});

        //Checks if username already taken in db
        const userTaken = await User.findOne({ username: data.username });
        if(userTaken)  return res.status(409).json({'errorMes': "**Username is already taken.**"})

        //encrypt the password
        const hashedPass = await bcrypt.hash(data.password, 10);

        //saves user to the db
        const id = await saveUser(data, hashedPass);
        return res.status(201).json({'success':"Account created!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to save user to database" });
    }
}