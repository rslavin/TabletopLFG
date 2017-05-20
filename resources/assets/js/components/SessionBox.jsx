import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ReactDOM, {render} from 'react-dom';
import {relativeDate, xmlToJson} from '../utils/helpers';
import GameImage from './GameImage';
import ReactTooltip from 'react-tooltip';


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

    componentWillReceiveProps() {
        ReactTooltip.rebuild();
    }

    render() {
        var openSlots = this.props.data.game.max_players - this.props.data.users.length;

        var slotsClass = "text-danger";
        if (openSlots == 1)
            slotsClass = "text-warning";
        else if (openSlots > 1)
            slotsClass = "text-success";

        var wellClass = "panel session-box";
        var titlePrefix = "";
        if (this.props.data.sponsor_note != null) {
            wellClass = wellClass + " panel-info";
            titlePrefix = <span className="label label-warning">SPONSORED</span>;
        } else {
            wellClass = wellClass + " panel-primary";
        }

        var signUpButton = <Link to="#" className="pull-right btn btn-success btn-xs">Sign Up</Link>;
        if (this.props.username == null) {
            signUpButton = <button className="pull-right btn btn-success btn-xs disabled"
                                   data-tip="Login to sign up.">Sign Up</button>
        }

        return (
            <div className="col-md-3 col-lg-3">
                <div className={wellClass}>
                    <div className="panel-heading session-box-heading">
                        {titlePrefix} {this.props.data.title}
                    </div>
                    <div className="panel-body session-box-description">

                        <div className="row session-game">
                            <div className="col-md-4">
                                <GameImage size="60" bgg_id={this.props.data.game.bgg_id}/>
                            </div>
                            <div className="col-md-8">
                                {this.props.data.game.name}
                            </div>
                        </div>
                        <p className="session-box-details">
                            <i className="fa fa-group"/> Players:
                            <span className={slotsClass}>
                            &nbsp;{this.props.data.users.length}/{this.props.data.game.max_players}
                            </span>
                        </p>
                        <p className="session-box-details">
                            <i className="fa fa-calendar"/> When: <span
                            data-tip={moment(this.props.data.start_time).format("dddd, MMMM Do YYYY, h:mm A")}>{relativeDate(this.props.data.start_time)}</span>
                        </p>
                    </div>
                    <div className="panel-footer session-box-buttons">
                        <Link to={"/session/" + this.props.data.id} className="floatleft btn btn-warning btn-xs">More
                            Info</Link>
                        {signUpButton}
                    </div>
                </div>
                <ReactTooltip/>
            </div>
        )
    };
}

export default SessionBox