import React from 'react';
import '../modalFilter.css';

class TimeFilter extends React.Component {
    constructor() {
        super();
        this.state = {};        
    }

    render() {
        return(
            <div className='modal'>
                <button className='close-button' 
                onClick={this.props.onCloseCallback}>X</button>
                <div className='modal-content'>
                    <div className='start-date'>
                        <label>Fastest Time</label>                               
                        <input type="text" id='fastest'></input>
                    </div>
                    <div>
                        <label>Slowest Time</label>                               
                        <input type="test" id='slowest'></input>
                    </div>
                    <button className='apply-button'
                    onClick={() => {                        
                        const fastest = document.getElementById('fastest').value;
                        const slowest = document.getElementById('slowest').value;
                        this.props.onApplyCallback(fastest, slowest);
                    }}>Apply</button>
                </div>
            </div>
        );
    }
}

export default TimeFilter;