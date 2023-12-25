import UserModel from '../models/User.js'

const handleSubmitExam = async (req, res) => {
    const { examId, examTime } = req.body
    const userEmail = req.user

    if (examId === null || examTime === null) {
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


        
        // Automatically mark as incorrect for any question that wasn't answered
        
        currentExam.listOfQuestions.forEach((question) => {
            if (question.selection === null) {
                question.hasAnswered = true
                question.used = true
                question.answeredCorrectly = false
            }

            //tutor mode where selection has been made but the submit button has been pressed (aka user hasn't seen if they were right or wrong yet and haven't seen explanations)
            if (question.selection !== null && !question.hasAnswered) {
                question.hasAnswered = true
                question.used = true
                //answered correctly
                if (question.selection === question.correctChoice) {
                    question.answeredCorrectly = true
                    //question answered incorrectly
                } else {
                    question.answeredCorrectly = false
                }
            }
        })

        let totalPercentFloat
        //Calculate score
        function calculateScore() {
            let totalCorrect = 0
            let totalIncorrect = 0
            currentExam.listOfQuestions.forEach((question) => {
                if (question.answeredCorrectly) {
                    totalCorrect += 1
                } else {
                    totalIncorrect +=1
                }
            })
    
            const totalPercent = ((totalCorrect / (totalIncorrect + totalCorrect)) * 100).toFixed(1)
            totalPercentFloat = parseFloat(totalPercent)

        }
        calculateScore()
        
        currentExam.score = totalPercentFloat

        await user.save();
    
        res.json({ message: 'Exam successfully submitted' });

    } catch (err) {
        console.error('Unable to save submitted exam:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { handleSubmitExam }