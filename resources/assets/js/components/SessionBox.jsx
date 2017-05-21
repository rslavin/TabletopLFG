import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ReactDOM, {render} from 'react-dom';
import {relativeDate, xmlToJson} from '../utils/helpers';
import GameImage from './GameImage';
import ReactTooltip from 'react-tooltip';
import {constants} from '../constants';
import store from '../store';
import {updateModal} from '../actions/index';


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
                        <SignupButton username={this.props.username} signedUp={this.state.signedUp}
                                      openSlots={this.state.openSlots} session={this.props.session}
                                      parentSignUp={this.signUp.bind(this)} parentLeave={this.leave.bind(this)}/>
                    </div>
                </div>
                <ReactTooltip/>
            </div>
        )
    };
}

class SignupButton extends Component {

    doSignup() {
        var token = localStorage.getItem('token');
        if (token != null) {
            $.ajax({
                url: constants.API_HOST + "/user/session/" + this.props.session.id,
                contentType: "application/json",
                cache: false,
                type: "POST",
                headers: {
                    'Authorization': 'Bearer: ' + token,
                },
            }).then(function () {
                this.props.parentSignUp();
            }.bind(this), function (err) {
                if (err.responseJSON.error == "SESSION_OVERLAP_WITH_OTHER_SESSION") {
                    var body = <span>You cannot sign up for this session since it overlaps with another session you are
                            currently signed up for:  <Link
                            to={"/session/" + err.responseJSON.other_session.id}>{err.responseJSON.other_session.title}</Link></span>;

                    store.dispatch(updateModal({
                        body: body,
                        title: 'Session Conflict', open: true, style: ''
                    }));
                } else if (err.responseJSON.error == "USER_HAS_TOO_MANY_SESSIONS") {
                    store.dispatch(updateModal({
                        body: 'You cannot sign up for any more sessions (max = ' + err.responseJSON.max_sessions + ')',
                        title: 'Too Many Sessions', open: true, style: ''
                    }));
                }
            }.bind(this));
        }
    }

    doLeave() {
        var token = localStorage.getItem('token');
        if (token != null) {
            $.ajax({
                url: constants.API_HOST + "/user/session/" + this.props.session.id,
                contentType: "application/json",
                cache: false,
                type: "DELETE",
                headers: {
                    'Authorization': 'Bearer: ' + token,
                },
            }).then(function (payload) {
                if (payload.hasOwnProperty('success')) {
                    this.props.parentLeave();
                } else {
                    console.log("error");
                }
            }.bind(this), function (err) {
                console.log(err.responseJSON.error);
            }.bind(this));
        }
    }

    render() {
        if (this.props.username == null) {
            return <button className="pull-right btn btn-success btn-xs disabled"
                           data-tip="Login to sign up.">Sign Up</button>;
        } else if (this.props.signedUp) {
            return <button className="pull-right btn btn-danger btn-xs"
                           onClick={this.doLeave.bind(this)}
            >Leave</button>;
        } else if (this.props.openSlots < 1) {
            return <button className="pull-right btn btn-success btn-xs disabled"
                           data-tip="Session full">Sign Up</button>;
        }
        return <button className="pull-right btn btn-success btn-xs" onClick={this.doSignup.bind(this)}>Sign
            Up</button>;
    }
}

export default SessionBox