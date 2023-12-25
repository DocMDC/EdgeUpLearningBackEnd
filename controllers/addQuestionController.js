import ExamQuestionModel from "../models/ExamQuestions.js";

const handleAddQuestion = async (req, res) => {
    const { subject, organSystem, vignette, choices, explanations, correctChoice } = req.body

    if (!subject || !organSystem || !vignette || !choices || !explanations || !correctChoice) {
        return res.status(400).json({ message: 'All pertinent question information is required' });
    }

    try {
        await ExamQuestionModel.create({
            "subject": subject,
            "organSystem": organSystem,
            "vignette": vignette,
            "choices": choices,
            "explanations": explanations,
            "correctChoice": correctChoice
        })

        res.json({ message: 'Success'})

    } catch (err) {
        console.error('Unable to add question:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { handleAddQuestion }