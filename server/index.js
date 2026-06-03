import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./routes/User.js";

dotenv.config();

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
    message: "Hello world",
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

// 1. Add 'async' to this function so we can handle the database promise cleanly
const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    
    // We are pasting the absolute raw string here. Render CANNOT misread this.
    await mongoose.connect("mongodb://homie:Homie100@cluster0-shard-00-00.n2epvsd.mongodb.net:27017,cluster0-shard-00-01.n2epvsd.mongodb.net:27017,cluster0-shard-00-02.n2epvsd.mongodb.net:27017/fitness-tracker?ssl=true&replicaSet=atlas-m0z6m8-shard-0&authSource=admin&retryWrites=true&w=majority"); 
    
    console.log("🚀 Connected to Mongo DB Successfully!");
  } catch (err) {
    console.error("❌ Failed to connect with mongo");
    console.error(err);
    process.exit(1); 
  }
};

const startServer = async () => {
  try {
    // 3. Force your server to completely establish the DB connection FIRST
    await connectDB();
    
    // 4. Only start listening for frontend requests AFTER the database is ready
    app.listen(process.env.PORT || 8080, () => console.log(`Server started on port ${process.env.PORT || 8080}`));
  } catch (error) {
    console.log(error);
  }
};

startServer();