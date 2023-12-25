import UserModel from '../models/User.js'
const handleLogout = async (req, res) => {
    
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); 
    const refreshToken = cookies.jwt;

    // Look for refresh token in database
    const userFound = await UserModel.findOne({ refreshToken }).exec();
    if (!userFound) {
        res.clearCookie('jwt', { httpOnly: true, /*sameSite: 'None', secure: true */ });
        return res.sendStatus(204);
    }

    // Delete refreshToken in database
    userFound.refreshToken = '';
    await userFound.save();

    res.clearCookie('jwt', { httpOnly: true, /* sameSite: 'None', secure: true */ });
    res.sendStatus(204);
}

export {handleLogout}
