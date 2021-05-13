import React from 'react';
import '../ToolsScreen.css';

class ToolsScreen extends React.Component {
    constructor() {
        super();
        this.state = {};

        this.onCalcDistance = this.onCalcDistance.bind(this);
        this.onCalcPace = this.onCalcPace.bind(this);
        this.onCalcTime = this.onCalcTime.bind(this);
    }

    componentDidMount() {

    }

    onConvert() {
        const distanceConvert = parseFloat(document.getElementById('convert-input').value);
        let convertedDistance = distanceConvert;
        let units = document.getElementById('unit-select1');        
        const convertUnit1 = String(units.options[units.selectedIndex].value);
        units = document.getElementById('unit-select2');
        const convertUnit2 = String(units.options[units.selectedIndex].value);
        const conversionFactor = 1.609;
        if(convertUnit1 === 'miles' && convertUnit2 === 'kilos')
            convertedDistance = (convertedDistance * conversionFactor).toFixed(3);       
        else if(convertUnit1 === 'kilos' && convertUnit2 === 'miles')
            convertedDistance = (convertedDistance / conversionFactor).toFixed(3);
        console.log('converted distance ' + convertedDistance);        
        document.getElementById('converted-distance').innerText = String(convertedDistance);
    }

    convertTimeToSeconds(timeArray) {
        const hours = parseFloat(timeArray[0]);
        const mins = parseFloat(timeArray[1]);
        const secs = parseFloat(timeArray[2]);
        let timeInSeconds = 0;
        timeInSeconds += (hours * 60 * 60);
        timeInSeconds += (mins * 60);
        timeInSeconds += secs;
        return timeInSeconds;
    }

    convertToTime(totalSeconds) {
        const hours = Math.floor(parseFloat(totalSeconds / 60 / 60));
        totalSeconds -= (hours * 60 * 60);
        const minutes = Math.floor(totalSeconds / 60);
        //totalSeconds -= (minutes * 60);
        const seconds = (totalSeconds - (minutes * 60)).toFixed(2);        
        return `${hours}:${minutes}:${seconds}`;
    }

    onCalcPace() {
        const conversionFactor = 1.609;
        let distance = parseFloat(document.getElementById('distance-input').value);
        const distanceUnits = document.getElementById('distance-unit');
        const distanceUnit = distanceUnits.options[distanceUnits.selectedIndex].value;
        if(distanceUnit === 'kilos')
            distance /= conversionFactor;        
        const timeStr = document.getElementById('time-input').value;       
        const time = timeStr.split(':');
        console.log('time ' + time);
        const timeInSeconds = this.convertTimeToSeconds(time);
        console.log('time in seconds ' + timeInSeconds);
        let secondsPerUnit = timeInSeconds / distance;
        const paceUnits = document.getElementById('pace-unit');
        const paceUnit = paceUnits.options[paceUnits.selectedIndex].value;
        if(paceUnit === 'kilo')
            secondsPerUnit /= conversionFactor; 
        document.getElementById('pace-input').value = this.convertToTime(secondsPerUnit);
    }

    onCalcTime() {

    }

    onCalcDistance() {

    }

    onCalculate() {
        const options = document.getElementById('factor-calc');
        let factor = options.options[options.selectedIndex].value;
        switch(factor) 
        {
            case 'distance': this.onCalcDistance(); break;
            case 'time':     this.onCalcTime(); break;
            case 'pace':     this.onCalcPace(); break;
        }
    }

    render() {
        return (
            <div className='screen'>
                <h1>Tools Screen</h1>
                <div className='calculators'>
                    <div className='unit-convert'>
                        <h2>Unit Convert</h2>
                        <div className='distance-io'>
                            <input id='convert-input' type='text'/>
                            <h3>=</h3>
                            <h3 id='converted-distance' value='balls'></h3>
                        </div>
                        <div className='unit-select'>
                            <select id='unit-select1'>
                                <option value='miles'>miles</option>
                                <option value='kilos'>km</option>
                            </select>
                            <select id='unit-select2'>
                                <option value='miles'>miles</option>
                                <option value='kilos'>km</option>
                            </select>
                        </div>
                        <button onClick={() => this.onConvert()}>Convert</button>
                    </div>
                    <div className='pace-calculator'>
                        <h2>Pace Calculator</h2>
                        <div className='pace-calc-io'>
                            <label>Distance</label>
                            <input id='distance-input'/>
                            <select id='distance-unit'>
                                <option value='miles'>Miles</option>
                                <option value='kilos'>Kilometers</option>
                                <option value='Meters'>Meters</option>
                            </select>
                        </div>
                        <div className='pace-calc-io'>
                            <label>Time</label>
                            <input id='time-input'/>
                        </div>
                        <div className='pace-calc-io'>
                        <label>Pace</label>
                            <input id='pace-input'/>
                            <label style={{marginLeft: '5%'}}>Per</label>
                            <select id='pace-unit'>
                                <option value='mile'>Mile</option>
                                <option value='kilo'>Kilometer</option>
                            </select>
                        </div>
                        <div className='pace-calc-actions'>                            
                            <select id='factor-calc'>
                                <option value='distance'>Distance</option>
                                <option value='time'>Time</option>
                                <option value='pace'>Pace</option>                                
                            </select>
                            <button onClick={() => this.onCalculate()}>Calculate</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ToolsScreen;