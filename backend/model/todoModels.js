import mongoose from "mongoose";
const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });
const todoModel = mongoose.model("todo", todoSchema);
export default todoModel;