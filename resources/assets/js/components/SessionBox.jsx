import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ReactDOM, {render} from 'react-dom';
import {relativeDate, xmlToJson} from '../utils/helpers';
import GameImage from './GameImage';
import ReactTooltip from 'react-tooltip';
import SignupButton from './SignupButton';

var moment = require('moment');
class SessionBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openSlots: 0,
            signedUp: false,
            userCount: 0,
            deleted: false,
        };
    }

    componentDidMount() {
        // fade in
        var elem = ReactDOM.findDOMNode(this)
        elem.style.opacity = 0;
        window.requestAnimationFrame(function () {
            elem.style.transition = "opacity 550ms";
            elem.style.opacity = 1;
        });
    }

    updateCounts(props) {
        // this is probably a bit of an anti pattern. would be better not to update state based on prop updates
        var userCount = props.session.users.length;
        var openSlots = props.session.game.max_players - userCount;
        var signedUp = props.userSessions.indexOf(props.session.id) > -1;

        this.setState({openSlots: openSlots, signedUp: signedUp, userCount: userCount});
    }

    componentWillMount() {
        this.updateCounts(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.updateCounts(newProps);
        ReactTooltip.rebuild();
    }

    signUp() {
        this.setState({
            signedUp: true,
            userCount: this.state.userCount + 1,
            openSlots: this.state.openSlots - 1
        })
    }

    leave() {
        var deleted = false;
        if (this.state.userCount == 1)
            deleted = true;

        this.setState({
            signedUp: false,
            userCount: this.state.userCount - 1,
            openSlots: this.state.openSlots + 1,
            deleted: deleted
        })
    }


    render() {
        // this happens when the user leaves the session and they were the last member
        if (this.state.deleted)
            return (<div></div>);

        var slotsClass = "text-danger";
        if (this.state.openSlots == 1)
            slotsClass = "text-warning";
        else if (this.state.openSlots > 1)
            slotsClass = "text-success";

        var wellClass = "panel session-box";
        var titlePrefix = "";
        if (this.props.session.sponsor_note != null) {
            wellClass = wellClass + " panel-info";
            titlePrefix = <span className="label label-warning">SPONSORED</span>;
        } else {
            wellClass = wellClass + " panel-primary";
        }

        return (
            <div className="col-md-3 col-lg-3">
                <div className={wellClass}>
                    <div className="panel-heading session-box-heading">
                        {titlePrefix} {this.props.session.title}
                    </div>
                    <div className="panel-body session-box-description">

                        <div className="row session-game">
                            <div className="col-md-4">
                                <GameImage size="60" bgg_id={this.props.session.game.bgg_id}/>
                            </div>
                            <div className="col-md-8">
                                {this.props.session.game.name}
                            </div>
                        </div>
                        <p className="session-box-details">
                            <i className="fa fa-group"/> Players:
                            <span className={slotsClass}>
                            &nbsp;{this.state.userCount}/{this.props.session.game.max_players}
                            </span>
                        </p>
                        <p className="session-box-details">
                            <i className="fa fa-calendar"/> When: <span
                            data-tip={moment(this.props.session.start_time).format("dddd, MMMM Do YYYY, h:mm A")}>{relativeDate(this.props.session.start_time)}</span>
                        </p>
                    </div>
                    <div className="panel-footer session-box-buttons">
                        <Link to={"/session/" + this.props.session.id} className="floatleft btn btn-warning btn-xs">More
                            Info</Link>
                        <span className="pull-right"><SignupButton username={this.props.username}
                                                                   signedUp={this.state.signedUp}
                                                                   openSlots={this.state.openSlots}
                                                                   session={this.props.session}
                                                                   parentSignUp={this.signUp.bind(this)}
                                                                   parentLeave={this.leave.bind(this)}/>
                            </span>
                    </div>
                </div>
            </div>
        )
    };
}


export default SessionBox