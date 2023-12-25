import UserModel from '../models/User.js'
import bcrypt from 'bcrypt'
import ResetReqModel from '../models/ResetReq.js'

const handleResetPassword = async (req, res) => {
    try {
        const { newPassword, uniqueId } = req.body.paramId;

        if (!newPassword || !uniqueId) {
            return res.status(400).json({ message: 'New password and uniqueId are required.' });
        }

        // Find temporary request in DB with unique ID
        const resetRequest = await ResetReqModel.findOne({ uniqueId: uniqueId });

        if (!resetRequest) {
            return res.status(404).json({ message: 'Reset request not found.' });
        }

        const user = await UserModel.findOne({ email: resetRequest.email }).exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password in DB
        await user.updateOne({ password: hashedPassword });

        return res.status(200).json({ message: 'Password reset successful.' });
    } catch (err) {
        console.error('Error resetting password:', err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

export { handleResetPassword }


