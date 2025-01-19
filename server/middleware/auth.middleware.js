import jwt from "jsonwebtoken";
import { AsyncHandler } from "../utils/AsyncHandler.utils.js";
import { User } from "../model/user.model.js";

const authVerify = AsyncHandler(async(req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "")

        if(!token){
            return res.status(401).json({message: "Unautorized Request"});
        }

        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

        const user = await User.findById(decodeToken._id).select("-password");

        if(!user){
            return res.status(401).json({message: "Invalid Access Token"});
        }

        req.user = user;
        req.token = token;
        req.userId = user._id;
        
        // console.log(req.user);
        next();
    } catch (error) {
        return res.status(401).json({message: "Invalid Access Token"})

    }
})
export default authVerify;