import React from 'react';

class Icon extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    render() {
        return (
            <div className='icon' onClick={() => {
                this.props.onClickCallback(this.props.screen);
            }}>
                <h1>{this.props.text}</h1>
            </div>
        );
    }
}
export default Icon;