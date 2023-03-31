const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
    exerciseName: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        required: true,
        // enum: ["Target Muscle", "Compound", "Cardio"]
    },
    target: {
        type: Array,
        required: false,
        default: []
    },
    workoutImage: {
        contentType: String,
        required: false,
        data: Buffer
    },
    info: {
        type: String,
        required: false
    },
    equipment: {
        type: String,
        required: true
    },
    forAll: {
        type: Boolean,
        required: true
    },
    addedBy: {
        type: String,
        required: true
    }
});

module.exports = Exercise = mongoose.model("Exercises", ExerciseSchema);