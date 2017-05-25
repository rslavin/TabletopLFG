import React, {Component} from 'react';
import store from '../store';
import {updateTitleAndSubtitle, updateOrgNames} from '../actions/index';
import {Link} from 'react-router-dom'
import Datatable from 'react-bs-datatable';
import {isInt} from '../utils/helpers';

import SessionList from './SessionList';
import {constants} from '../constants'

class OrgAdminPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orgId: 0
        };
    }

    componentWillMount() {
        var paramOrg = this.props.match.params.org;
        if (!isInt(paramOrg)) {
            // check if localstorage has it
            if (localStorage.getItem('org.short_name') == paramOrg && isInt(localStorage.getItem('org.id')))
                this.setState({orgId: localStorage.getItem('org.id')})
            else { // get it from the server
                $.ajax({
                    url: constants.API_HOST + "/org/" + paramOrg,
                    contentType: "application/json",
                    cache: false,
                    type: "GET",
                }).then(function (payload) {
                    this.setState({orgId: payload.organization.id});
                }.bind(this), function (err) {
                    console.log(err.responseText);
                });
            }
        }
    }


    render() {
        if (this.props.user == null) {
            return (
                <p>Please login to view your organization's admin panel</p>
            );
        }

        if (this.state.orgId == 0) {
            return (
                <p>Organization not found</p>
            )
        }
        return (
            <div>
                <OrgAddGame />
                <OrgGameList org={this.state.orgId}/>
            </div>
        );
    };
}

class OrgAddGame extends Component {

    render(){
        return(
            <p>Add a game here.</p>
        )
    }
}

class OrgGameList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            games: [],
        };
    }

    componentWillMount() {
        $.ajax({
            url: constants.API_HOST + "/games/" + this.props.org,
            contentType: "application/json",
            cache: false,
            type: "GET",
        }).then(function (payload) {
            this.setState({games: payload.games});
        }.bind(this), function (err) {
            console.log(err.responseText);
        });

    }

    render() {
        var header = [
            {title: 'Game', prop: 'name', sortable: true, filterable: true},
            {title: 'Publisher', prop: 'publisher', sortable: true, filterable: true},
            {title: 'Inventory', prop: 'inv', sortable: true, filterable: true}
        ];

        var gameRows = [];
        this.state.games.forEach(function (gameInv) {
            gameRows.push({
                name: gameInv.game.name,
                publisher: gameInv.game.publisher.name,
                inv: <InvData org={this.props.org} count={gameInv.inventory.count} gameId={gameInv.game.id}/>
            });
        }.bind(this));
        return (
            <div className="well well-primary">
                <h2>Inventory</h2>
                <hr />
                <Datatable
                    tableHeader={header}
                    tableBody={gameRows}
                    keyName="userTable"
                    tableClass="table table-striped table-warning table-hover responsive"
                    rowsPerPage={10}
                    rowsPerPageOption={[5, 10, 20, 50, 100]}
                    initialSort={{prop: "game", isAscending: true}}
                />
            </div>
        );
    }
}

class InvData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            updated: false
        };
    }

    componentWillMount() {
        this.setState({count: this.props.count})
    }

    componentWillReceiveProps(newProps) {
        if (this.props.count != newProps.count) {
            this.setState({count: newProps.count})
        }
    }

    setCount(count) {
        this.setState({count: count, updated: true})
    }


    render() {
        // if the count is manually reduced to zero (not on load), call it deleted (since it is on the server)
        if (this.state.count === 0 && this.state.updated) {
            return (
                <span>DELETED</span>
            )
        }
        return (
            <span>{this.state.count}
                <InvButton type="add" org={this.props.org}
                           gameId={this.props.gameId}
                           count={this.state.count}
                           onChange={this.setCount.bind(this)}/>
                <InvButton type="sub"
                           org={this.props.org}
                           count={this.state.count}
                           gameId={this.props.gameId}
                           onChange={this.setCount.bind(this)}/>
            </span>
        )
    }
}

class InvButton extends Component {

    onClick(operation) {
        var token = localStorage.getItem('token');
        if (token != null) {
            var count = this.props.count;
            if (operation == "add")
                count = count + 1;
            else if (operation == "sub" && count > 0)
                count = count - 1;

            $.ajax({
                url: constants.API_HOST + "/game/org",
                contentType: "application/json",
                cache: false,
                type: "POST",
                headers: {
                    'Authorization': 'Bearer: ' + token,
                },
                data: JSON.stringify({
                    'organization_id': this.props.org,
                    'game_id': this.props.gameId,
                    "count": count,
                }),
            }).then(function (payload) {
                this.props.onChange(payload.inventory.count);
            }.bind(this), function (err) {
                console.log(err.responseText);
            });
        }
    }

    render() {
        if (this.props.type == 'sub') {
            return (
                <button className="btn-danger btn-xs floatright" onClick={this.onClick.bind(this, "sub")}><i
                    className="fa fa-minus"/></button>
            )
        }
        return (
            <button className="btn-success btn-xs floatright" onClick={this.onClick.bind(this, "add")}><i
                className="fa fa-plus"/></button>
        )
    }
}

export default OrgAdminPage