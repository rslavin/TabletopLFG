import React, {Component} from 'react';
import store from '../store';
import {updateTitleAndSubtitle} from '../actions/index';

import Session from './Session';
import {constants} from '../constants'

class Organization extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sessions: [],
            name: "",
            note: ""
        };
    }

    componentWillMount() {
        $.ajax({
            url: constants.API_HOST + "/api/sessions/org/" + this.props.match.params.org + "/future",
            contentType: "application/json",
            cache: false,
            type: "GET",
        }).then(function (payload) {
            this.setState({sessions: payload.sessions});
            store.dispatch(updateTitleAndSubtitle(payload.organization.name, "Upcoming Sessions"));
        }.bind(this), function (err) {
            console.log("error: " + err);
        });
    }

    render() {
        // TODO move this to SessionList
        var s = [];
        if (this.state.sessions) {
            this.state.sessions.forEach(function (session) {
                s.push(<Session key={session.id} data={session}/>)
            });
        }else {
            s.push(
                <h3>No upcoming Sessions</h3>
            );
        }
        return (
            <div>
                {s}
            </div>
        )
    };
}

export default Organization