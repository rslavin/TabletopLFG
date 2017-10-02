import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {updateTitleAndSubtitle} from '../actions/index';
import store from '../store';
import {constants} from '../constants'

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orgs: []
        };
    }


    componentWillMount() {
        store.dispatch(updateTitleAndSubtitle("Hands Up LFG"));
        localStorage.setItem('org.short_name', '');
        localStorage.setItem('org.name', '');
        localStorage.setItem('org.id', '');
        $.ajax({
            url: constants.API_HOST + "/orgs",
            contentType: "application/json",
            cache: false,
            type: "GET",
        }).then(function (payload) {
            this.setState({orgs: payload.organizations});

        }.bind(this), function (err) {
            console.log("error: " + err);
            localStorage.removeItem('token');
        }.bind(this));
    }

    render() {

        var o = [];
        this.state.orgs.forEach(function (org) {
            o.push(<Link to={"/o/" + org.short_name} className="list-group-item" key={org.id}>{org.name}</Link>)
        });

        return (
            <div className="row">
                <div className="col-md-6">
                    <div className="list-group">
                            <div className="list-group-item list-group-item-text list-group-item-info list-group-item-heading">
                                About Us
                            </div>
                            <div className="list-group-item">
                                <p>{constants.APP_NAME} is a place to find other people to play tabletop games with. To
                                    begin,
                                    select
                                    the organization you're looking to play at from the list. If you're interested in
                                    using {constants.APP_NAME} for your organization, <Link to="#">send us a message</Link>!</p>
                            </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="list-group">
                            <div className="list-group-item list-group-item-text list-group-item-info list-group-item-heading">
                                Organizations
                            </div>
                            {o}
                    </div>
                </div>
            </div>
        )
    };
}

export default Landing