import React from 'react';
import '../App.css';

class WorkoutScreen extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {}

    render() {
        return(
            <div className='screen'>
                <h1>Workout Screen</h1>
                <button className='save-button'>Save</button>
            </div>
        );
    }
}
export default WorkoutScreen;