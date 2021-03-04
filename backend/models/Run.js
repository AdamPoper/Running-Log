const { MongoError } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const runSchema = new Schema({
    distance: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    time: {
        hours: {
            type: Number,
            required: true
        },
        minutes: {
            type: Number,
            required: true
        },
        seconds: {
            type: Number,
            required: true
        }
    },
    date: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Run = mongoose.model('run', runSchema);
module.exports = Run;