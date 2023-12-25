import UserModel from '../models/User.js'

const handleSubmitAnswer = async (req, res) => {
    const { examId, questionIndex, selectionNumber } = req.body
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
        
        // Modify question of interest hasAnswered key with value to true (aka question has been answered)
        currentExam.listOfQuestions[questionIndex].hasAnswered = true

        //If what the user selected is the desginated correct choice then update question with answeredCorrectly to true; else false
        //Must add one to selectionNumber because this was built using array nomenclature and the correctChoice is not 0 indexed (starts with 1)
        if (currentExam.listOfQuestions[questionIndex].correctChoice === selectionNumber) {
            currentExam.listOfQuestions[questionIndex].answeredCorrectly = true
        } else {
            currentExam.listOfQuestions[questionIndex].answeredCorrectly = false
        }

        await user.save();
    
        res.json({ message: 'Submission successfully saved' });

    } catch (err) {
        console.error('Unable to save submitted answer:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { handleSubmitAnswer }