import React, {Component} from 'react';
import store from '../store';
import {updateTitleAndSubtitle, updateOrgNames} from '../actions/index';
import {Link} from 'react-router-dom'
import Paginator from './Paginator';

import SessionList from './SessionList';
import {constants} from '../constants'

class UserSessions extends Component {
    static get SKIP_INTERVAL() {
        return 16;
    }

    constructor(props) {
        super(props);
        this.state = {
            sessions: [],
            name: "",
            note: "",
            skip: 0
        };
    }

    componentWillMount() {
        this.getSessions();
    }

    setSkip(skip) {
        this.getSessions(skip);
    }

    getSessions(skip = 0) {
        var token = localStorage.getItem('token');
        if (token != null) {
            $.ajax({
                url: constants.API_HOST + "/user/sessions/all?sort=desc&skip=" + skip + "&take=" + UserSessions.SKIP_INTERVAL,
                contentType: "application/json",
                cache: false,
                type: "GET",
                headers: {
                    'Authorization': 'Bearer: ' + token,
                },
            }).then(function (payload) {
                this.setState({sessions: payload.sessions, skip: skip});
                store.dispatch(updateTitleAndSubtitle(this.props.user.username + "'s Sessions", ""));
            }.bind(this), function (err) {
                console.log(err.responseText);
            });
        } else {
            this.setState({sessions: []})
            store.dispatch(updateTitleAndSubtitle("Please log in", ""));
        }
    }

    componentWillReceiveProps() {
        this.getSessions();
    }

    render() {
        if (this.props.user == null) {
            return <div>Please log in to view your sessions.</div>
        }

        var disabledNext = false;
        if(this.state.sessions.length < UserSessions.SKIP_INTERVAL)
            disabledNext = true;

        return (
            <div>
                <SessionList sessions={this.state.sessions} user={this.props.user} sessionState="all"/>
                <Paginator setSkip={this.setSkip.bind(this)} currentOffset={this.state.skip} disabled={disabledNext}
                interval={UserSessions.SKIP_INTERVAL} />
            </div>
        );
    };
}

export default UserSessions