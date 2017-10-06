import React, {Component} from 'react';
import store from '../store';
import {Link} from 'react-router-dom'
import Datatable from 'react-bs-datatable';
import SpinnerText from './SpinnerText';

import {constants} from '../constants'

class OrgGameList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            games: [],
            orgId: props.orgId
        };
    }

    componentWillMount() {
        $.ajax({
            url: constants.API_HOST + "/games/" + this.state.orgId,
            contentType: "application/json",
            cache: false,
            type: "GET",
        }).then(function (payload) {
            this.setState({games: payload.games});
            store.dispatch(updateTitleAndSubtitle(<Link to={"/o/" + payload.organization.short_name}>{payload.organization.name}</Link>, "Library List"));
            console.log(payload.games);
        }.bind(this), function (err) {
            console.log(err.responseText);
        });

    }

    render() {
        return (
            <GamesList games={this.state.games} />
        );
    };
}

class GamesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            games: [],
        };
    }
    render() {
        var header = [
            {title: 'Game', prop: 'name', sortable: true, filterable: true},
            {title: 'Min Players', prop: 'min_players', sortable: false, filterable: true},
            {title: 'Max Players', prop: 'max_players', sortable: false, filterable: true},
            {title: 'Estimated Playtime', prop: 'max_playtime_box', sortable: false, filterable: true}
        ];

        var gameRows = [];

        this.props.games.forEach(function (game) {
            var bggLink = constants.BGG_SITE_GAME_LINK + game.game.bgg_id;
            gameRows.push({
                name: game.game.name != null ? <a href={bggLink}>{game.game.name}</a> : "",
                min_players: game.game.min_players != null ? game.game.min_players: "",
                max_players: game.game.max_players != null ? game.game.max_players: "",
                max_playtime_box: game.game.max_playtime_box != null ? game.game.max_playtime_box + " mins": ""
            });
        }.bind(this));
        console.log(gameRows);
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">
                    <h2>Game Library</h2>
                </div>
                <div className="panel-body">
                    <Datatable
                        tableHeader={header}
                        tableBody={gameRows}
                        keyName="gameTable"
                        tableClass="table table-striped table-warning table-hover responsive"
                        rowsPerPage={50}
                        rowsPerPageOption={[5, 10, 20, 50, 100]}
                        initialSort={{prop: "game", isAscending: true}}
                    />
                </div>
            </div>
        );
    }
}

export default OrgGameList