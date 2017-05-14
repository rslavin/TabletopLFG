import React, {Component} from 'react';
import {Link} from 'react-router-dom'

class Sidebar extends Component {
    render() {
        return (

            <div className="list-group table-of-contents center-small">
                <Link to={'#'} className="list-group-item">Start a Game</Link>
                <Link to={'#'} className="list-group-item">Leagues</Link>
                <Link to={'#'} className="list-group-item">Something Else</Link>
            </div>
        )
    };
}

export default Sidebar