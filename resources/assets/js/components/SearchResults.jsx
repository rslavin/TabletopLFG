import React, {Component} from 'react';
import store from '../store';
import {updateTitleAndSubtitle, updateTitle} from '../actions/index';

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

    doSearch(){
        $.ajax({
            url: constants.API_HOST + "/sessions/org/" + this.props.match.params.org +
            "/search/" + this.props.match.params.q,// + "/open",
            contentType: "application/json",
            cache: false,
            type: "GET",
        }).then(function (payload) {
            this.setState({sessions: payload.sessions});
            store.dispatch(updateTitleAndSubtitle(payload.organization.name, "Search: " + this.props.match.params.q));
            localStorage.setItem('org.name', payload.organization.name);
            localStorage.setItem('org.short_name', payload.organization.short_name);
        }.bind(this), function (err) {
            // no results
            console.log("error: " + err);
            // get org name
            if (localStorage.getItem('org.name') != null) {
                store.dispatch(updateTitleAndSubtitle(localStorage.getItem('org.name'), "Search: " + this.props.match.params.q));
            } else {
                $.ajax({
                    url: constants.API_HOST + "/org/" + this.props.match.params.org,
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
            }
            this.setState({sessions: []});
        }.bind(this));
    }

    componentWillMount(){
        this.doSearch();
    }

    componentWillReceiveProps() {
        this.doSearch();
    }

    render() {
        if (this.state.sessions.length > 0) {
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