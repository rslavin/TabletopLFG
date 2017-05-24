import React, {Component} from 'react';
import store from '../store';
import {updateTitleAndSubtitle, updateOrgNames} from '../actions/index';
import {Link} from 'react-router-dom'

import SessionList from './SessionList';
import {constants} from '../constants'

class UserSessions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sessions: [],
            name: "",
            note: ""
        };
    }

    componentWillMount() {
        this.getSessions();
    }

    getSessions(){
        var token = localStorage.getItem('token');
        if (token != null) {
            $.ajax({
                url: constants.API_HOST + "/user/sessions/all?sort=desc",
                contentType: "application/json",
                cache: false,
                type: "GET",
                headers: {
                    'Authorization': 'Bearer: ' + token,
                },
            }).then(function (payload) {
                this.setState({sessions: payload.sessions});
                store.dispatch(updateTitleAndSubtitle(this.props.user.username + "'s Sessions", ""));
            }.bind(this), function (err) {
                console.log(err.responseText);
            });
        }else{
            this.setState({sessions: []})
            store.dispatch(updateTitleAndSubtitle("Please log in", ""));
        }
    }

    componentWillReceiveProps() {
        this.getSessions();
    }

    render() {
        if(this.props.user == null){
            return <div>Please log in to view your sessions.</div>
        }

        return (
            <SessionList sessions={this.state.sessions} user={this.props.user} sessionState="all"/>
        );
    };
}

export default UserSessions