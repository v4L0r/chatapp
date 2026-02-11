import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({message:"No token provided"});
        }
        
        const token=authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.userId).select("-password");
        
        if (!user) {
            return res.status(401).json({message:"User not found"});
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error.", error) ;
        return res.status(401).json({message:"Unauthorized"});
    }
};   

const requireAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  };




export default authMiddleware;
export {requireAdmin}
