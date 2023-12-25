import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimiter from 'express-rate-limit';
import allRoutes from './routes/allRoutes.js'; 
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler.js';
import connectDB from './config/dbConn.js'; 
import verifyJWT from './middleware/verifyJWT.js';
import verifyRoles from "./middleware/verifyRoles.js"
import { handleFilterQuestions } from "./controllers/filterQuestionsController.js"
import { handlePrepareExam } from "./controllers/prepareExamController.js"
import { handleGetExams } from "./controllers/getExamsController.js"
import { handleResetAccount } from "./controllers/resetAccountController.js"
import { handleGetExam } from "./controllers/getExamController.js"
import { handleUpdateSelection } from "./controllers/updateSelectionController.js"
import { handleUpdateFlaggedQuestions } from './controllers/updateFlaggedQuestionsController.js'
import { handleSubmitAnswer } from "./controllers/submitAnswerController.js"
import { handleSubmitExam } from "./controllers/submitExamController.js"
import { handleUpdateNote } from "./controllers/updateNoteController.js"
import { handleDeleteNote } from "./controllers/deleteNoteController.js"
import { getAi } from './controllers/getAiController.js'
import { handleAddQuestion } from "./controllers/addQuestionController.js"
import { handleGetQuestions } from "./controllers/getQuestionsController.js"
import { handleGetQuestionById } from "./controllers/getQuestionByIdController.js"
import { handleEditQuestion } from "./controllers/editQuestionController.js"
import { handleDeleteQuestion } from "./controllers/deleteQuestionController.js"
import { handleRefreshToken } from './controllers/refreshTokenController.js';

const PORT = process.env.PORT || 5000;

const app = express();

// Allow cors
app.use(cors({
  origin: 'https://edgeuplearning.onrender.com',
  credentials: true
}));

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());

// Cookies
app.use(cookieParser());

// Routes
app.use('/api/v1', allRoutes);

//Routes requiring user identification / role verification 
app.use('/api/v1/refresh', handleRefreshToken);
app.use('/api/v1/filter-questions', verifyJWT, handleFilterQuestions)
app.use('/api/v1/prepare-questions', verifyJWT, handlePrepareExam)
app.use('/api/v1/get-exams', verifyJWT, handleGetExams)
app.use('/api/v1/reset-account', verifyJWT, handleResetAccount)
app.use('/api/v1/get-exam/:id', verifyJWT, handleGetExam)
app.use('/api/v1/update-selection', verifyJWT, handleUpdateSelection)
app.use('/api/v1/update-flags', verifyJWT, handleUpdateFlaggedQuestions)
app.use('/api/v1/submit-answer', verifyJWT, handleSubmitAnswer)
app.use('/api/v1/submit-exam', verifyJWT, handleSubmitExam)
app.use('/api/v1/update-note', verifyJWT, handleUpdateNote)
app.use('/api/v1/delete-note', verifyJWT, handleDeleteNote)
app.use('/api/v1/ai', verifyJWT, verifyRoles(19840, 42805, 94768), getAi)
app.use('/api/v1/add-question', verifyJWT, verifyRoles(42805, 94768), handleAddQuestion)
app.use('/api/v1/get-questions', verifyJWT, verifyRoles(42805, 94768), handleGetQuestions)
app.use('/api/v1/get-question/:id', verifyJWT, verifyRoles(42805, 94768), handleGetQuestionById)
app.use('/api/v1/edit-question', verifyJWT, verifyRoles(42805, 94768), handleEditQuestion)
app.use('/api/v1/delete-question/:id', verifyJWT, verifyRoles(42805, 94768), handleDeleteQuestion)


// Errors
app.use(errorHandler);

async function start() {
  try {
    await connectDB(process.env.MONGO_DB_URL);

    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}...`);
    });
  } catch (err) {
    console.log('The server could not start ' + err);
  }
}

start();
