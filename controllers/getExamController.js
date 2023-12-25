import UserModel from '../models/User.js'

const handleGetExam = async (req, res) => { 
    const { id } = req.params
    const userEmail = req.user

    if (!id) {
        return res.status(400).json({ 'message': 'id is required' })
    }

    try {

        // Find user in database
        const user = await UserModel.findOne({ email: userEmail }).exec()

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const exam = user.exams.filter((exam => exam.uniqueId === id))
        

        if (!exam) {
            return res.status(401).json({ message: 'No exam with this ID in database'})
        }
        res.json({ exam })

    } catch (err) {
        console.error('Unable to get question:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { handleGetExam }
