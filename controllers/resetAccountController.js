import ExamQuestionModel from "../models/ExamQuestions.js";
import ExamModel from "../models/Exam.js"
import UserModel from '../models/User.js'

const handleResetAccount = async (req, res) => {
    const userEmail = req.user

    try {
        // Find user in database
        const user = await UserModel.findOne({ email: userEmail }).exec()

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // Remove user exams
        user.exams = []

        // Reset questions to default values
        user.questions.forEach((question) => {
            question.used = false
            question.hasAnswered = false
            question.answeredCorrectly = false
            question.flagged = false
            question.note = ""
            question.hasNote = false
            question.selection = null
        })

        await user.save()

        res.json({ message: 'Account successfully reset'})

    } catch (err) {
        console.error('Unable to reset account:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { handleResetAccount }