import React from 'react';
import '../modalFilter.css';

class DateFilter extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {}

    render() {
        return (
            <div className='modal'>
                <button className='close-button' 
                onClick={this.props.onCloseCallback}>X</button>
                <div className='modal-content'>
                    <div className='start-date'>
                        <label>Start Date</label>                               
                        <input type="date" id='startDate'></input>
                    </div>
                    <div>
                        <label>End Date</label>                               
                        <input type="date" id='endDate'></input>
                    </div>
                    <button className='apply-button'
                    onClick={() => {                        
                        const start = document.getElementById('startDate').value;
                        const end   = document.getElementById('endDate').value;
                        this.props.onApplyCallback(start, end);
                    }}>Apply</button>
                </div>
            </div>
        );
    }
}
export default DateFilter;