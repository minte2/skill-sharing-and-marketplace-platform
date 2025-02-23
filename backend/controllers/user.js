
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"
import sendMail from "../middlewares/sendMail.js";
import { User } from '../models/user.js';
import TryCatch from '../middlewares/TryCatch.js';
export const register = TryCatch(async(req, res)=> {
    
        const {email,name,password} = req.body;
        let user = await User.findOne({email});

        if (user)
            return res.status(400).json({
            message: "user already exists"})
        const hashpassword = await bcrypt.hash(password,10)
            user = {
            name,
            email,
            password:hashpassword
        };
        const otp = Math.floor(Math.random() * 1000000)
        const activationToken = jwt.sign({
            user,
            otp,
        }, process.env.Activation_Secret,
    {
        expiresIn: "5m"
    });
    const data= {
        name,
        otp,
    };
    await sendMail(email,"skill share",data)
    res.status(200).json({
        message:"Otp send to your mail",
        activationToken
    });        
    })

export const verifyUser = TryCatch(async(req,res) => {
    const {activationToken,otp} = req.body;

    const verify = jwt.verify(activationToken, process.env.Activation_Secret);

    if (!verify)
        return res.status(400).json({
    message: "Otp Expired"})
    if (verify.otp !== otp )
        return res.status(400).json({
    message: "Otp Wrong"})

    await User.create({
        name: verify.user.name,
        email: verify.user.email,
        password: verify.user.password,
    })

    res.json({
        message: "User Registered"
    })
})
export const loginUser = TryCatch(async(req,res) => {
    const {email,password} = req.body;

    const user = await User.findOne({email});
    if(!user)
        return res.status(400).json({
    message: "No User with this email"})

    const mathPassword = await bcrypt.compare(password,user.password);
    if(!mathPassword)
        return res.status(400).json({
    message: "wrong Password",})

    const token = await jwt.sign({_id:user._id}, process.env.jwt_Sec,{
        expiresIn: "15d",
    })
    res.json({
        message: 'Welcome back ${user.name}',
        token,
        user,
    })
})