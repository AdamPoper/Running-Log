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
        this.filterOldest = this.filterOldest.bind(this);
        this.compareOldestDate = this.compareOldestDate.bind(this);
        this.onChangeFilter = this.onChangeFilter.bind(this);
        this.filterNewest = this.filterNewest.bind(this);
        this.onChangeFilter = this.onChangeFilter.bind(this);
        this.filterRuns = this.filterRuns.bind(this);
        this.filterWorkouts = this.filterWorkouts.bind(this);
        this.separateActivityArrays = this.separateActivityArrays.bind(this);
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
    
    compareOldestDate(date1, date2) {
        const date1Parts = date1.split('-');
        const date2Parts = date2.split('-');
        // compare the years
        if(date1Parts[0] > date2Parts[0]) {
            return true;
        } else if(date1Parts[0] === date2Parts[0]) {
            // compare the months
            if(date1Parts[1] > date2Parts[1]) {
                return true;
            } else if(date1Parts[1] === date2Parts[1]) {
                // compare the days
                if(date1Parts[2] > date2Parts[2]) {
                    return true;
                }
                else return false;
            }
            return false;
        }
        return false;
    }
    compareNewestDate(date1, date2) {
        const date1Parts = date1.split('-');
        const date2Parts = date2.split('-');
        // compare the years
        if(date1Parts[0] < date2Parts[0]) {
            return true;
        } else if(date1Parts[0] === date2Parts[0]) {
            // compare the months
            if(date1Parts[1] < date2Parts[1]) {
                return true;
            } else if(date1Parts[1] === date2Parts[1]) {
                // compare the days
                if(date1Parts[2] < date2Parts[2]) {
                    return true;
                }
                else return false;
            }
            return false;
        }
        return false;
    }
    // these use selection sort because that's the fastest sorting algorithm I know by heart
    filterOldest() {
        let data = this.state.activityData;
        for(let i = 0; i < data.length; i++) {
            let oldest = i;
            for(let j = i; j < data.length; j++) {
                if(this.compareOldestDate(data[oldest].date, data[j].date)) {
                    oldest = j;
                }
            }
            const temp = data[i];
            data[i] = data[oldest];
            data[oldest] = temp;
        }
        this.setState({activityData: data});
    }
    filterNewest() {
        let data = this.state.activityData;
        for(let i = 0; i < data.length; i++) {
            let oldest = i;
            for(let j = i; j < data.length; j++) {
                if(this.compareNewestDate(data[oldest].date, data[j].date)) {
                    oldest = j;
                }
            }
            const temp = data[i];
            data[i] = data[oldest];
            data[oldest] = temp;
        }
        this.setState({activityData: data});
    }
    filterRuns() {
        const arrays = this.separateActivityArrays();
        const activities = arrays.runArray.concat(arrays.workoutArray);
        this.setState({activityData: activities});
    }
    filterWorkouts() {
        const arrays = this.separateActivityArrays();
        const activities = arrays.workoutArray.concat(arrays.runArray);
        this.setState({activityData: activities});
    }
    separateActivityArrays() {
        const runArray = [];
        const workoutArray = [];
        const data = this.state.activityData;
        for(let i = 0; i < data.length; i++) {
            switch(data[i].activityType) {
                case 'run':     runArray.push(data[i]);     break;
                case 'workout': workoutArray.push(data[i]); break;
            }
        }
        return {runArray, workoutArray};
    }
    onChangeFilter() {
        const options = document.getElementById('filterOptions');
        const option = options.options[options.selectedIndex].value;
        switch(option) {
            case 'newest':  this.filterNewest();   return;
            case 'oldest':  this.filterOldest();   return;
            case 'run':     this.filterRuns();     return;
            case 'workout': this.filterWorkouts(); return;            
        }
    }
    render() {
        const activityComponents = this.state.activityData.map(activityData => 
            <Activity key={activityData.id} data={activityData} onClickCallback={this.setSelectedActivity}/>);
        return(
            <div className='activities-screen'>
                <h1 className='header'>Activities Screen</h1>
                <div className='filter-options'>
                    <h5>filter</h5>
                    <select name='filter' id='filterOptions' onChange={this.onChangeFilter}>
                        <option value='newest'>Newest</option>
                        <option value='oldest'>Oldest</option>
                        <option value='run'>Runs</option>
                        <option value='workout'>Workouts</option>
                    </select>                             
                </div>                
                <div className='activity-viewing'>
                    <div className='activities-viewer'>
                        {activityComponents}
                    </div>
                    <div className='single-activity-view'>
                        <p>{this.state.selectedActivityData.date}</p>
                        <div className='run-info'>
                            {this.state.viewing ? <p>{this.state.selectedActivityData.activityInfo}</p> : <div />}
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