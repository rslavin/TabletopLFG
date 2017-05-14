import React, {Component} from 'react';
import store from '../store';
import {updateTitleAndSubtitle, updateTitle, updateSubtitle} from '../actions/index';

import SessionList from './SessionList';
import {constants} from '../constants'

class SearchResults extends Component {

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
            url: constants.API_HOST + "/api/sessions/org/" + this.props.match.params.org +
            "/search/" + this.props.match.params.q + "/open",
            contentType: "application/json",
            cache: false,
            type: "GET",
        }).then(function (payload) {
            this.setState({sessions: payload.sessions});
            console.log(this.state.sessions);
            store.dispatch(updateTitleAndSubtitle(payload.organization.name, "Search: " + this.props.match.params.q));
        }.bind(this), function (err) {
            console.log("error: " + err);
            $.ajax({
                url: constants.API_HOST + "/api/org/" + this.props.match.params.org,
                contentType: "application/json",
                cache: false,
                type: "GET",
            }).then(function (payload) {
                this.setState({name: payload.organization.name});
                store.dispatch(updateTitleAndSubtitle(payload.organization.name, "Search: " + this.props.match.params.q));
            }.bind(this), function (err) {
                console.log("error: " + err);
                store.dispatch(updateTitle(""))
            });
            store.dispatch(updateTitle(""))
        }.bind(this));

    }

    render() {
        if(this.state.sessions != []) {
            return (
                <SessionList sessions={this.state.sessions}/>
            );
        }
        return (
            <div>
                No sessions found.
            </div>
        )
    };
}

export default SearchResults