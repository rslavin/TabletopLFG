import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ReactDOM, {render} from 'react-dom';
import {relativeDate, xmlToJson} from '../utils/helpers';
import {constants} from '../constants';
import store from '../store';
import {updateModal} from '../actions/index';
import {logout} from './auth/Login';

var moment = require('moment');

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
                    'Authorization': 'Bearer ' + token,
                },
            }).then(function () {
                this.props.parentSignUp();
            }.bind(this), function (err) {
                switch (err.responseJSON.error) {
                    case "SESSION_OVERLAP_WITH_OTHER_SESSION":
                        var body = <span>You cannot sign up for this session since it overlaps with another session you are
                            currently signed up for:  <Link
                                to={"/session/" + err.responseJSON.other_session.id}>{err.responseJSON.other_session.title}</Link></span>;

                        store.dispatch(updateModal({
                            body: body,
                            title: 'Session Conflict', open: true, style: ''
                        }));
                        break;
                    case "USER_HAS_TOO_MANY_SESSIONS":
                        store.dispatch(updateModal({
                            body: 'You cannot sign up for any more sessions (max = ' + err.responseJSON.max_sessions + ')',
                            title: 'Too Many Sessions', open: true, style: ''
                        }));
                        break;
                    case "INVALID_TOKEN":
                        store.dispatch(updateModal({
                            body: 'Your session has expired. Please login again.',
                            title: 'Session Expired', open: true, style: ''
                        }));
                        logout();
                        break;
                    case "SESSION_OVER":
                        store.dispatch(updateModal({
                            body: 'You cannot join a past sessions.',
                            title: 'Session Over', open: true, style: ''
                        }));
                        break;
                    default:
                        store.dispatch(updateModal({
                            body: 'Yikes! An unknown error has occurred. Try refreshing the page.',
                            title: 'Error', open: true, style: ''
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
                    'Authorization': 'Bearer ' + token,
                },
            }).then(function (payload) {
                if (payload.hasOwnProperty('success')) {
                    this.props.parentLeave();
                } else {
                    console.log("error");
                }
            }.bind(this), function (err) {
                if(err.responseJSON.error == "INVALID_TOKEN"){
                    store.dispatch(updateModal({
                        body: 'Your session has expired. Please login again.',
                        title: 'Session Expired', open: true, style: ''
                    }));
                    logout();
                }
                if(err.responseJSON.error == "SESSION_OVER"){
                    store.dispatch(updateModal({
                        body: 'You cannot leave past sessions.',
                        title: 'Session Over', open: true, style: ''
                    }));
                }
            }.bind(this));
        }
    }

    render() {
        // render links
        if(this.props.style == "link"){
            if (this.props.user == null) {
                return <a className="text-warning pointer">Login to Sign Up</a>;
            } else if (this.props.signedUp) {
                return <a className="text-danger pointer" onClick={this.doLeave.bind(this)}>Leave</a>;
            } else if (this.props.openSlots < 1) {
                return <a className="text-danger pointer">Session Full</a>;
            }
            return <a className="text-success pointer" onClick={this.doSignup.bind(this)}>Sign Up</a>;
        }

        // render buttons
        if (this.props.user == null) {
            return <button className=" btn btn-success btn-xs disabled"
                           data-tip="Login to sign up.">Sign Up</button>;
        } else if (this.props.signedUp) {
            return <button className="btn btn-danger btn-xs"
                           onClick={this.doLeave.bind(this)}
            >Leave</button>;
        } else if (this.props.openSlots < 1) {
            return <button className="btn btn-success btn-xs disabled"
                           data-tip="Session full">Sign Up</button>;
        }
        return <button className="btn btn-success btn-xs" onClick={this.doSignup.bind(this)}>Sign
            Up</button>;
    }
}

export default SignupButton