import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom'

import NotFound from './NotFound'
import Organization from './Organization'
import Landing from './Landing'
import Sidebar from './Sidebar'

class Spinner extends Component {
    render() {
        return (
            <div className="col-xs-12 col-sm-10 col-md-10">
                <div className="pushdown"></div>
                <div  className="loader"></div>
            </div>
        )
    };
}

export default Spinner