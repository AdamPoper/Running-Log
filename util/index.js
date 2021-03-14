const fs = require('fs');
const readline = require('readline');

const runData = [];

const readInterface = readline.createInterface({
    input: fs.createReadStream('activities.csv'),
    output: process.stdout,
    console: false
});
let lineCount = 0;
readInterface.on('line', (line) => {
    if(lineCount > 0)
    {
        onReadLine(line);    
        fs.writeFile('existingData', JSON.stringify(runData), (err) => {
            if(err)
                throw err;            
        });
    }
    else 
        lineCount++;
});

function onReadLine(line) {
    const lineData = line.split(',');
    const date = lineData[1].split(' ')[0];
    const distance = lineData[4].replace(/"/g, '');
    const elapsedTime = lineData[6].split(':');
    const hours =  elapsedTime[0].replace('"', '');
    const mins =  elapsedTime[1];
    const secs = elapsedTime[2];
    const data = {
        date,
        distance: parseFloat(distance),
        time: {
            hours: parseFloat(hours),
            minutes: parseFloat(mins),
            seconds: parseFloat(secs),
        },
    }
    runData.push(data);
}

