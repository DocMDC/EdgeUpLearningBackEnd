import UserModel from '../models/User.js'

const handleUpdateFlaggedQuestions = async (req, res) => {
    const { examId, questionIndex } = req.body
    const userEmail = req.user
    
    if (questionIndex === null || examId === null) {
        return res.status(400).json({ message: 'Required to send an object with all of the question information' });
    }

    if (!userEmail) {
        return res.status(400).json({ message: 'user email required' });
    }

    try {

         // Find user in database
         const user = await UserModel.findOne({ email: userEmail }).exec()

         if (!user) {
             return res.status(404).json({ message: 'User not found' })
         }

         // Find the current exam among all of the user's possible exams
         const currentExam = user.exams.find((exam) => exam.uniqueId === examId)

        if (!currentExam) {
            return res.status(404).json({ message: 'Exam not found' })
        }
        
        // Modify question of interest with the user's updated selection
        currentExam.listOfQuestions[questionIndex].flagged = !currentExam.listOfQuestions[questionIndex].flagged

        await user.save();
    
        res.json({ message: 'Flagged update successfully saved' });

    } catch (err) {
        console.error('Unable to update question:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { handleUpdateFlaggedQuestions }