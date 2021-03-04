const { response } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Run = require('./models/Run.js');
const Workout = require('./models/workout.js');

const app = express();
dotenv.config();

let activities = [];

const PORT = process.env.PORT;
const mongoPassword = process.env.PASSWORD;
const db_uri = `mongodb+srv://adampoper:${mongoPassword}@runninglog.ztpbe.mongodb.net/RunningLogDatabase?retryWrites=true&w=majority`;
// connects to the mongoDB database through mongoose
mongoose.connect(db_uri, 
    {
        // supresses warnings
        useNewUrlParser: true, 
        useUnifiedTopology: true

    }).then((result) => {
        // mongoose.connect is async so we start the server when the db connects
        console.log('Connected to database');
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    }).catch((err) => console.log(err));

app.use(express.static('public'));
app.use(bodyParser.json({limit: '10mb'}));

initActivities();

// debugging routes

app.get('/add-run', (request, response) => {
    const run = new Run({
        distance: 4,
        date: Date.now(),
        unit: 'miles',
        time: {
            hours: 0,
            minutes: 29,
            seconds: 12
        },
        description: 'My fav run'
    });
    run.save().then((result) => {
        response.send(result);
    }).catch((err) => {
        console.log(err);
    });
});

app.get('/single-run', (request, response) => {
    Run.findById('6035ba4089ee4e4540fbee8d')
    .then((result) => {
        response.send(result);
    }).catch((err) => console.log(err));
});

app.get('/all-runs', (request, response) => {
    // get all the run entrys in the database
    Run.find().then((result) => {
        console.log(result);
        response.send(result);
    }).catch((err) => console.log(err));
});

// application routes

app.get('/api/all-runs', (request, response) => {
    // get all the run entrys in the database
    Run.find().then((result) => {
        console.log(result);
        response.send(result);
    }).catch((err) => console.log(err));
});

app.get('/api/all-workouts', (request, response) => {
    Workout.find().then((result) => {
        console.log(result);
        response.send(result);
    }).catch((err) => console.log(err));
});

app.get('/api/all-activities', (request, response) => {
    console.log('Get request made to get all activities');
    response.json({activitiesArray: activities});
});

app.post('/api/add-single-run', (request, response) => {
    
    const runData = request.body;
    console.log(runData);
    const run = new Run({
        distance: runData.distance,
        unit: runData.unit,
        date: runData.date,
        time: runData.time,
        description: runData.description
    });
    console.log(run);
    run.save().then((result) => response.json({result}))
    .catch((err) => console.log(err));
});

app.post('/api/add-single-workout', (request, response) => {
    const data = request.body;
    console.log(data);
    
    const workout = new Workout({
        intervalDistance: data.splitDistance,
        unit: data.splitsUnit,
        times: data.splits,
        date: data.date,
        description: data.description
    });
    workout.save().then((result) => response.json({result}))
    .catch((err) => console.log(err));
});

function initActivities() {
    Run.find().then((result) => initRuns(result))
    .catch((err) => console.log(err));
}

function initRuns(data) {
    for(let i = 0; i < data.length; i++) {
        const run = data[i];        
        const pace = calcRunPace(run.time, run.distance);
        let timeStr;
        if(run.time.hours === 0 || run.time.hours === null)
        {
            let mins = run.time.minutes;
            let secs = run.time.seconds;
            if(mins < 10)
                mins = `0${mins}`;
            if(secs < 10)
                secs = `0${secs}`;    
            timeStr = `${mins}:${secs}`;
        }
        else
        {
            let mins = run.time.minutes;
            let secs = run.time.seconds;
            if(mins < 10)
                mins = `0${mins}`;
            if(secs < 10)
                secs = `0${secs}`;                        
            timeStr = `${run.time.hours}:${mins}:${secs}`;
        }
        const displayString = `${run.distance} ${run.unit} ${timeStr} | ${pace} per ${run.unit.slice(0, -1)}`;
        const runData = {
            distance: run.distance,
            unit: run.unit,
            time: run.time,
            date: run.date,
            displayString,
            pace,
            description: run.description,
            activityType: 'run',
            id: run._id
        };
        console.log(runData);
        activities.push(runData);
    }
}

function calcRunPace(time, dist) {
    let totalSeconds = time.hours * 60 * 60;
    totalSeconds += (time.minutes * 60);
    totalSeconds += time.seconds;

    const secondsPerUnit = totalSeconds / dist;
    const mins = Math.floor(secondsPerUnit/60);
    let secs = (secondsPerUnit % 60).toFixed(2);   
    if(secs < 10)
        secs = `0${secs}`;
    const pace = (mins + ':' + secs);
    return pace;
}
