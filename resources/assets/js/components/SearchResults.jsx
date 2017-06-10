import React, {Component} from 'react';
import store from '../store';
import {updateTitleAndSubtitle, updateTitle} from '../actions/index';
import {Link} from 'react-router-dom';
import Paginator from './Paginator';

import SessionList from './SessionList';
import {constants} from '../constants'

class SearchResults extends Component {
    static get SKIP_INTERVAL() {
        return 16;
    }

    constructor(props) {
        super(props);
        this.state = {
            sessions: [],
            name: "",
            note: "",
            skip: 0,
        };
    }
    setSkip(skip) {
        this.doSearch(skip);
    }

    doSearch(skip = 0) {
        $.ajax({
            url: constants.API_HOST + "/sessions/org/" + this.props.match.params.org +
            "/search/" + this.props.match.params.q + "/&skip=" + skip + "&take=" + SearchResults.SKIP_INTERVAL,
            contentType: "application/json",
            cache: false,
            type: "GET",
        }).then(function (payload) {
            this.setState({sessions: payload.sessions});
            store.dispatch(updateTitleAndSubtitle(<Link
                to={"/o/" + payload.organization.short_name}>{payload.organization.name}</Link>, "Search: " + this.props.match.params.q));
            localStorage.setItem('org.name', payload.organization.name);
            localStorage.setItem('org.short_name', payload.organization.short_name);
            localStorage.setItem('org.id', payload.organization.id);
        }.bind(this), function (err) {
            // no results
            console.log(err.responseText);
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
                    console.log(err.responseText);
                    store.dispatch(updateTitle(""))
                });
            }
            // clear out sessions
            this.setState({sessions: []});
        }.bind(this));
    }

    componentWillMount() {
        this.doSearch();
    }

    componentWillReceiveProps(newProps) {
        if (this.props.match.params.q != newProps.match.params.q)
            this.doSearch();
    }


    render() {
        var disabledNext = false;
        if(this.state.sessions.length < SearchResults.SKIP_INTERVAL)
            disabledNext = true;

        if (this.state.sessions.length > 0) {
            return (
                <div>
                    <SessionList sessions={this.state.sessions} user={this.props.user}/>
                    <Paginator setSkip={this.setSkip.bind(this)} currentOffset={this.state.skip} disabled={disabledNext}
                               interval={SearchResults.SKIP_INTERVAL}/>
                </div>
            );
        }
        return (
            <div>
                No games found.
            </div>
        )
    };
}

export default SearchResults