import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom'



class SpinnerText extends Component {
    render() {
        if (!this.props.loading) {
            return <span/>;
        }
        return (<span className='fa fa-spinner fa-spin'/>);
    }
}

export default SpinnerText
