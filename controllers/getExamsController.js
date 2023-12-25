import UserModel from '../models/User.js'

const handleGetExams = async (req, res) => { 
    const userEmail = req.user

    try {
        // Find user in database
        const user = await UserModel.findOne({ email: userEmail }).exec()

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        
        const allExams = user.exams

        if (!allExams) {
            return res.status(401).json({ message: 'No exams in database'})
        }

        res.json({ allExams })
    } catch (err) {
        console.error('Unable to get exams:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { handleGetExams }
