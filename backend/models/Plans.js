const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlanSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    planName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ["Target", "Push", "Pull", "Cardio", "HIIT", "Calisthenics"]
    },
    target: {
        type: Array,
        required: false,
        default: []
    },
    plans: {
        type: Array,
        required: false,
        default: []
    },
    restTimeBDE: {
        // In seconds
        type: Number,
        required: true,
        defaule: 0
    }
});

module.exports = Plan = mongoose.model("Plans", PlanSchema);