import axios from "axios";

// Define the URLs
const devURL = "http://localhost:8080/api/";
const prodURL = "https://fitnesstrack-vtv1.onrender.com/api/";

// Automatically choose the correct URL based on the environment
const API = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? prodURL : devURL,
});

export const UserSignUp = async (data) => API.post("/user/signup", data);
export const UserSignIn = async (data) => API.post("/user/signin", data);

export const getDashboardDetails = async (token) =>
  API.get("/user/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getWorkouts = async (token, date) =>
  await API.get(`/user/workout${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addWorkout = async (token, data) =>
  await API.post(`/user/workout`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });