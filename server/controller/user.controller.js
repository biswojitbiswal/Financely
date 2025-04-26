import { User } from "../model/user.model.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.utils.js";


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

const authnticateWithGoogle = async(req, res, next) => {
    try {
        const {name, email } = req.body;

        if([name, email].some((field) => field?.trim() === "")){
            return res.status(400).json({message: "All Fields are Required!"})
        }

        const userExist = await User.findOne({email});

        if(userExist){
            const {accessToken} = await generateAccessToken(userExist._id);

            const loginUser = await User.findById(userExist._id).select("-password -cart");

            return res.status(200).json({
                message: "User Login Successfully",
                user: loginUser,
                userId: loginUser._id,
                token: accessToken,
            });
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)

            const newUser = await User.create({
                name,
                email,
                password: generatedPassword,
            }).select("-password");

            if (!newUser) {
                return res
                  .status(500)
                  .json({ message: "Something went wrong while registering user" });
            }

            const {accessToken} = await generateAccessToken(newUser._id);

            return res.status(200).json({
                message: "User Registered Successfully",
                user: newUser,
                userId: newUser._id.toString(),
                token: accessToken,
              });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

const profileImageUpdate = async (req, res, next) => {
    try {
      const file = req.files?.profile[0].path;
      console.log(file);
      if (!file) {
        return res.status(400).json({ message: "Image file is required!" });
      }
  
      const uploadedFile = await uploadFileOnCloudinary(file);
      console.log(uploadedFile);
      if (!uploadedFile || !uploadedFile.data.secure_url) {
        return res.status(500).json({ message: "File Upload Failed" });
      }
  
      const profile = uploadedFile.data.secure_url;
  
      await User.findByIdAndUpdate(req.user._id, { profile });
  
      return res.status(201).json({ message: "Profile Image Updated" });
    } catch (error) {
      next(error);
    }
  };
  
  const changeUsername = async (req, res, next) => {
    try {
      const { username } = req.body;
  
      if (!username) {
        return res.status(400).json({ message: "Username Required" });
      }
  
      const user = req.user;
  
      if (!user) {
        return res.status(400).json({ message: "Unauthorized User" });
      }
  
      user.name = username;
      await user.save();
  
      return res.status(201).json({ message: "Username Changed" });
    } catch (error) {
      next(error);
    }
  };
  
  const resetPassword = async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
  
      if ([oldPassword, newPassword].some((field) => field.trim() === "")) {
        return res.status(400).json({ message: "All Fields Required" });
      }
  
      const user = await User.findById(req.user._id).select("_id password");
  
      if (!user) {
        return res.status(404).json({ message: "User Not Found" });
      }
  
      if(oldPassword === newPassword){
          return res.status(400).json("Old Password & New Password  Must Be Different")
      }
  
      const isPasswordMatch = await user.isPasswordCorrect(oldPassword);
  
      if (!isPasswordMatch) {
        return res.status(403).json({ message: "Invalid User Authentication" });
      }
  
      user.password = newPassword;
      await user.save();
  
      return res.status(201).json({ message: "Password Updated Successfully" });
    } catch (error) {
      next(error);
    }
  };

export {
    registerUser,
    loginUser,
    getCurrUser,
    authnticateWithGoogle,
    profileImageUpdate,
    changeUsername,
    resetPassword,
}