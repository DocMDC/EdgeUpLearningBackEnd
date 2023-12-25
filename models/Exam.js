import mongoose from 'mongoose';
const { Schema } = mongoose;

const examQuestionSchema = new Schema({
    documentType: {
        type: String,
        default: 'question',
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    organSystem: {
        type: String,
        required: true,
    },
    vignette: {
        type: String,
        required: true,
    },
    choices: {
        type: [String],
        required: true,
    }, 
    explanations: {
        type: [String],
        required: true,
    },
    correctChoice: {
        type: Number,
        required: true,
    },
    used: {
        type: Boolean,
        default: false,
    },
    hasAnswered: {
        type: Boolean,
        default: false,
    },
    answeredCorrectly: {
        type: Boolean,
        default: false,
    },
    flagged: {
        type: Boolean,
        default: false,
    },
    hasNote: {
        type: Boolean,
        default: false,
    },
    note: {
        type: String,
    },
    selection: {
        type: Number,
        default: null,
    },
});

const examSchema = new Schema({
    documentType: {
        type: String,
        default: 'exam',
        required: true,
    },
    mode: {
        timed: {
            type: Boolean,
            required: true,
        },
        tutor: {
            type: Boolean,
            required: true,
        },
    },
    dateCreated: {
        type: Date,
        default: Date.now,
        required: true,
    },
    uniqueId: {
        type: String,
        required: true,
    },
    numberOfQuestions: {
        type: Number,
        required: true,
    },
    listOfQuestions: {
        type: [examQuestionSchema],
        required: true,
    },
    score: {
        type: Schema.Types.Mixed,
        default: '-',
    }
});

export default mongoose.model('Exam', examSchema);