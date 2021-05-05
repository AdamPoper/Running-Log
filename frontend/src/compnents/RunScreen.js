import React from 'react';
import '../App.css';
import '../RunScreen.css';

class RunScreen extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {}

    async onSave() {
        const distance = parseFloat(document.getElementById('distance').value);
        document.getElementById('distance').value = '';
        
        if(isNaN(distance)) {
            console.log('distance is NaN');
            alert('Enter a distance');
            return;
        }

        const units = document.getElementById('units');
        const unit = units.options[units.selectedIndex].value;

        let hours = document.getElementById('hours').value;
        let mins  = document.getElementById('mins').value;
        let secs  = document.getElementById('secs').value;

        hours = hours == '' ? 0 : hours;
        mins = mins == '' ? 0 : mins;
        secs = secs == '' ? 0 : secs;                  

        const dateControl = document.querySelector('input[type="date"]');
        const date = dateControl.value;

        let desc = document.getElementById('desc').value;
        desc = desc == '' ? ' ' : desc;

        document.getElementById('hours').value = '';
        document.getElementById('mins').value  = '';
        document.getElementById('secs').value  = '';
        document.getElementById('desc').value  = '';

        const runData = {
            distance: distance,
            unit: unit,
            time: {
                hours: hours,
                minutes: mins,
                seconds: secs
            },
            date: date,
            description: desc
        };

        const options = {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(runData)
        };
        const response = await fetch('/api/add-single-run', options);
        const res_data = await response.json();
        console.log(res_data);        
    }
    
    render() {
        return(
            <div className='screen'>
                <h1>Run Screen</h1>
                <div className='run-screen'>
                <input type="date" className='date-input'></input>
                    <div className='distance'>
                        <label>Distance</label>
                        <input type='text' id='distance'></input>
                        <label>Unit</label>
                        <select name='units' id='units'>
                            <option value='Miles'>Miles</option>
                            <option value='Kilometers'>Kilometers</option>
                        </select>
                    </div>
                    <div className='time'>
                        <label>Hours</label>
                        <input type='text' id='hours'/>
                        <label>Minutes</label>
                        <input type='text' id='mins'/>
                        <label>Seconds</label>
                        <input type='text' id='secs'/>
                    </div>
                    <div className='description'>
                        <label>Description</label>
                        <textarea id='desc'/>
                    </div>
                </div>
                <button className='save-button' 
                onClick={this.onSave}>Save</button>
            </div>
        );
    }
}
export default RunScreen;