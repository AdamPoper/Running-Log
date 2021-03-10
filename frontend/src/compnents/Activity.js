import React from 'react';

class Activity extends React.Component {
    constructor() {
        super();
        this.state = {
            date: '',
            activityInfo: '',
            description: ''
        };
        this.onSelectHandle = this.onSelectHandle.bind(this);
    }
    componentDidMount() {
        const info = this.props.data;

        this.setState({date: info.date});
        console.log(this.state.date);

        this.setState({activityInfo: info.displayString});
        console.log(this.state.activityInfo);

        this.setState({description: info.description});
        console.log(this.state.description);
    }
    

    onSelectHandle() {
        this.props.onClickCallback(this.state);
    }

    render() {
        return(
            <div className='activity' onClick={this.onSelectHandle}>
                <p>{this.state.date}</p>
                <div className='activity-info'>
                    <p>
                        {this.state.activityInfo}
                    </p>                    
                </div>                       
            </div>
        );
    }
}
export default Activity;