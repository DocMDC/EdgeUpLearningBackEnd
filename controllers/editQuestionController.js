import ExamQuestionModel from "../models/ExamQuestions.js";

const handleEditQuestion = async (req, res) => {
    const { questionId, subject, organSystem, vignette, choices, explanations, correctChoice } = req.body

    if (!questionId || !subject || !organSystem || !vignette || !choices || !explanations || !correctChoice) {
        return res.status(400).json({ message: 'All pertinent question information is required' });
    }

    try {
        const questionFound = await ExamQuestionModel.findOne({_id: questionId}).exec()

        if (!questionFound) {
            return res.status(404).json({ message: 'Question not found.' });
        }

        await questionFound.updateOne({
            "subject": subject,
            "organSystem": organSystem,
            "vignette": vignette,
            "choices": choices,
            "explanations": explanations,
            "correctChoice": correctChoice
        })

        res.json({ message: 'Question successfully edited'})

    } catch (err) {
        console.error('Unable to add question:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { handleEditQuestion }