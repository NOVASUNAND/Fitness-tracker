import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./routes/User.js";

dotenv.config();

const app = express();




const allowedOrigins = [
  "http://localhost:3000",
  "https://fitness-tracker-sun.netlify.app" 
];

// We define the cors options
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  // This explicitly tells cors to handle preflight requests
  // and send a 204 (No Content) success status.
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// 1. Logger (to see all requests)
app.use((req, res, next) => {
  console.log(`INCOMING REQUEST: ${req.method} ${req.url}`);
  next();
});


app.use(cors(corsOptions));





app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true })); 


app.use("/api/user/", UserRoutes);


app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Hello world",
  });
});

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

// Database and Server Start
const connectDB = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGODB_URL) 
    .then(() => console.log("Connected to Mongo DB"))
    .catch((err) => {
      console.error("failed to connect with mongo");
      console.error(err);
    });
};

const startServer = async () => {
  try {
    connectDB();
    app.listen(8080, () => console.log("Server started on port 8080"));
  } catch (error) {
    console.log(error);
  }
};

startServer();