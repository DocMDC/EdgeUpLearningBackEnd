import UserModel from '../models/User.js'
import ResetReqModel from '../models/ResetReq.js'
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const sendResetLink = async (email, id) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'edgeuplearning@gmail.com',
                pass: process.env.GMAIL_PASSWORD
            }
        });

        const message = {
            to: email,
            subject: 'Reset password link',
            text: `To reset your password, please click on this link: http://localhost:5173/reset/${id}. This link will expire in 5 minutes.`
        };

        const success = await transporter.sendMail(message);
        // Remove request object created in DB after 10 minutes
        if (success) {
            setTimeout(async () => {
                try {
                    await ResetReqModel.deleteOne({ uniqueId: id }).exec();
                } catch (err) {
                    console.log('Could not remove request object ' + err);
                }
            }, 1000 * 60 * 10); // 10 minutes
        }

    } catch (err) {
        console.error('Error sending email: ', err);
        throw new Error('Email could not be sent');
    }
};

const handleForgotPassword = async (req, res) => {
    try {
        const { email } = req.body.email;
        // If somehow someone hacks front-end and sends req without email
        if (!email) {
            return res.status(400).json({ message: 'An email is required' });
        }

        // Find user in database
        const userFound = await UserModel.findOne({ email: email }).exec();

        if (!userFound) return res.sendStatus(401);

        // Create a temp object in DB that can be cross-referenced with the temp ID sent to the user (deleted after 10 minutes - see sendResetLink)
        const tempId = uuidv4();
        await ResetReqModel.create({
            uniqueId: tempId,
            email: userFound.email
        });

        // Send reset link
        sendResetLink(userFound.email, tempId);

        return res.status(200).json({ message: 'Reset email sent successfully' });

    } catch (err) {
        console.error('Error handling forgot password: ', err);

        return res.status(500).json({ message: 'Internal server error' });
    }
};

export { handleForgotPassword };
