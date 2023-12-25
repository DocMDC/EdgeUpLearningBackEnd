import ExamModel from "../models/Exam.js"
import UserModel from '../models/User.js'

const handlePrepareExam = async (req, res) => {
    const { examSessionId, filteredList, timed, tutor } = req.body
    const userEmail = req.user
    

    if (filteredList[0].choices.length <=0 || timed === null || tutor === null || !examSessionId || !userEmail) {
        return res.status(400).json({ message: 'Required to send an object with all of the question information' });
    }

    try {

         // Find user in database
         const user = await UserModel.findOne({ email: userEmail }).exec()

         if (!user) {
             return res.status(404).json({ message: 'User not found' })
         }

        const newExam = await ExamModel.create({
            "mode": {
                "timed": timed,
                "tutor": tutor,
            },
            "numberOfQuestions": filteredList.length,
            "listOfQuestions": filteredList,
            "uniqueId": examSessionId
        });
        
        user.exams.push(newExam)

        // Iterate over user.questions and update the used property to true or false based on filteredList
        user.questions.forEach((userQuestion) => {
            const correspondingFilteredListQuestion = filteredList.find(filteredListQuestion => filteredListQuestion._id.toString() === userQuestion._id.toString());
            if (correspondingFilteredListQuestion) {
                userQuestion.used = true;
            }
        });

        await user.save();
    
        res.json({ message: 'Questions successfully edited' });

    } catch (err) {
        console.error('Unable to add question:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { handlePrepareExam }