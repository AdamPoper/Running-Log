import React from 'react';
import '../ActivitiesScreen.css';
import Activity from './Activity.js';
import DateFilter from './DateFilter.js';
import DistanceFilter from './DistanceFilter.js';
import TimeFilter from './TimeFilter.js';

class ActivitiesScreen extends React.Component{
    constructor() {
        super();
        this.state = {
            activityData: [],
            selectedActivityData: {},
            sortedAndFilteredData: [],
            viewing: false,
            filteringDate: false,
            filteringDistance: false,
            filteringTime: false
        };
        this.initActivityData       = this.initActivityData.bind(this);
        this.setSelectedActivity    = this.setSelectedActivity.bind(this);     
        this.sortOldest             = this.sortOldest.bind(this);
        this.sortNewest             = this.sortNewest.bind(this);   
        this.onChangeSort           = this.onChangeSort.bind(this);
        this.onChangeFilter         = this.onChangeFilter.bind(this);
        this.filterRuns             = this.filterRuns.bind(this);
        this.filterWorkouts         = this.filterWorkouts.bind(this);
        this.separateActivityArrays = this.separateActivityArrays.bind(this);   
        this.filterDate             = this.filterDate.bind(this); 
        this.closeDateFilter        = this.closeDateFilter.bind(this);    
        this.applyDateFilter        = this.applyDateFilter.bind(this);
        this.closeDistanceFilter    = this.closeDistanceFilter.bind(this);
        this.applyDistanceFilter    = this.applyDistanceFilter.bind(this);
        this.filterDistance         = this.filterDistance.bind(this);
        this.filterTime             = this.filterTime.bind(this);
        this.closeDateFilter        = this.closeDateFilter.bind(this);
        this.applyTimeFilter        = this.applyTimeFilter.bind(this);
        this.closeTimeFilter        = this.closeTimeFilter.bind(this);
        this.selectionSort          = this.selectionSort.bind(this);
    }
    async initActivityData() {
        const response = await fetch('/api/all-activities');
        const res_data = await response.json();
        this.setState({activityData: res_data.activitiesArray});
        this.setState({sortedAndFilteredData: res_data.activitiesArray});
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
                else if(date1Parts[2] === date2Parts[2]) 
                    return true;
                else    
                    return false;
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
                else if(date1Parts[2] == date2Parts[2])
                    return true;
                else
                    return false;
            }
            return false;
        }
        return false;
    }
    // All the sorting algorithms use selection sort because that's the fastest sorting algorithm I know by heart
    sortOldest(data1, data2) {
        return (this.compareOldestDate(data1.date, data2.date));        
    }
    sortNewest(data1, data2) {
        return (this.compareNewestDate(data1.date, data2.date));        
    }
    sortFurthest(data1, data2) {
        return (data1.totalDistance < data2.totalDistance);       
    }
    sortShortest(data1, data2) {
        return (data1.totalDistance > data2.totalDistance)        
    }    
    sortLongest(data1, data2) {
        return (data1.totalSeconds < data2.totalSeconds);        
    }
    sortQuickest(data1, data2) {      
        return (data1.totalSeconds > data2.totalSeconds);        
    }
    selectionSort(testCondition) {
        let data = this.state.sortedAndFilteredData;        
        for(let i = 0; i < data.length; i++) {       
            let best = i;
            for(let j = i; j < data.length; j++)   
                if(testCondition(data[best], data[j])) 
                    best = j;                                                
            const temp = data[i];
            data[i] = data[best];
            data[best] = temp;
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
            case 'newest':   this.selectionSort(this.sortNewest);   return;
            case 'oldest':   this.selectionSort(this.sortOldest);   return;     
            case 'furthest': this.selectionSort(this.sortFurthest); return;
            case 'shortest': this.selectionSort(this.sortShortest); return;      
            case 'longest':  this.selectionSort(this.sortLongest);  return;      
            case 'quickest': this.selectionSort(this.sortQuickest); return;              
        }
    }
    filterDate() {
        this.setState({filteringDate: true});
    }
    filterDistance() {
        this.setState({filteringDistance: true});
    }
    filterTime() {
        this.setState({filteringTime: true});
    }
    onChangeFilter() {
        const options = document.getElementById('filterOptions');
        const option = options.options[options.selectedIndex].value;
        switch(option) {            
            case 'run'      : this.filterRuns();     return;
            case 'workout'  : this.filterWorkouts(); return;     
            case 'date'     : this.filterDate();     return;  
            case 'distance' : this.filterDistance(); return;
            case 'time'     : this.filterTime();     return;
        }
    }

    closeDateFilter() {        
        this.setState({filteringDate: false});
    }

    closeDistanceFilter() {
        this.setState({filteringDistance: false});        
    }

    closeTimeFilter() {
        this.setState({filteringTime: false});        
    }

    applyTimeFilter(fastest, slowest) {       
        this.closeTimeFilter();
        let parts = fastest.split(':');
        let fastestTime = parseInt(parts[0]) * 60 * 60;
        console.log(parts);
        fastestTime += parseInt(parts[1]) * 60;
        fastestTime += parseInt(parts[2]);
        console.log(`fastest ${fastestTime}`);
        parts = slowest.split(':');
        let slowestTime = parseInt(parts[0]) * 60 * 60;
        slowestTime += parseInt(parts[1]) * 60;
        slowestTime += parseInt(parts[2]);
        console.log(`slowest ${slowestTime}`);
        const data = this.state.sortedAndFilteredData;
        const timeFilteredData = [];
        for(let i = 0; i < data.length; i++)
            if(data[i].totalSeconds >= fastestTime && data[i].totalSeconds <= slowestTime)
                timeFilteredData.push(data[i]);
       
        this.setState({sortedAndFilteredData: timeFilteredData});        
    }

    applyDistanceFilter(low, high) {
        this.closeDistanceFilter();
        console.log(low);
        console.log(high);
        const distanceFilteredData = [];
        const data = this.state.sortedAndFilteredData;
        for(let i = 0; i < data.length; i++)
            if(data[i].totalDistance >= low && data[i].totalDistance <= high)
                distanceFilteredData.push(data[i]);       
        this.setState({sortedAndFilteredData: distanceFilteredData});
    }
    
    applyDateFilter(startDate, endDate) {
        this.closeDateFilter();
        const dateFilteredData = [];
        const data = this.state.sortedAndFilteredData;
        for(let i = 0; i < data.length; i++) 
        {            
            if(this.compareNewestDate(
                startDate, data[i].date) 
                && this.compareOldestDate(
                    endDate, data[i].date)) 
            {
                dateFilteredData.push(data[i]);
            }
        }
        console.log(startDate);
        console.log(endDate);
        this.setState({sortedAndFilteredData: dateFilteredData});
        console.log(this.state.sortedAndFilteredData);
    }

    async deleteDocument(doc) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(doc)
        };
        const response = await fetch('api/delete-record', options);
        const data = await response.json();
        console.log(data);
        const activities = this.state.activityData;
        for(let i = 0; i < activities.length; i++)
        {
            if(activities[i].id == doc.id)
            {
                console.log('deleting doc');
                activities.splice(i, 1);
            }
        }
        this.setState({activitiesArray: activities});
        const filteredActivities = this.state.sortedAndFilteredData;
        for(let i = 0; i < filteredActivities.length; i++)
        {
            if(filteredActivities[i].id == doc.id)
            {
                console.log('deleting doc');
                filteredActivities.splice(i, 1);
            }
        }
        this.setState({sortedAndFilteredData: filteredActivities});        
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
                            <option>Select</option>
                            <option value='date'>Date</option>
                            <option value='distance'>Distance</option>
                            <option value='time'>Time</option>
                            <option value='run'>Runs</option>
                            <option value='workout'>Workouts</option>
                        </select>
                    </div>  
                    <button onClick={() => {
                        console.log('deleting');
                        this.deleteDocument(this.state.selectedActivityData);
                    }}>Delete</button>
                    <button onClick={() => {
                            this.setState({sortedAndFilteredData: this.state.activityData});
                            const filterOptions = document.getElementById('filterOptions').options;
                            filterOptions[0].selected = true;                                                        
                        }}>Reset</button>                    
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

                    {this.state.filteringDistance ? <DistanceFilter 
                    onCloseCallback={this.closeDistanceFilter}
                    onApplyCallback={this.applyDistanceFilter}/> : <div/>}

                    {this.state.filteringTime ? <TimeFilter 
                    onCloseCallback={this.closeTimeFilter}
                    onApplyCallback={this.applyTimeFilter}/> : <div/>}
                </div>         
            </div>
        );
    }
}

export default ActivitiesScreen;