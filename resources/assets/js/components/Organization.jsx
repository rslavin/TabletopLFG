import React, {Component} from 'react';
import store from '../store';
import {updateTitleAndSubtitle} from '../actions/index';

import SessionList from './SessionList';
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
            url: constants.API_HOST + "/sessions/org/" + this.props.match.params.org + "/future",
            contentType: "application/json",
            cache: false,
            type: "GET",
        }).then(function (payload) {
            this.setState({sessions: payload.sessions});
            store.dispatch(updateTitleAndSubtitle(payload.organization.name, "Upcoming Sessions"));
            localStorage.setItem('org', payload.organization.short_name);
        }.bind(this), function (err) {
            console.log("error: " + err);
        });

    }

    render() {
        return (
            <SessionList sessions={this.state.sessions}/>
        );
    };
}

export default Organization