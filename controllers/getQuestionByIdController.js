import ExamQuestionModel from "../models/ExamQuestions.js";

const handleGetQuestionById = async (req, res) => { 
    const { id } = req.params

    if (!id) {
        return res.status(400).json({ 'message': 'id is required' })
    }

    // Find question in database
    try {
        const questionObj = await ExamQuestionModel.findOne({ _id: id }).exec()

        if (!questionObj) {
            return res.status(401).json({ message: 'No question with this ID in database'})
        }
        res.json({ questionObj })

    } catch (err) {
        console.error('Unable to get question:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { handleGetQuestionById }
