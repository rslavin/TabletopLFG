import React, {Component} from 'react';
import store from '../store';
import {updateTitleAndSubtitle, updateOrgNames} from '../actions/index';
import {Link} from 'react-router-dom'
import Datatable from 'react-bs-datatable';
import {isInt} from '../utils/helpers';
import SpinnerText from './SpinnerText';

import {constants} from '../constants'

class SiteAdminGames extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orgId: 0,
            key: 0
        };
    }


    // rerender inventory on added game
    updateKey() {
        this.setState({key: this.state.key + 1});
    }

    render() {
        if (this.props.user == null) {
            store.dispatch(updateTitleAndSubtitle("", ''));
            return (
                <p>Please login to view your organization's admin panel</p>
            );
        }else if(!this.props.user.is_admin){
            store.dispatch(updateTitleAndSubtitle("", ''));
            return (
                <p>Access Denied</p>
            );
        }

        return (
            <div>
                <AddGame updateKey={this.updateKey.bind(this)}/>
                <GameList key={this.state.key}/>
            </div>
        );
    };
}

class AddPublisher extends Component {

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

class AddGame extends Component {

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

class GameList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            games: [],
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

    render() {
        var header = [
            {title: 'Game', prop: 'name', sortable: true, filterable: true},
            {title: 'Publisher', prop: 'publisher', sortable: true, filterable: true},
        ];

        var gameRows = [];
        this.state.games.forEach(function (game) {
            gameRows.push({
                name: <Link to={"/game/" + game.id}>{game.name}</Link>,
                publisher: game.publisher.name,
            });
        }.bind(this));
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">
                    <h2>Site Library</h2>
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

export default SiteAdminGames