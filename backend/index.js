import express from "express"
import dotenv from 'dotenv'
import { connectDB } from "./database/db.js";
import  userRoutes  from "./routes/user.js";
dotenv.config();
const app = express();
app.use(express.json())

const port = process.env.PORT;

app.use("/api", userRoutes);
app.listen(port,()=>{
    console.log('server is running on http://localhost:${port}');
    connectDB()
})