import mongoose from 'mongoose';

const { Schema } = mongoose;

const resetReqSchema = new Schema({
    uniqueId: String,
    email: String
});

export default mongoose.model('ResetReq', resetReqSchema);
