import React, {Component} from 'react';

import SessionBox from './SessionBox';
import {constants} from '../constants';
import {logout} from './auth/Login';

class SessionList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userSessions: [],
        }
    }

    // TODO create a filter component and feed games, types, times, into it
    // TODO dynamically filter these based on the checkbox components

    componentWillMount() {
        this.getUserSessions();
    }

    getUserSessions() {
        // get this user's sessions
        var token = localStorage.getItem('token');
        var sessionState = this.props.sessionState != null ? this.props.sessionState : "future";
        if (token != null) {
            $.ajax({
                url: constants.API_HOST + "/user/sessions/" + sessionState,
                contentType: "application/json",
                cache: false,
                type: "GET",
                headers: {
                    'Authorization': 'Bearer: ' + token,
                },
            }).then(function (payload) {
                // convert objects to array of ids
                var ids = [];
                payload.sessions.forEach(function (session) {
                    ids.push(session.id);
                });
                this.setState({userSessions: ids});
            }.bind(this), function (err) {
                // no results
                console.log(err.responseJSON.error);
                if (err.responseJSON.error == "INVALID_TOKEN")
                    logout();
            }.bind(this));
        }
    }

    componentWillReceiveProps(newProps) {
        // if the username has changed (even to null) get the sessions
        // this happens with a logout/login
        if (newProps.hasOwnProperty('username') && newProps.username != this.props.username)
            this.getUserSessions();
    }

    render() {
        var sRows = [];
        if (this.props.sessions) {
            var count = 1;
            var rowSessions = [];
            var i = 1;
            this.props.sessions.forEach(function (session) {
                if (count == 5) {
                    sRows.push(<SessionListRow key={i} sessions={rowSessions} username={this.props.username}
                                               userSessions={this.state.userSessions}/>);
                    rowSessions = [];
                    count = 1;
                }
                rowSessions.push(session);
                count++;
                i++;
            }.bind(this));
            if (rowSessions !== []) {
                sRows.push(<SessionListRow key={i} sessions={rowSessions} username={this.props.username}
                                           userSessions={this.state.userSessions}/>);
            }
        } else {
            sRows.push(
                <h3>No sessions</h3>
            );
        }
        return (
            <div>
                {sRows}
            </div>
        )
    };
}

class SessionListRow extends Component {
    render() {
        var r = [];
        this.props.sessions.forEach(function (session) {
            r.push(<SessionBox key={session.id} session={session} username={this.props.username}
                               userSessions={this.props.userSessions}/>)
        }.bind(this));
        return (
            <div className="row">
                {r}
            </div>
        )
    }
}

export default SessionList