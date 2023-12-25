import UserModel from '../models/User.js'
import bcrypt from 'bcrypt'
import ROLES_LIST from '../config/roles_list.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();
import ExamQuestionModel from "../models/ExamQuestions.js";


const handleRegister = async (req, res) => {
    const { email, password } = req.body;
    // If somehow someone hacks front-end and sends req without email / password
    if (!email || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Prevent duplicate emails
    const duplicate = await UserModel.findOne({ email: email }).exec();
    if (duplicate) {
        return res.status(409).json({ message: 'Email already used' });
    }

    try {
        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Get question list from database and add to user's account
        const questionsObj = await ExamQuestionModel.find().exec()

        if (!questionsObj) {
            return res.status(401).json({ message: 'No questions in database'})
        }

        // Store new user in the database
        await UserModel.create({
            "email": email,
            "roles": {
                "User": ROLES_LIST.user,
                // "Teacher": ROLES_LIST.teacher,
                // "Admin": ROLES_LIST.admin,
            },
            "password": hashedPassword,
            "questions": questionsObj
        });

        // Verify user is in the database
        const userFound = await UserModel.findOne({ email: email }).exec();

        // Find roles
        const roles = Object.values(userFound.roles).filter(Boolean);

        // JWT token
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "email": userFound.email,
                    "roles": roles
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '50s' }
        );
        const refreshToken = jwt.sign(
            { "email": userFound.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Save refreshToken with the current user
        userFound.refreshToken = refreshToken;
        await userFound.save();

        // Create a cookie with the refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, /*secure: true, sameSite: 'None', */ maxAge: 0.5 * 60 * 60 * 1000 });

        // Send authorization roles and access token
        res.json({ roles, accessToken });

    } catch (err) {
        console.error('Registration failed:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export { handleRegister };
