import React from 'react';
import '../App.css';
import '../WorkoutScreen.css';

class WorkoutScreen extends React.Component {
    constructor() {
        super();
        this.state = {

        };
    }
    componentDidMount() {

    }

    async onSave() {    
        const dateControl = document.querySelector('input[type="date"]');
        const date = dateControl.value;  
        const splitDistance = parseFloat(document.getElementById('distance').value);
        if(isNaN(splitDistance))
        {
            console.log('Distance is NaN');
            return;
        }
        const units = document.getElementById('units');
        const splitsUnit = units.options[units.selectedIndex].value;
        const timeString = document.getElementById('timeArea').value;
        const splits = timeString.split(';');
        const description = document.getElementById('workoutDescription').value;
        const workoutData = { 
            splitDistance, 
            splitsUnit, 
            splits, 
            description,
            date 
        };
        console.log(workoutData);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(workoutData)
        };
        const response = await fetch('/api/add-single-workout', options);
        const res_data = await response.json();
        console.log(res_data);
    }

    render() {
        return(
            <div className='screen'>
                <h1>Workout Screen</h1>
                <div className='workout-screen'>
                    <input type='date'></input>
                    <div className='interval-distance'>
                        <label>Interval Distance</label>
                        <input type='text' id='distance'></input>                      
                        <label>Unit</label>
                        <select id='units'>
                            <option value='Mile'>Miles</option>
                            <option value='Kilometer'>Kilometers</option>
                            <option value='Meters'>Meters</option>
                        </select>
                    </div>                    
                    <div className='times'>
                        <label>Times</label>
                        <textarea id='timeArea'></textarea>
                    </div>
                    <div className='description'>
                        <label>Description</label>
                        <textarea id='workoutDescription'></textarea>
                    </div>
                </div>
                <button className='save-button' onClick={this.onSave}>Save</button>
            </div>
        );
    }
}
export default WorkoutScreen;