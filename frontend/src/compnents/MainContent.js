import React from 'react';
import Icon from './Icon.js';
import RunScreen from './RunScreen.js';
import WorkoutScreen from './WorkoutScreen.js';
import ActivitiesScreen from './ActivityScreen.js';

import '../App.css';

class MainContent extends React.Component {
    constructor() {
        super();
        this.state = {
            menuTitles: ['Run', 'Workout', 'Activities', 'Mileage', 'Tools'],
            menuIconData: [],
            activeScreen: null
        };
        this.setActiveScreen = this.setActiveScreen.bind(this);
        this.initMenuIconData = this.initMenuIconData.bind(this);
    }
    initMenuIconData() {
        const menuData = [
            {
                title: 'Run',
                screen: <RunScreen />,
                id: 0,
            },
            {
                title: 'Workout',
                screen: <WorkoutScreen />,
                id: 1
            },
            {
                title: 'Activities',
                screen: <ActivitiesScreen />,
                id: 2
            },
            {
                title: 'Mileage',
                screen: <RunScreen />,
                id: 3
            },
            {
                title: 'Tools',
                screen: <RunScreen />,
                id: 4
            }
        ];
        this.setState({menuIconData: menuData});
        this.setState({activeScreen: <RunScreen />});
    }
    componentDidMount() {
        this.initMenuIconData();
    }
    setActiveScreen(screen) {
        this.setState({activeScreen: screen});
    }

    render() {
        const iconComponents = this.state.menuIconData.map(data => 
            <Icon key={data.id} text={data.title} onClickCallback={this.setActiveScreen} screen={data.screen}/>);
        return(
            <div className="mainContent">
                <div className='menuItems'>
                    {iconComponents}
                </div>
                <div className='selectedScreen'>
                    {this.state.activeScreen}
                </div>
            </div>
        );
    }
}
export default MainContent;