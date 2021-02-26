const { response } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Run = require('./models/Run.js');


const app = express();
dotenv.config();

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

// debugging routes

app.get('/all-runs', (request, response) => {
    // get all the run entrys in the database
    Run.find().then((result) => {
        response.send(result);
    }).catch((err) => console.log(err));
});

app.get('/single-run', (request, response) => {
    Run.findById('6035ba4089ee4e4540fbee8d')
    .then((result) => {
        response.send(result);
    }).catch((err) => console.log(err));
});

// application routes

app.post('/api/add-single-run', (request, response) => {
    const runData = request.body;
    console.log(runData);
    response.json({message: 'Run Data Received'});
});
