import React from 'react';
import '../ActivitiesScreen.css';
import Activity from './Activity.js';
import DateFilter from './DateFilter.js';

class ActivitiesScreen extends React.Component{
    constructor() {
        super();
        this.state = {
            activityData: [],
            selectedActivityData: {},
            sortedAndFilteredData: [],
            viewing: false,
            filteringDate: false
        };
        this.initActivityData       = this.initActivityData.bind(this);
        this.setSelectedActivity    = this.setSelectedActivity.bind(this);
        this.sortOldest             = this.sortOldest.bind(this);
        this.sortFurthest           = this.sortFurthest.bind(this);
        this.sortShortest           = this.sortShortest.bind(this);
        this.sortLongest            = this.sortLongest.bind(this);
        this.sortQuickest           = this.sortQuickest.bind(this);
        this.compareOldestDate      = this.compareOldestDate.bind(this);
        this.sortNewest             = this.sortNewest.bind(this);
        this.onChangeSort           = this.onChangeSort.bind(this);
        this.onChangeFilter         = this.onChangeFilter.bind(this);
        this.filterRuns             = this.filterRuns.bind(this);
        this.filterWorkouts         = this.filterWorkouts.bind(this);
        this.separateActivityArrays = this.separateActivityArrays.bind(this);   
        this.filterDate             = this.filterDate.bind(this); 
        this.closeDateFilter        = this.closeDateFilter.bind(this);    
        this.applyDateFilter        = this.applyDateFilter.bind(this);
    }
    async initActivityData() {
        const response = await fetch('/api/all-activities');
        const res_data = await response.json();
        this.setState({activityData: res_data.activitiesArray});
        this.setState({sortedAndFilteredData: res_data.activitiesArray});
        //console.log(this.state.activityData);
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
    // All the sorting algorithms use selection sort because that's the fastest sorting algorithm I know by heart
    sortOldest() {
        let data = this.state.sortedAndFilteredData;
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
        this.setState({sortedAndFilteredData: data});
    }
    sortNewest() {
        let data = this.state.sortedAndFilteredData;
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
        this.setState({sortedAndFilteredData: data});
    }
    sortFurthest() {
        let data = this.state.sortedAndFilteredData;
        for(let i = 0; i < data.length; i++) {
            let furthest = i;
            for(let j = i; j < data.length; j++) {
                if(data[furthest].totalDistance < data[j].totalDistance) {
                    furthest = j;
                }
            }
            const temp = data[i];
            data[i] = data[furthest];
            data[furthest] = temp;
        }
        this.setState({sortedAndFilteredData: data});
    }
    sortShortest() {
        let data = this.state.sortedAndFilteredData;
        for(let i = 0; i < data.length; i++) {
            let shortest = i;
            for(let j = i; j < data.length; j++) {
                if(data[shortest].totalDistance > data[j].totalDistance) {
                    shortest = j;
                }
            }
            const temp = data[i];
            data[i] = data[shortest];
            data[shortest] = temp;
        }
        this.setState({sortedAndFilteredData: data});
    }    
    sortLongest() {
        let data = this.state.sortedAndFilteredData;
        for(let i = 0; i < data.length; i++) {
            let longest = i;
            for(let j = i; j < data.length; j++) {
                if(data[longest].totalSeconds < data[j].totalSeconds) {
                    longest = j;
                }
            }
            const temp = data[i];
            data[i] = data[longest];
            data[longest] = temp;
        }
        this.setState({sortedAndFilteredData: data});
    }
    sortQuickest() {
        let data = this.state.sortedAndFilteredData;
        for(let i = 0; i < data.length; i++) {
            let quickest = i;
            for(let j = i; j < data.length; j++) {
                if(data[quickest].totalSeconds > data[j].totalSeconds) {
                    quickest = j;
                }
            }
            const temp = data[i];
            data[i] = data[quickest];
            data[quickest] = temp;
        }
        this.setState({sortedAndFilteredData: data});
    }
    filterRuns() {
        const arrays = this.separateActivityArrays();        
        this.setState({sortedAndFilteredData: arrays.runArray});
    }
    filterWorkouts() {
        const arrays = this.separateActivityArrays();        
        this.setState({sortedAndFilteredData: arrays.workoutArray});
    }
    separateActivityArrays() {
        const runArray = [];
        const workoutArray = [];
        const data = this.state.sortedAndFilteredData;
        for(let i = 0; i < data.length; i++) {
            switch(data[i].activityType) {
                case 'run':     runArray.push(data[i]);     break;
                case 'workout': workoutArray.push(data[i]); break;
            }
        }
        return {runArray, workoutArray};
    }
    onChangeSort() {
        const options = document.getElementById('sortOptions');
        const option = options.options[options.selectedIndex].value;
        switch(option) {
            case 'newest':   this.sortNewest();   return;
            case 'oldest':   this.sortOldest();   return;     
            case 'furthest': this.sortFurthest(); return;
            case 'shortest': this.sortShortest(); return;      
            case 'longest':  this.sortLongest();  return;      
            case 'quickest': this.sortQuickest(); return;              
        }
    }
    filterDate() {
        this.setState({filteringDate: true});
    }
    onChangeFilter() {
        const options = document.getElementById('filterOptions');
        const option = options.options[options.selectedIndex].value;
        switch(option) {            
            case 'run':     this.filterRuns();     return;
            case 'workout': this.filterWorkouts(); return;     
            case 'date':    this.filterDate(); return;  
        }
    }

    closeDateFilter() {        
        this.setState({filteringDate: false});
    }

    applyDateFilter(startDate, endDate) {
        this.closeDateFilter();
        console.log(startDate);
        console.log(endDate);
    }

    render() {
        const activityComponents = this.state.sortedAndFilteredData.map(activityData => 
            <Activity key={activityData.id} data={activityData} onClickCallback={this.setSelectedActivity}/>);
        return(
            <div className='activities-screen'>
                <h1 className='header'>Activities Screen</h1>
                <div className='sort-and-filter'>
                    <div className='sort-options'>
                        <h5>sort</h5>
                        <select name='sort' id='sortOptions' onChange={this.onChangeSort}>
                            <option value='newest'>Newest</option>
                            <option value='oldest'>Oldest</option>
                            <option value='furthest'>Furthest</option>
                            <option value='shortest'>Shortest</option>
                            <option value='longest'>Longest</option>      
                            <option value='quickest'>Quickest</option>                      
                        </select>                             
                    </div>  
                    <div className='filter-options'>
                        <h5>filter</h5>    
                        <select name='filter' id='filterOptions' onChange={this.onChangeFilter}>
                            <option value='date'>Date</option>
                            <option value='distance'>Distance</option>
                            <option value='time'>Time</option>
                            <option value='run'>Runs</option>
                            <option value='workout'>Workouts</option>
                        </select>
                    </div>  
                    <button onClick={() => {
                            this.setState({sortedAndFilteredData: this.state.activityData});
                            const filterOptions = document.getElementById('filterOptions').options;
                            filterOptions[0].selected = true;                                                        
                        }} className='reset-button'>Reset</button>                    
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
                <div>
                    {this.state.filteringDate ? <DateFilter 
                    onCloseCallback={this.closeDateFilter}
                    onApplyCallback={this.applyDateFilter}/> : <div/>}
                </div>         
            </div>
        );
    }
}

export default ActivitiesScreen;