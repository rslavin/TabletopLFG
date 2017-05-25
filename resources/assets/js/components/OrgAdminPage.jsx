import React, {Component} from 'react';
import store from '../store';
import {updateTitleAndSubtitle, updateOrgNames} from '../actions/index';
import {Link} from 'react-router-dom'
import Datatable from 'react-bs-datatable';
import {isInt} from '../utils/helpers';
import SpinnerText from './SpinnerText';

import {constants} from '../constants'

class OrgAdminPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orgId: 0,
            key: 0
        };
    }

    componentWillMount() {
        var paramOrg = this.props.match.params.org;
        // if short_name uri and it matches sessionStorage
        if (!isInt(paramOrg) && localStorage.getItem('org.short_name') == paramOrg && isInt(localStorage.getItem('org.id'))) {
            this.setState({orgId: localStorage.getItem('org.id')});
            store.dispatch(updateTitleAndSubtitle(localStorage.getItem('org.name'), 'Administrative Panel'));
        }else if (localStorage.getItem('org.id') == paramOrg) { // int uri matches localStorage
            this.setState({orgId: localStorage.getItem('org.id')});
            store.dispatch(updateTitleAndSubtitle(localStorage.getItem('org.name'), 'Administrative Panel'));
        }

        // if id still not found, get it from server
        if (this.state.orgId === 0) {
            $.ajax({
                url: constants.API_HOST + "/org/" + paramOrg,
                contentType: "application/json",
                cache: false,
                type: "GET",
            }).then(function (payload) {
                this.setState({orgId: payload.organization.id});
                localStorage.setItem('org.id', payload.organization.id);
                localStorage.setItem('org.short_name', payload.organization.short_name);
                localStorage.setItem('org.name', payload.organization.name);
                store.dispatch(updateTitleAndSubtitle(payload.organization.name, 'Administrative Panel'));
            }.bind(this), function (err) {
                console.log(err.responseText);
            });
        }

    }

    // rerender inventory on added game
    updateKey(){
        this.setState({key: this.state.key + 1}) ;
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
                <OrgAddGame updateKey={this.updateKey.bind(this)} org={this.state.orgId}/>
                <OrgGameList key={this.state.key} org={this.state.orgId}/>
            </div>
        );
    }
    ;
}

class OrgAddGame extends Component {

    constructor(props) {
        super(props);
        this.state = {
            games: [],
            loading: false,
            game_id: "",
            count: null,
            regErrors: null
        };
    }

    componentWillMount() {
        $.ajax({
            url: constants.API_HOST + "/games/",
            contentType: "application/json",
            cache: false,
            type: "GET",
        }).then(function (payload) {
            this.setState({games: payload.games});
        }.bind(this), function (err) {
            console.log(err.responseText);
        });

    }

    onChange(e) {
        var state = {};
        state[e.target.name] = e.target.value.trim();
        this.setState(state);
    }

    doCreateGame(e) {
        e.preventDefault();
        var token = localStorage.getItem('token');
        if (token != null) {
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
                    'game_id': this.state.game_id,
                    "count": this.state.count,
                }),
                beforeSend: function () {
                    this.setState({loading: true})
                }.bind(this)
            }).then(function (payload) {
                if (payload.hasOwnProperty('error')) {
                    this.setState({regErrors: payload.error, loading: false});
                } else {
                    this.props.updateKey();
                    this.setState({regErrors: null, loading: false});
                }
            }.bind(this), function (err) {
                console.log(err.responseText);
                this.setState({loading: false})
            });
        }
    }

    render() {
        var e = "";
        var allGames = [];

        var errors = {};
        if (this.state.regErrors != null) {
            e = <div className="row">
                <div className="col-md-4 col-md-offset-4 well well-danger">There were errors with your input:</div>
            </div>;
            if (this.state.regErrors != null) {
                if (this.state.regErrors.hasOwnProperty('game_id'))
                    errors.game_id = <div className="col-md-3 text-danger">{this.state.regErrors.game_id}</div>;
                if (this.state.regErrors.hasOwnProperty('count'))
                    errors.count = <div className="col-md-3 text-danger">{this.state.regErrors.count}</div>;
            }
        }

        this.state.games.forEach(function (game) {
            allGames.push(<option key={game.id} value={game.id}>{game.name}</option>);
        });

        return (
            <div className="panel panel-primary">
                <div className="panel-heading">
                    <h2>Add a Game</h2>
                </div>
                <div className="panel-body">
                    <div className="container">
                        {e}
                        <div className="row">
                            <form onSubmit={this.doCreateGame.bind(this)} className="form-horizontal">
                                <fieldset>
                                    <div className={"form-group" + (errors.game_id ? " has-error" : "")}>
                                        <label className="col-md-4 control-label" htmlFor="textinput">Game</label>
                                        <div className="col-md-4">
                                            <select id="textinput" name="game_id"
                                                    className="form-control input-md dark-textbox" required=""
                                                    type="text"
                                                    onChange={this.onChange.bind(this)}>
                                                <option>Select a game</option>
                                                {allGames}
                                            </select>
                                        </div>
                                        {errors.game_id}
                                    </div>

                                    <div className={"form-group" + (errors.count ? " has-error" : "")}>
                                        <label className="col-md-4 control-label" htmlFor="textinput">Inventory
                                            Count</label>
                                        <div className="col-md-4">
                                            <input id="textinput" name="count" placeholder="Number"
                                                   className="form-control input-md dark-textbox" required=""
                                                   type="text"
                                                   onChange={this.onChange.bind(this)}/>
                                            <span className="help-block"> </span>
                                        </div>
                                        {errors.count}
                                    </div>

                                    <div className="form-group">
                                        <label className="col-md-4 control-label" htmlFor="singlebutton"> </label>
                                        <div className="col-md-4">
                                            <button id="singlebutton" name="singlebutton" disabled={this.state.loading}
                                                    className="btn btn-block btn-primary">Update Inventory<SpinnerText
                                                loading={this.state.loading}/>
                                            </button>
                                        </div>
                                    </div>
                                </fieldset>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
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
            <div className="panel panel-primary">
                <div className="panel-heading">
                    <h2>Inventory</h2>
                </div>
                <div className="panel-body">
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
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

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
                beforeSend: function () {
                    this.setState({loading: true})
                }.bind(this)
            }).then(function (payload) {
                this.props.onChange(payload.inventory.count);
            }.bind(this), function (err) {
                console.log(err.responseText);
            });
            this.setState({loading: false})
        }
    }

    render() {
        var icon = <SpinnerText loading={true}/>
        if (this.props.type == 'sub') {
            if (!this.state.loading)
                icon = <i className="fa fa-minus"/>;
            return (
                <button className="btn-danger btn-xs floatright"
                        onClick={this.onClick.bind(this, "sub")}>{icon}</button>
            )
        }

        if (!this.state.loading)
            icon = <i className="fa fa-plus"/>;
        return (
            <button className="btn-success btn-xs floatright" onClick={this.onClick.bind(this, "add")}>{icon}</button>
        )
    }
}

export default OrgAdminPage