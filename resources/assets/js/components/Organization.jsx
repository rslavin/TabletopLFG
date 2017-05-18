import React, {Component} from 'react';
import store from '../store';
import {updateTitleAndSubtitle} from '../actions/index';
import {Link} from 'react-router-dom'

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
            store.dispatch(updateTitleAndSubtitle(<Link to={"/o/"+payload.organization.short_name}>{payload.organization.name}</Link>, "Upcoming Sessions"));
            localStorage.setItem('org.short_name', payload.organization.short_name);
            localStorage.setItem('org.name', payload.organization.name);
        }.bind(this), function (err) {
            console.log(err.responseText);
        });

    }

    render() {
        return (
            <SessionList sessions={this.state.sessions}/>
        );
    };
}

export default Organization