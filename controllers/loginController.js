import UserModel from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();
const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        // If somehow someone hacks front-end and sends req without email / password
        if ( !email || !password ){
            return res.status(400).json({ 'message': 'Username and password are required' })
        }

        // Find user in database
        const userFound = await UserModel.findOne({ email: email }).exec()

        if (!userFound) {
            return res.status(401).json({ message: 'Invalid credentials'})
        }

        // Verify password
        const match = await bcrypt.compare(password, userFound.password)

        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials'})
        }

        // Find roles
        const roles = Object.values(userFound.roles).filter(Boolean)

        // JWT tokens
        const accessToken = jwt.sign(
            {   
                "UserInfo": {
                    "email": userFound.email,
                    "roles": roles
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        )
        const refreshToken = jwt.sign(
            { "email": userFound.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )
        
        // Save refreshToken with current user
        userFound.refreshToken = refreshToken
        await userFound.save()

        // Create cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, /*secure: true, sameSite: 'None', */ maxAge: 24 * 60 * 60 * 1000 });
        
        // Send authorization roles and access token 
        res.json({ roles, accessToken })

    } catch (err) {
        console.error('Login failed:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }    
}

export { handleLogin }