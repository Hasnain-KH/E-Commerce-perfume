import express from "express";
import User from '../models/User.js';

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send({ status: 400, message: "Please fill all the fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).send({ status: 409, message: "User already exists" });
    }


    const user = await User.create({
        name,
        email,
        password

    });

    res.status(201).send({
        status: 201, message: "User registered successfully", user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });

})
export default authRouter