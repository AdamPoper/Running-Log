import React from 'react';
import '../modalFilter.css';

class DistanceFilter extends React.Component {
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
                    <div className='low-distance'>
                        <label>Lowest</label>                               
                        <input type="text" id='lowDistance'></input>
                    </div>
                    <div>
                        <label>Highest</label>                               
                        <input type="text" id='highDistance'></input>
                    </div>
                    <button className='apply-button'
                    onClick={() => {                        
                        const low  = document.getElementById('lowDistance').value;
                        const high = document.getElementById('highDistance').value;
                        this.props.onApplyCallback(low, high);
                    }}>Apply</button>
                </div>
            </div>
        );
    }
}
export default DistanceFilter;