import React from 'react';

class Activity extends React.Component {
    constructor() {
        super();
        this.state = {
            date: '',
            runInfo: '',
            description: ''
        };
        this.onSelectHandle = this.onSelectHandle.bind(this);
    }
    componentDidMount() {
        const info = this.props.data;

        this.setState({date: info.date});
        console.log(this.state.date);

        this.setState({runInfo: info.displayString});
        console.log(this.state.runInfo);

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
                <div className='run-info'>
                    <p>
                        {this.state.runInfo}
                    </p>                    
                </div>                       
            </div>
        );
    }
}
export default Activity;