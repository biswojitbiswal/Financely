import { User } from "../model/user.model.js";


const generateAccessToken = async(userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        const accessToken = await user.generateToken();
        // console.log(accessToken)
        return {accessToken}
    } catch (error) {
        throw new Error("Something Went Wrong While Generating Access Token");
    }
}

const registerUser = async(req, res) => {
    try {
        const {name, email, password, cpassword} = req.body;
    
        if([name, email, password, cpassword].some((field) => field?.trim() === "")){
            return res.status(400).json({message: "All Fields are Required!"})
        }

        if (!email || email.indexOf('@') === -1 || email.indexOf('.') === -1 || 
            email.indexOf('@') === 0 || email.indexOf('.') === email.length - 1 || 
            email.indexOf('@') > email.indexOf('.')) {
            return res.status(400).json({ message: "Fill Correct Email" });
        }

        if(password !== cpassword){
            return res.status(400).json({message: "Password & Confirm Password Does Not Same"})
        }
    
        const userExist = await User.findOne({email});
    
        if(userExist){
            return res.status(409).json({message: "User Already Exist"});
        }
    
        const user = await User.create({
            name,
            email,
            password,
        })
    
        const createdUser = await User.findById(user._id).select("-password");
    
        if(!createdUser){
            return res.status(404).json({message: "user not Found!"});
        }
    
        const {accessToken} = await generateAccessToken(createdUser._id);
    
        return res.status(201).json({
            message: "User Register Successfully",
            user: createdUser,
            userId: createdUser._id,
            token: accessToken,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

const loginUser = async(req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || email.includes('@') === -1 || !email.includes('.') === -1 || email.indexOf('@') > email.indexOf('.')){
            return res.status(400).json({message: "Give Correct Email"});
        }

        if(!password || password.length < 8){
            return res.status(400).json({message: "Password Should Be More Than 8 Character"})
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({message: "User Does Not Exist"});
        }

        console.log("Checking Password...");
        const isValidPassword = await user.isPasswordCorrect(password);
        console.log("Password Validation Result:", isValidPassword);

        if(!isValidPassword){
            return res.status(401).json({message: "Invalid User Authentication"})
        }

        const {accessToken} = await generateAccessToken(user._id);

        const loggedinuser = await User.findById(user._id).select("-password");



        return res.status(200).json({
            message: "User Login Successfully",
            user: loggedinuser,
            token: accessToken,
            userId: loggedinuser._id
        })
    } catch (error) {
        console.log("error");
        return res.status(500).json({ message: error.message });
    }
}

const getCurrUser = async(req, res) => {
    try {
        const user = req.user;
        // console.log(req.user);

        if(!user) {
            return res.status(404).json({message: "Something Went Wrong"})
        }

        return res.status(200).json({
            message: "User Fetched Successfully", 
            userData : user,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

export {
    registerUser,
    loginUser,
    getCurrUser

}