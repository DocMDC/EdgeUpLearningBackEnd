import ExamQuestionModel from "../models/ExamQuestions.js";
import UserModel from '../models/User.js'


const handleGetQuestions = async (req, res) => { 
    try {
        const questionsObj = await ExamQuestionModel.find().exec()

        if (!questionsObj) {
            return res.status(401).json({ message: 'No questions in database'})
        }

        res.json({ questionsObj })
    } catch (err) {
        console.error('Unable to get question:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { handleGetQuestions }
