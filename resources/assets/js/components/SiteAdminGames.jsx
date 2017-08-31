import React, {Component} from 'react';
import {updateTitleAndSubtitle, updateOrgNames} from '../actions/index';
import {Link} from 'react-router-dom'
import Datatable from 'react-bs-datatable';
import {isInt} from '../utils/helpers';
import SpinnerText from './SpinnerText';
import {xmlToJson, stripTags} from '../utils/helpers';
import store from '../store';
import {updateModal} from '../actions/index';

import {constants} from '../constants'

class SiteAdminGames extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orgId: 0,
            key: 0,
            gameId: null
        };
    }


    // rerender inventory on added game
    updateKey() {
        this.setState({key: this.state.key + 1});
    }

    updateGameId(id) {
        this.setState({gameId: id})
    }

    render() {
        if (this.props.user == null) {
            store.dispatch(updateTitleAndSubtitle("", ''));
            return (
                <p>Please login to view your organization's admin panel</p>
            );
        } else if (!this.props.user.is_admin) {
            store.dispatch(updateTitleAndSubtitle("", ''));
            return (
                <p>Access Denied</p>
            );
        }

        return (
            <div>
                <AddGame updateKey={this.updateKey.bind(this)} gameId={this.state.gameId}/>
                <GameList key={this.state.key} updateGameId={this.updateGameId.bind(this)}/>
            </div>
        );
    };
}

class AddGame extends Component {

    constructor(props) {
        super(props);
        this.state = {
            games: [],
            publishers: [],
            gameTypes: [],
            gameCategories: [],
            loading: false,
            regErrors: null,
            name: "",
            description: "",
            url: "",
            min_players: "",
            max_players: "",
            min_age: "",
            max_playtime_box: "",
            max_playtime_actual: "",
            year_published: "",
            bgg_id: "",
            footprint_width_inches: "",
            footprint_length_inches: "",
            footprint_height_inches: "",
            game_type_id: "",
            publisher_id: "",
            game_category_id: "",
            importLoading: false,
            gameId: null,
        };
    }

    cleanGameFromState() {
        return {
            loading: false,
            regErrors: null,
            name: "",
            description: "",
            url: "",
            min_players: "",
            max_players: "",
            min_age: "",
            max_playtime_box: "",
            max_playtime_actual: "",
            year_published: "",
            bgg_id: "",
            footprint_width_inches: "",
            footprint_length_inches: "",
            footprint_height_inches: "",
            game_type_id: "",
            publisher_id: "",
            game_category_id: "",
            importLoading: false,
            gameId: null,
        };
    }

    componentWillReceiveProps(newProps) {
        if (this.state.gameId != newProps.gameId) {
            $.ajax({
                url: constants.API_HOST + "/game/" + newProps.gameId,
                contentType: "application/json",
                cache: false,
                type: "GET",
            }).then(function (payload) {
                if (payload.hasOwnProperty('game')) {
                    this.setState(payload.game);
                }
            }.bind(this), function (err) {
                console.log(err.responseText);
            });
            this.setState({gameId: newProps.gameId});
        }
    }

    componentWillMount() {
        $.ajax({
            url: constants.API_HOST + "/publishers",
            contentType: "application/json",
            cache: false,
            type: "GET",
        }).then(function (payload) {
            this.setState({publishers: payload.publishers});
        }.bind(this), function (err) {
            console.log(err.responseText);
        });

        $.ajax({
            url: constants.API_HOST + "/gamecats",
            contentType: "application/json",
            cache: false,
            type: "GET",
        }).then(function (payload) {
            this.setState({gameCategories: payload.game_categories});
        }.bind(this), function (err) {
            console.log(err.responseText);
        });

        $.ajax({
            url: constants.API_HOST + "/gametypes",
            contentType: "application/json",
            cache: false,
            type: "GET",
        }).then(function (payload) {
            this.setState({gameTypes: payload.game_types});
        }.bind(this), function (err) {
            console.log(err.responseText);
        });

    }

    bggImport(e) {
        e.preventDefault();
        // get name and description
        $.ajax({
            url: constants.BGG_API_HOST + "/boardgame/" + this.state.bgg_id,
            contentType: "text",
            cache: false,
            type: "GET",
            beforeSend: function () {
                this.setState({importLoading: true})
            }.bind(this)
        }).then(function (payload) {
            var mainName = "";
            var names = payload.getElementsByTagName('name');
            for(var x = 0; x < names.length; x++){
                if (names[x].getAttribute('primary') == 'true'){
                    mainName = names[x].innerHTML;
                }
            }
            var jsonPayload = xmlToJson(payload).boardgames.boardgame;
            this.setState({importLoading: false});
            if (jsonPayload.hasOwnProperty('error')) {
                store.dispatch(updateModal({
                    body: 'There was no match at BoardGameGeek.com for the ID you entered.',
                    title: 'Not Found', open: true, style: ''
                }));
            } else {
                var newState = [];
                console.log(jsonPayload);
                if (jsonPayload.hasOwnProperty('description'))
                    newState.description = stripTags(jsonPayload.description.replace(/<br\/>/g, "\n"));
                if (jsonPayload.hasOwnProperty('yearpublished'))
                    newState.year_published = jsonPayload.yearpublished;
                if (jsonPayload.hasOwnProperty('minplayers'))
                    newState.min_players = jsonPayload.minplayers;
                if (jsonPayload.hasOwnProperty('maxplayers'))
                    newState.max_players = jsonPayload.maxplayers;
                if (jsonPayload.hasOwnProperty('playingtime'))
                    newState.max_playtime_box = jsonPayload.playingtime;
                if (jsonPayload.hasOwnProperty('age'))
                    newState.min_age = jsonPayload.age;
                if (jsonPayload.hasOwnProperty('name')){
                    if(mainName)
                        newState.name = mainName;
                    else
                        newState.name = jsonPayload.name;
                }

                this.setState(newState);
            }
        }.bind(this), function (err) {
            console.log("error: " + err);
            store.dispatch(updateModal({
                body: 'There was no match at BoardGameGeek.com for the ID you entered.',
                title: 'Not Found', open: true, style: ''
            }));
        });

    }

    onChange(e) {
        var state = {};
        state[e.target.name] = e.target.value;
        this.setState(state);
    }

    doCreateGame(e) {
        e.preventDefault();
        var token = localStorage.getItem('token');
        if (token != null) {
            var uri = "/game", method = "POST"; // create
            if (this.state.gameId != null) { // update
                uri = "/game/" + this.state.gameId;
                method = "PUT"
            }
            $.ajax({
                url: constants.API_HOST + uri,
                contentType: "application/json",
                cache: false,
                type: method,
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                data: JSON.stringify(this.sanitizeFields()),
                beforeSend: function () {
                    this.setState({loading: true})
                }.bind(this)
            }).then(function (payload) {
                if (payload.hasOwnProperty('error')) {
                    this.setState({regErrors: payload.error, loading: false});
                    window.scrollTo(0, 0);
                } else {
                    this.props.updateKey();
                    this.setState(this.cleanGameFromState());
                }
            }.bind(this), function (err) {
                console.log(err.responseText);
                this.setState({loading: false})
            });
        }
    }

    sanitizeFields() {
        var fields = {};
        if (this.state.name != "" && this.state.name != null)
            fields.name = this.state.name;
        if (this.state.description != "" && this.state.description != null)
            fields.description = this.state.description;
        if (this.state.url != "" && this.state.url != null)
            fields.url = this.state.url;
        if (this.state.min_players != "" && this.state.min_players != null)
            fields.min_players = this.state.min_players;
        if (this.state.max_players != "" && this.state.max_players != null)
            fields.max_players = this.state.max_players;
        if (this.state.min_age != "" && this.state.min_age != null)
            fields.min_age = this.state.min_age;
        if (this.state.max_playtime_box != "" && this.state.max_playtime_box != null)
            fields.max_playtime_box = this.state.max_playtime_box;
        if (this.state.max_playtime_actual != "" && this.state.max_playtime_actual != null)
            fields.max_playtime_actual = this.state.max_playtime_actual;
        if (this.state.year_published != "" && this.state.year_published != null)
            fields.year_published = this.state.year_published;
        if (this.state.bgg_id != "" && this.state.bgg_id != null)
            fields.bgg_id = this.state.bgg_id;
        if (this.state.footprint_width_inches != "" && this.state.footprint_width_inches != null)
            fields.footprint_width_inches = this.state.footprint_width_inches;
        if (this.state.footprint_length_inches != "" && this.state.footprint_length_inches != null)
            fields.footprint_length_inches = this.state.footprint_length_inches;
        if (this.state.footprint_height_inches != "" && this.state.footprint_height_inches != null)
            fields.footprint_height_inches = this.state.footprint_height_inches;
        if (this.state.game_type_id != "" && this.state.game_type_id != null)
            fields.game_type_id = this.state.game_type_id;
        if (this.state.publisher_id != "" && this.state.publisher_id != null)
            fields.publisher_id = this.state.publisher_id;
        if (this.state.game_category_id != "" && this.state.game_category_id != null)
            fields.game_category_id = this.state.game_category_id;
        if (this.props.gameId != null && this.props.gameId > 0)
            fields.gameId = this.props.gameId;
        return fields;
    }

    render() {
        var e = "";
        var allPubs = [], allTypes = [], allCats = [];

        var errors = {};
        if (this.state.regErrors != null) {
            e = <div className="row">
                <div className="col-md-4 col-md-offset-4 well well-danger">There were errors with your input:</div>
            </div>;
            // this is probably not the most concise way to do this...
            if (this.state.regErrors != null) {
                if (this.state.regErrors.hasOwnProperty('name'))
                    errors.name = <div className="col-md-3 text-danger">{this.state.regErrors.name}</div>;
                if (this.state.regErrors.hasOwnProperty('description'))
                    errors.description = <div className="col-md-3 text-danger">{this.state.regErrors.description}</div>;
                if (this.state.regErrors.hasOwnProperty('url'))
                    errors.url = <div className="col-md-3 text-danger">{this.state.regErrors.url}</div>;
                if (this.state.regErrors.hasOwnProperty('min_players'))
                    errors.min_players = <div className="col-md-3 text-danger">{this.state.regErrors.min_players}</div>;
                if (this.state.regErrors.hasOwnProperty('max_players'))
                    errors.max_players = <div className="col-md-3 text-danger">{this.state.regErrors.max_players}</div>;
                if (this.state.regErrors.hasOwnProperty('min_age'))
                    errors.min_age = <div className="col-md-3 text-danger">{this.state.regErrors.min_age}</div>;
                if (this.state.regErrors.hasOwnProperty('max_playtime_box'))
                    errors.max_playtime_box =
                        <div className="col-md-3 text-danger">{this.state.regErrors.max_playtime_box}</div>;
                if (this.state.regErrors.hasOwnProperty('max_playtime_actual'))
                    errors.max_playtime_actual =
                        <div className="col-md-3 text-danger">{this.state.regErrors.max_playtime_actual}</div>;
                if (this.state.regErrors.hasOwnProperty('year_published'))
                    errors.year_published =
                        <div className="col-md-3 text-danger">{this.state.regErrors.year_published}</div>;
                if (this.state.regErrors.hasOwnProperty('bgg_id'))
                    errors.bgg_id = <div className="col-md-3 text-danger">{this.state.regErrors.bgg_id}</div>;
                if (this.state.regErrors.hasOwnProperty('footprint_width_inches'))
                    errors.footprint_width_inches =
                        <div className="col-md-3 text-danger">{this.state.regErrors.footprint_width_inches}</div>;
                if (this.state.regErrors.hasOwnProperty('footprint_length_inches'))
                    errors.footprint_length_inches =
                        <div className="col-md-3 text-danger">{this.state.regErrors.footprint_length_inches}</div>;
                if (this.state.regErrors.hasOwnProperty('footprint_height_inches'))
                    errors.footprint_height_inches =
                        <div className="col-md-3 text-danger">{this.state.regErrors.footprint_height_inches}</div>;
                if (this.state.regErrors.hasOwnProperty('game_type_id'))
                    errors.game_type_id =
                        <div className="col-md-3 text-danger">{this.state.regErrors.game_type_id}</div>;
                if (this.state.regErrors.hasOwnProperty('publisher_id'))
                    errors.publisher_id =
                        <div className="col-md-3 text-danger">{this.state.regErrors.publisher_id}</div>;
                if (this.state.regErrors.hasOwnProperty('game_category_id'))
                    errors.game_category_id =
                        <div className="col-md-3 text-danger">{this.state.regErrors.game_category_id}</div>;
            }
        }

        var importText = "Import";
        if (this.state.importLoading)
            importText = <SpinnerText loading={true}/>;

        this.state.publishers.forEach(function (i) {
            allPubs.push(<option key={i.id} value={i.id}>{i.name}</option>);
        });
        this.state.gameTypes.forEach(function (i) {
            allTypes.push(<option key={i.id} value={i.id}>{i.name}</option>);
        });
        this.state.gameCategories.forEach(function (i) {
            allCats.push(<option key={i.id} value={i.id}>{i.name}</option>);
        });

        return (
            <div className="panel panel-primary">
                <div className="panel-heading">
                    <h2>{this.state.gameId ? 'Edit Game' : "Add a Game"}</h2>
                </div>
                <div className="panel-body">
                    <div className="container">
                        {e}
                        <div className="row">
                            <form className="form-horizontal">
                                <fieldset>

                                    <div className={"form-group" + (errors.bgg_id ? " has-error" : "")}>
                                        <label className="col-md-4 control-label" htmlFor="textinput">BoardGameGeek
                                            ID</label>
                                        <div className="col-md-3">
                                            <input id="textinput" name="bgg_id"
                                                   className="form-control input-md dark-textbox" required=""
                                                   type="text" value={this.state.bgg_id}
                                                   onChange={this.onChange.bind(this)}/>
                                            <span className="help-block"> </span>
                                        </div>
                                        <div className="col-md-1">
                                            <button className="btn btn-block btn-sm btn-success"
                                                    onClick={this.bggImport.bind(this)}>{importText}</button>
                                        </div>
                                        {errors.bgg_id}
                                    </div>

                                    <div className={"form-group" + (errors.name ? " has-error" : "")}>
                                        <label className="col-md-4 control-label" htmlFor="textinput">Name*</label>
                                        <div className="col-md-4">
                                            <input id="textinput" name="name"
                                                   className="form-control input-md dark-textbox" required=""
                                                   type="text" value={this.state.name}
                                                   onChange={this.onChange.bind(this)}/>
                                            <span className="help-block"> </span>
                                        </div>
                                        {errors.name}
                                    </div>

                                    <div className={"form-group" + (errors.description ? " has-error" : "")}>
                                        <label className="col-md-4 control-label"
                                               htmlFor="textinput">Description*</label>
                                        <div className="col-md-4">
                                            <textarea id="textinput" name="description"
                                                      className="form-control input-md dark-textbox"
                                                      type="text" rows="7" value={this.state.description}
                                                      onChange={this.onChange.bind(this)}/>
                                            <span className="help-block"> </span>
                                        </div>
                                        {errors.description}
                                    </div>

                                    <div className={"form-group" + (errors.url ? " has-error" : "")}>
                                        <label className="col-md-4 control-label" htmlFor="textinput">URL</label>
                                        <div className="col-md-4">
                                            <input id="textinput" name="url"
                                                   className="form-control input-md dark-textbox" required=""
                                                   type="text"
                                                   value={this.state.url}
                                                   onChange={this.onChange.bind(this)}/>
                                            <span className="help-block"> </span>
                                        </div>
                                        {errors.url}
                                    </div>

                                    <div className={"form-group" + (errors.min_players ? " has-error" : "")}>
                                        <label className="col-md-4 control-label" htmlFor="textinput">Minimum
                                            Players*</label>
                                        <div className="col-md-4">
                                            <input id="textinput" name="min_players"
                                                   className="form-control input-md dark-textbox" required=""
                                                   type="text" value={this.state.min_players}
                                                   onChange={this.onChange.bind(this)}/>
                                            <span className="help-block"> </span>
                                        </div>
                                        {errors.min_players}
                                    </div>

                                    <div className={"form-group" + (errors.max_players ? " has-error" : "")}>
                                        <label className="col-md-4 control-label" htmlFor="textinput">Maximum
                                            Players*</label>
                                        <div className="col-md-4">
                                            <input id="textinput" name="max_players"
                                                   className="form-control input-md dark-textbox" required=""
                                                   type="text"
                                                   value={this.state.max_players}
                                                   onChange={this.onChange.bind(this)}/>
                                            <span className="help-block"> </span>
                                        </div>
                                        {errors.max_players}
                                    </div>

                                    <div className={"form-group" + (errors.min_age ? " has-error" : "")}>
                                        <label className="col-md-4 control-label" htmlFor="textinput">Minimum
                                            Age</label>
                                        <div className="col-md-4">
                                            <input id="textinput" name="min_age"
                                                   className="form-control input-md dark-textbox" required=""
                                                   type="text"
                                                   value={this.state.min_age}
                                                   onChange={this.onChange.bind(this)}/>
                                            <span className="help-block"> </span>
                                        </div>
                                        {errors.min_age}
                                    </div>

                                    <div className={"form-group" + (errors.max_playtime_box ? " has-error" : "")}>
                                        <label className="col-md-4 control-label" htmlFor="textinput">Max Playtime
                                            (box)</label>
                                        <div className="col-md-4">
                                            <input id="textinput" name="max_playtime_box"
                                                   className="form-control input-md dark-textbox" required=""
                                                   type="text"
                                                   value={this.state.max_playtime_box}
                                                   onChange={this.onChange.bind(this)}/>
                                            <span className="help-block"> </span>
                                        </div>
                                        {errors.max_playtime_box}
                                    </div>

                                    <div className={"form-group" + (errors.max_playtime_actual ? " has-error" : "")}>
                                        <label className="col-md-4 control-label" htmlFor="textinput">Max Playtime
                                            (actual)</label>
                                        <div className="col-md-4">
                                            <input id="textinput" name="max_playtime_actual"
                                                   className="form-control input-md dark-textbox" required=""
                                                   type="text"
                                                   value={this.state.max_playtime_actual}
                                                   onChange={this.onChange.bind(this)}/>
                                            <span className="help-block"> </span>
                                        </div>
                                        {errors.max_playtime_actual}
                                    </div>

                                    <div className={"form-group" + (errors.year_published ? " has-error" : "")}>
                                        <label className="col-md-4 control-label" htmlFor="textinput">Year
                                            Published</label>
                                        <div className="col-md-4">
                                            <input id="textinput" name="year_published"
                                                   className="form-control input-md dark-textbox" required=""
                                                   type="text"
                                                   value={this.state.year_published}
                                                   onChange={this.onChange.bind(this)}/>
                                            <span className="help-block"> </span>
                                        </div>
                                        {errors.year_published}
                                    </div>

                                    <div className={"form-group" + (errors.footprint_width_inches ? " has-error" : "")}>
                                        <label className="col-md-4 control-label" htmlFor="textinput">Width
                                            (inches)</label>
                                        <div className="col-md-4">
                                            <input id="textinput" name="footprint_width_inches"
                                                   className="form-control input-md dark-textbox" required=""
                                                   type="text"
                                                   value={this.state.footprint_width_inches}
                                                   onChange={this.onChange.bind(this)}/>
                                            <span className="help-block"> </span>
                                        </div>
                                        {errors.footprint_width_inches}
                                    </div>

                                    <div
                                        className={"form-group" + (errors.footprint_length_inches ? " has-error" : "")}>
                                        <label className="col-md-4 control-label" htmlFor="textinput">Length
                                            (inches)</label>
                                        <div className="col-md-4">
                                            <input id="textinput" name="footprint_length_inches"
                                                   className="form-control input-md dark-textbox" required=""
                                                   type="text"
                                                   value={this.state.footprint_length_inches}
                                                   onChange={this.onChange.bind(this)}/>
                                            <span className="help-block"> </span>
                                        </div>
                                        {errors.footprint_length_inches}
                                    </div>

                                    <div
                                        className={"form-group" + (errors.footprint_height_inches ? " has-error" : "")}>
                                        <label className="col-md-4 control-label" htmlFor="textinput">Height
                                            (inches)</label>
                                        <div className="col-md-4">
                                            <input id="textinput" name="footprint_height_inches"
                                                   className="form-control input-md dark-textbox" required=""
                                                   type="text"
                                                   value={this.state.footprint_height_inches}
                                                   onChange={this.onChange.bind(this)}/>
                                            <span className="help-block"> </span>
                                        </div>
                                        {errors.footprint_height_inches}
                                    </div>


                                    <div className={"form-group" + (errors.game_type_id ? " has-error" : "")}>
                                        <label className="col-md-4 control-label" htmlFor="textinput">Game Type</label>
                                        <div className="col-md-4">
                                            <select id="textinput" name="game_type_id"
                                                    className="form-control input-md dark-textbox" required=""
                                                    type="text" value={this.state.game_type_id}
                                                    onChange={this.onChange.bind(this)}>
                                                <option>Select a game type</option>
                                                {allTypes}
                                            </select>
                                        </div>
                                        {errors.game_type_id}
                                    </div>
                                    <div className={"form-group" + (errors.game_category_id ? " has-error" : "")}>
                                        <label className="col-md-4 control-label" htmlFor="textinput">Game
                                            Category</label>
                                        <div className="col-md-4">
                                            <select id="textinput" name="game_category_id"
                                                    className="form-control input-md dark-textbox" required=""
                                                    type="text" value={this.state.game_category_id}
                                                    onChange={this.onChange.bind(this)}>
                                                <option>Select a game category</option>
                                                {allCats}
                                            </select>
                                        </div>
                                        {errors.game_category_id}
                                    </div>
                                    <div className={"form-group" + (errors.publisher_id ? " has-error" : "")}>
                                        <label className="col-md-4 control-label" htmlFor="textinput">Publisher</label>
                                        <div className="col-md-4">
                                            <select id="textinput" name="publisher_id"
                                                    className="form-control input-md dark-textbox" required=""
                                                    type="text" value={this.state.publisher_id}
                                                    onChange={this.onChange.bind(this)}>
                                                <option>Select a publisher</option>
                                                {allPubs}
                                            </select>
                                        </div>
                                        {errors.publisher_id}
                                    </div>


                                    <div className="form-group">
                                        <label className="col-md-4 control-label" htmlFor="singlebutton"> </label>
                                        <div className="col-md-4">
                                            <button id="singlebutton" name="singlebutton" disabled={this.state.loading}
                                                    onClick={this.doCreateGame.bind(this)}
                                                    className="btn btn-block btn-primary">{this.state.gameId ? "Update Game" : "Add a Game"}
                                                    <SpinnerText loading={this.state.loading}/>
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
            {title: 'Delete', prop: 'delete', sortable: false, filterable: true},
        ];

        var gameRows = [];
        this.state.games.forEach(function (game) {
            gameRows.push({
                name: <a href="#" onClick={this.props.updateGameId.bind(this, game.id)}>{game.name}</a>,
                publisher: game.publisher != null ? game.publisher.name : "",
                delete: <DeleteButton gameId={game.id}/>
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

class DeleteButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            deleted: false
        };
    }

    onClick() {
        var token = localStorage.getItem('token');
        if (token != null) {

            $.ajax({
                url: constants.API_HOST + "/game/" + this.props.gameId,
                contentType: "application/json",
                cache: false,
                type: "DELETE",
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                beforeSend: function () {
                    this.setState({loading: true})
                }.bind(this)
            }).then(function (payload) {
                this.setState({loading: false, deleted: true})
            }.bind(this), function (err) {
                console.log(err.responseText);
                this.setState({loading: false})
            });
        }
    }

    onClickUndelete() {
        var token = localStorage.getItem('token');
        if (token != null) {

            $.ajax({
                url: constants.API_HOST + "/game/" + this.props.gameId + "/undelete",
                contentType: "application/json",
                cache: false,
                type: "POST",
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                beforeSend: function () {
                    this.setState({loading: true})
                }.bind(this)
            }).then(function (payload) {
                this.setState({loading: false, deleted: false})
            }.bind(this), function (err) {
                console.log(err.responseText);
                this.setState({loading: false})
            });
        }
    }

    render() {
        var icon = <SpinnerText loading={true}/>;

        if (this.state.deleted) {
            if (!this.state.loading)
                icon = "";
            return (
                <span>
                        <span className="label label-danger">DELETED</span>
                        <button
                            className="btn-success btn-xs floatright"
                            onClick={this.onClickUndelete.bind(this)}>Undo {icon}</button>
                    </span>
            );
        } else {
            if (!this.state.loading)
                icon = <i className="fa fa-times"/>;
            return (
                <button className="btn-danger btn-xs floatright" onClick={this.onClick.bind(this)}>{icon}</button>
            );
        }
    }
}

export default SiteAdminGames