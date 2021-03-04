import React from 'react';
import '../ActivitiesScreen.css';
import Activity from './Activity.js';

class ActivitiesScreen extends React.Component{
    constructor() {
        super();
        this.state = {
            activityData: [],
            selectedActivityData: {},
            viewing: false
        };
        this.initActivityData = this.initActivityData.bind(this);
        this.setSelectedActivity = this.setSelectedActivity.bind(this);
    }
    async initActivityData() {
        const response = await fetch('/api/all-activities');
        const res_data = await response.json();
        this.setState({activityData: res_data.activitiesArray});
        console.log(this.state.activityData);
    }
    componentDidMount() {
        this.initActivityData();
    }

    setSelectedActivity(data) {
        this.setState({selectedActivityData: data});
        this.setState({viewing: true});
    }

    render() {
        const activityComponents = this.state.activityData.map(activityData => 
            <Activity key={activityData.id} data={activityData} onClickCallback={this.setSelectedActivity}/>);
        return(
            <div className='activities-screen'>
                <h1 className='header'>Activities Screen</h1>
                <div className='filter-options'>
                    <h5>filter</h5>
                </div>
                <div className='activity-viewing'>
                    <div className='activities-viewer'>
                        {activityComponents}
                    </div>
                    <div className='single-activity-view'>
                        <p>{this.state.selectedActivityData.date}</p>
                        <div className='run-info'>
                            {this.state.viewing ? <p>{this.state.selectedActivityData.runInfo}</p> : <div />}
                        </div>
                        <br/>
                        {this.state.viewing ? <p>{this.state.selectedActivityData.description}</p> : <div />}
                    </div>
                </div>               
            </div>
        );
    }
}

export default ActivitiesScreen;