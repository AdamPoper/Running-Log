const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workoutSchema = new Schema({
    intervalDistance: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
        required: true
    },
    times: {
        type: Array,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    }
});

const workouts = mongoose.model('workout', workoutSchema);
module.exports = workouts;