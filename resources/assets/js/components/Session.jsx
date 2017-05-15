import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ReactDOM, {render} from 'react-dom';

var moment = require('moment');
class SessionBox extends Component {

    componentDidMount() {
        // fade in
        var elem = ReactDOM.findDOMNode(this)
        elem.style.opacity = 0;
        window.requestAnimationFrame(function () {
            elem.style.transition = "opacity 550ms";
            elem.style.opacity = 1;
        });
    }

    render() {
        var openSlots = this.props.data.game.max_players - this.props.data.users.length;

        var slotsClass = "slots-closed";
        if (openSlots == 1)
            slotsClass = "slots-warning";
        else if (openSlots > 1)
            slotsClass = "slots-open";

        var wellClass = "well session-box";
        var titlePrefix = "";
        if(this.props.data.sponsor_note != null) {
            wellClass = wellClass + " sponsor-box";
            titlePrefix = "SPONSORED: ";
        }
        return (
            <div className="col-md-3 col-lg-3">
                <div className={wellClass}>
                    <div className="session-box-description">
                        <p className="session-title">
                            {titlePrefix + this.props.data.title}
                        </p>
                        <p className="session-game">
                            {this.props.data.game.name}
                        </p>
                        <p className="session-box-details">
                            <i className="fa fa-group"/> Players:
                            <span className={slotsClass}>
                            &nbsp;{this.props.data.users.length}/{this.props.data.game.max_players}
                            </span>
                        </p>
                        <p className="session-box-details">
                            <i className="fa fa-calendar"/> When: {moment(this.props.data.start_time).fromNow()}
                        </p>
                    </div>
                    <hr />
                    <div className="session-box-buttons">
                        <Link to="#" className="floatleft btn btn-warning btn-xs">More Info</Link>
                        <Link to="#" className="pull-right btn btn-success btn-xs">Sign Up</Link>
                    </div>
                </div>
            </div>
        )
    };
}

export default SessionBox