const { response } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Run = require('./models/Run.js');
const Workout = require('./models/workout.js');
const fs = require('fs');

const app = express();
dotenv.config();


// the array to hold all the activity objects
const activities = [];

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
        //addExistingRunData();

    }).catch((err) => console.log(err));

app.use(express.static('public'));
app.use(bodyParser.json({limit: '10mb'}));

initActivities();


/////////////////////////////
//      debugging routes
/////////////////////////////

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

/////////////////////////////
//      application routes
/////////////////////////////


// get all the run entrys in the database
app.get('/api/all-runs', (request, response) => {
    Run.find().then((result) => {
        console.log(result);
        response.send(result);
    }).catch((err) => console.log(err));
});

// get all the workouts in the database
app.get('/api/all-workouts', (request, response) => {
    Workout.find().then((result) => {
        console.log(result);
        response.send(result);
    }).catch((err) => console.log(err));
});


// get all the activities in the database
app.get('/api/all-activities', (request, response) => {
    console.log('Get request made to get all activities');
    response.json({activitiesArray: activities});
});


// add only a single run activity
// Adds it to the database and the activities array
app.post('/api/add-single-run', (request, response) => {
    const runData = request.body;
    console.log(runData);
    // create a run object to add to the database
    const run = new Run({
        distance: runData.distance,
        unit: runData.unit,
        date: runData.date,
        time: runData.time,
        description: runData.description
    });
    console.log(run);
    run.save().then((result) => {
        createRun(run);     // creates a run object to go into the activities array
        response.json({result});  
    }).catch((err) => console.log(err));
});


// add only a single workout activity
// Adds it to the database and the activities array
app.post('/api/add-single-workout', (request, response) => {
    const data = request.body;
    console.log(data);    
    // create a new workout object to add to the database
    const workout = new Workout({
        intervalDistance: data.splitDistance,
        unit: data.splitsUnit,
        times: data.splits,
        date: data.date,
        description: data.description
    });
    workout.save().then((result) => {
        createWorkout(workout);     // creates a workout object to add to the activities array
        response.json({result});
    }).catch((err) => console.log(err));
});

///////////////////////////////////
// Program Utility Functions
///////////////////////////////////

// Query all entrys from MongoDB and initialize them for the program
function initActivities() {
    Run.find().then((result) => { initRuns(result) })
    .catch((err) => console.log(err));
    Workout.find().then((result) => { 
        initWorkouts(result); 
        sortActivitiesByDate();  // by default, sort all the activities from newest to oldest
    }).catch((err) => console.log(err));
}

// Initialize all the workouts
function initWorkouts(data) {
    for(let i = 0; i < data.length; i++) {
        createWorkout(data[i]);
    }
}

// Initialize all the runs
function initRuns(data) {
    for(let i = 0; i < data.length; i++) {
        createRun(data[i]);
    }
}

// create a workout for the activities array based on workout data from the database
function createWorkout(data) {
    const workout = data;
    const splitCount = workout.times.length;
    const splitAverage = calcSplitsAverage(workout.times);
    const displayString = `${splitCount} x ${workout.intervalDistance} ${workout.unit} | ${splitAverage} Average`;
    const workoutData = {
        date: workout.date,
        description: workout.description,
        displayString,
        id: workout._id,
        activityType: 'workout'
    };
    activities.push(workoutData);
    sortActivitiesByDate();
}

/*
    Every object in the activities array, both runs and workouts contains a date, description, 
    displayString to format the info, id, and an activity type
*/

// create a run for the activities array based on run data from the database
function createRun(data) {
    const run = data;        
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
        date: run.date,
        displayString,
        description: run.description,
        activityType: 'run',
        id: run._id
    };
    activities.push(runData);
    sortActivitiesByDate();
}

// calculate average pace per unit for a run with a given time and distance
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

// calculate average pace per split for a workout with the given splits
function calcSplitsAverage(splits) {
    let totalSeconds = 0;
    for(let i = 0; i < splits.length; i++) {
        const mins = splits[i].split(':')[0];
        const secs = splits[i].split(':')[1];
        totalSeconds += ((parseFloat(mins) * 60) + parseFloat(secs));        
    }    
    const avgTotalSeconds = totalSeconds / splits.length;
    const avgMins = Math.floor(avgTotalSeconds/60);
    let avgSecs = (avgTotalSeconds % 60).toFixed(2);
    if(avgSecs < 10)
        avgSecs = `0${avgSecs}`;
    return `${avgMins}:${avgSecs}`;
}

// sort all the activities by their date from newest to oldest
// uses selection Sort because that's the fastest one I remeber by heart
function sortActivitiesByDate() {
    for(let i = 0; i < activities.length; i++) {
        let lowest = i;
        for(let j = i; j < activities.length; j++) {
            if(compareDates(activities[lowest].date, activities[j].date)) {
                lowest = j;
            }
        }
        const temp = activities[i];
        activities[i] = activities[lowest];
        activities[lowest] = temp;
    }
}

// returns true if date1 is older than date2, false if date2 is older or they're the same
function compareDates(date1, date2) {
    const date1Parts = date1.split('-');
    const date2Parts = date2.split('-');
    // compare the years
    if(date1Parts[0] < date2Parts[0]) {
        return true;
    } else if(date1Parts[0] === date2Parts[0]) {
        // compare the months
        if(date1Parts[1] < date2Parts[1]) {
            return true;
        } else if(date1Parts[1] === date2Parts[1]) {
            // compare the days
            if(date1Parts[2] < date2Parts[2]) {
                return true;
            }
            else return false;
        }
        return false;
    }
    return false;
}

// temporary code to load existing run data into mongoDB

async function addExistingRunData() {
    fs.readFile('existingData.json', 'utf8', (err, data) => {
        if(err)
            throw err;
        const runData = JSON.parse(data);
        for(let i = 0; i < runData.length; i++) {
            const run = new Run({
                distance: runData[i].distance,
                unit: 'miles',
                date: runData[i].date,
                time: runData[i].time,
                description: " "
            });
            console.log(run);
            run.save().then((result) => {
                console.log('saved: ' + result);
            }).catch((err) => console.log(err));
        }
    });
}

/*
const run = new Run({
        distance: runData.distance,
        unit: runData.unit,
        date: runData.date,
        time: runData.time,
        description: runData.description
    });

    run.save().then((result) => {
        createRun(run);     // creates a run object to go into the activities array
        response.json({result});  
    }).catch((err) => console.log(err));
*/