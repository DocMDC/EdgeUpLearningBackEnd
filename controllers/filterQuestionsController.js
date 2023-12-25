import UserModel from '../models/User.js'

const handleFilterQuestions = async (req, res) => {
    const userEmail = req.user
    
    try {
        // Find user in database
        const user = await UserModel.findOne({ email: userEmail }).exec()

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const unusedQuestions = user.questions.filter((question) => !question.used);
        const incorrectQuestions = user.questions.filter(
        (question) => question.used && !question.answeredCorrectly && question.hasAnswered
        )

        const subjects = [
            'anatomy',
            'microbiology',
            'biochemistry',
            'embryology',
            'immunology',
            'pathology',
            'physiology',
            'pharmacology',
          ];
      
          const organSystems = [
            'cardiology',
            'dermatology',
            'endocrinology',
            'reproduction',
            'gastroenterology',
            'hematology',
            'neurology',
            'musculoskeletal',
          ];

          const allSubjectsQuestions = {};
          const allOrganSystemsQuestions = {};
      
          subjects.forEach((subject) => {
            allSubjectsQuestions[subject] = user.questions.filter((question) => question.subject === subject);
          });
      
          organSystems.forEach((organSystem) => {
            allOrganSystemsQuestions[organSystem] = user.questions.filter(
              (question) => question.organSystem === organSystem
            );
          });
      
          res.json({ allSubjectsQuestions, allOrganSystemsQuestions, unusedQuestions, incorrectQuestions });
          
    } catch (err) {
        console.error('Search for question type failed:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }    
}

export { handleFilterQuestions }