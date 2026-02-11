import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerUser = async (req,res) => {
  try {
	const {username, password} = req.body;
	
	if (!username || !password) {
		return res.status(400).json({message: "Missing username OR password" });
	}

	const existingUser = await User.findOne({username});
	if (existingUser) {
		return res.status(409).json({message:"Username already exists"})
	}
	
	const saltRounds = 12;
	const hashedPassword = await bcrypt.hash(password, saltRounds);
	
	const user = await User.create({
		username,
		password:hashedPassword,
	});

	res.status(201).json({
		message:"User registered successfully",
		user: {
			id:user._id,
			username:user.username,
		},
	});
	} catch (error) {
	console.error("Register error:", error);
	res.status(500).json({message:"Server error"});
	}
};

export const loginUser = async(req, res) => {
	try {
		const {username, password} = req.body;
		
		if (!username || !password) {
			return res.status(400).json({message:"Missing username OR password"});
		}
	
		const user = await User.findOne({username});
		if (!user) {
			return res.status(401).json({message:"Username not found"})};
		
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({message:"Password Incorrect"});
		}
		
		const token = jwt.sign(
			{userId: user._id, username:user.username, role:user.role,},
			process.env.JWT_SECRET,
			{expiresIn:"1h"}
		);
		
		res.json({
			message:"Login successful",
			token,
			user:{
				id:user._id,
				username:user.username,
			},
		});
	} catch (error) {
	console.error("Login error:", error);
	res.status(500).json({message:"Server error"});
	}
};

