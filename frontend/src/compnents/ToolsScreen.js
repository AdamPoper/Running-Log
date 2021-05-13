import React from 'react';
import '../ToolsScreen.css';

class ToolsScreen extends React.Component {
    constructor() {
        super();
        this.state = {}
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

    convertToTime(seconds) {
        const hours = parseInt(seconds / 60 / 60);
        //seconds -= hours;
        const minutes = seconds 
    }

    onCalcPace() {
        const distance = parseFloat(document.getElementById('distance-input').value);
        const timeStr = document.getElementById('time-input').value;       
        const time = timeStr.split(':');
        const timeInSeconds = this.convertTimeToSeconds(time);
        const distancePerUnit = timeInSeconds / distance;
        document.getElementById('pace-input').value = String(distancePerUnit);
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
                        </div>
                        <div className='pace-calc-io'>
                            <label>Time</label>
                            <input id='time-input'/>
                        </div>
                        <div className='pace-calc-io'>
                        <label>Pace</label>
                            <input id='pace-input'/>
                        </div>
                        <div className='pace-calc-actions'>
                            <select>
                                <option value='miles'>Miles</option>
                                <option value='kilometers'>Kilometers</option>
                                <option value='Meters'>Meters</option>
                            </select>
                            <select id='factor-calc'>
                                <option value='distance'>Distance</option>
                                <option value='time'>Time</option>
                                <option value='pace'>pace</option>                                
                            </select>
                            <button>Calculate</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ToolsScreen;