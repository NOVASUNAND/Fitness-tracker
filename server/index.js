import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./routes/User.js";

const app = express();

app.use(cors());

app.use((req, res, next) => {
  console.log(`INCOMING REQUEST: ${req.method} ${req.url}`);
  next();
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true })); 

app.use("/api/user/", UserRoutes);

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Hello world, server is fully operational and secure!",
  });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    console.log("🔄 Initializing secure connection stream using process.env...");
    
    // Completely secure: Pulling directly from Render's dashboard environment variables
    const connectionString = process.env.MONGODB_URL;
    
    if (!connectionString) {
      throw new Error("❌ CRITICAL: process.env.MONGODB_URL is undefined! Check Render Dashboard.");
    }
    
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 10000, 
      socketTimeoutMS: 45000,          
      family: 4                        // Forces IPv4 to instantly kill Render's ReplicaSetNoPrimary DNS bug
    }); 
    
    console.log("🚀 Connected to Mongo DB Successfully!");
  } catch (err) {
    console.error("❌ Failed to connect with mongo");
    console.error(err.message);
  }
};

const startServer = async () => {
  try {
    // 1. Bind to the port FIRST so Render's port scanner passes instantly and doesn't freeze
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`🟢 Server safely bound and listening on port ${port}`);
    });
    
    // 2. Connect to the database right after the server goes live
    await connectDB();
  } catch (error) {
    console.log("Server startup error:", error);
  }
};

startServer();