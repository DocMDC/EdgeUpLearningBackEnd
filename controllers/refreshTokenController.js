import UserModel from '../models/User.js'
import jwt from 'jsonwebtoken'

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const userFound = await UserModel.findOne({ refreshToken }).exec();
    if (!userFound) return res.sendStatus(403); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || userFound.email !== decoded.email) return res.sendStatus(403);
            const roles = Object.values(userFound.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": decoded.email,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            res.json({ roles, accessToken })
        }
    );
}

export { handleRefreshToken }