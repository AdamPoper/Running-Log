import React from 'react';
import '../App.css';
import '../Screen.css';

class RunScreen extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {}

    async onSave() {
        const distance = parseFloat(document.getElementById('distance').value);
        if(isNaN(distance)) {
            console.log('distance is NaN');
            return;
        }
        console.log(distance);

        const units = document.getElementById('units');
        const unit = units.options[units.selectedIndex].value;
        console.log(unit);

        const hours = document.getElementById('hours').value;
        const mins = document.getElementById('mins').value;
        const secs = document.getElementById('secs').value;
        if(isNaN(hours) || isNaN(mins) || isNaN(secs)) {
            console.log('No NaN values');
            return;
        }
        console.log(hours);
        console.log(mins);
        console.log(secs);

        const description = document.getElementById('desc').value;
        console.log(description);
        
        const options = {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({message: 'from the run screen'})
        };
        const response = await fetch('/api/add-single-run', options);
        const res_data = await response.json();
        console.log(res_data);
    }

    onDateChange() {

    }

    render() {
        return(
            <div className='screen'>
                <h1>Run Screen</h1>
                <input type="date" id="start" name="trip-start"
                    value={"2020-07-22"} min="2020-01-01" max="2022-12-31" 
                    onChange={ this.onDateChange
                 }/>
                <div className='run-screen'>
                    <div className='distance'>
                        <label>Distance</label>
                        <input type='text' id='distance'></input>
                        <label>Unit</label>
                        <select name='units' id='units'>
                            <option value='miles'>Miles</option>
                            <option value='kilos'>Kilometers</option>
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