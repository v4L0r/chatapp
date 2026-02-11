import express from "express";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./config/db.js";
import Message from "./models/Message.js";
import User from "./models/User.js";
import authRoutes from "./routes/auth.js";
import authMiddleware from "./middleware/authMiddleware.js";
import { requireAdmin } from "./middleware/authMiddleware.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";





dotenv.config();
connectDB(); 

const createAdmin = async() => {
  const user = await User.create({
	username:"admin",
	password:"$2a$12$kYU66Pd3PFVax3/wpX8bkuF53HiBSFgPZ8k4kLONZKOzqGnyfpZIK",
  });

  console.log("User created: ", user.username);
};


const onlineUsers = new Map();



const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server running");
});


app.get("/api/users",authMiddleware, async (req, res) => {
    try {
        const users = await User.find({username:{$ne:req.user.username}},"username");
        
        res.json(users);
    } catch (err) {
        res.status(500).json({error:"Failed to fetch users"});
    }
});



app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({
        message:"You are authorized",
        user:req.user,
    });
});

app.get(
    "/api/admin/stats",
    authMiddleware,
    requireAdmin,
    (req, res) => {
      res.json({ message: "Admin stats here" });
    }
  );



app.get("/api/messages/:username", authMiddleware, async (req, res)=> {
    const otherUser = await User.findOne({
        username:req.params.username,
    });    
    
    if (!otherUser) {
        return res.status(404).json({message:"User not found"});
    }

    const query = {
        $or: [
            { from:req.user._id, to: otherUser._id},
            { from:otherUser._id, to:req.user._id},
        ],
    };
    
    if (req.query.after) {
        query.createdAt = {$gt: new Date(req.query.after)};
    }
    
    const messages = await Message.find(query)
    .sort({ createdAt: 1 })
    .populate("from", "username")
    .populate("to", "username");

    const normalized = messages.map((m) => ({
        _id: m._id,
        from: m.from.username,
        to: m.to.username,
        content: m.content,
        createdAt: m.createdAt,
      }));
      
    
    res.json(normalized);

});

app.post("/api/messages", authMiddleware, async (req, res) => {
    const { toUsername, content } = req.body;
  
    const recipient = await User.findOne({ username: toUsername });
    if (!recipient) {
      return res.status(404).json({ message: "User not found" });
    }
  
    const message = await Message.create({
      from: req.user._id,
      to: recipient._id,
      content,
    });
  
    console.log(
      `📨 ${req.user.username} → ${recipient.username}: ${content}`
    );
  
    const recipientSocket = onlineUsers.get(
      recipient._id.toString()
    );
  
    if (recipientSocket) {
      io.to(recipientSocket).emit("new_message", {
        _id: message._id,
        from: req.user.username,
        to: recipient.username,
        content,
        createdAt: message.createdAt,
      });
    }
  
    res.status(201).json(message);
  });

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
});


io.use(async (socket, next) => {
    try {
      console.log("Socket auth attempt");
  
      const token = socket.handshake.auth?.token;
      console.log("Token received:", token ? "YES" : "NO");
  
      if (!token) {
        console.log("No token provided");
        return next(new Error("No token"));
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decoded:", decoded);
  
      const user = await User.findById(decoded.userId);
  
      if (!user) {
        console.log("User not found in DB");
        return next(new Error("User not found"));
      }
  
      socket.user = user;
      console.log("Socket authenticated as:", user.username);
  
      next();
    } catch (err) {
      console.log("Socket auth error:", err.message);
      next(new Error("Unauthorized"));
    }
  });



io.on("connection", (socket) => {
    console.log("User connected:", socket.user.username);
    
    onlineUsers.set(socket.user._id.toString(), socket.id);
        
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.user.username);
        onlineUsers.delete(socket.user._id.toString());
    });
});



const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
