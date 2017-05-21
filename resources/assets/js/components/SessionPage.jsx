import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ReactDOM, {render} from 'react-dom';
import {relativeDate, xmlToJson} from '../utils/helpers';
import {constants} from '../constants';
import store from '../store';
import {updateTitleAndSubtitle} from '../actions/index';
import Spinner from './Spinner';
import NotFound from './NotFound';
import GameImage from './GameImage';
import SignupButton from './SignupButton';

var moment = require('moment');

class SessionPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            session: null,
            isSignedUp: false,
        };
    }

    componentWillReceiveProps(newProps) {
        this.checkIfSignedUp(newProps.username);
    }

    componentDidMount() {
        // fade in
        var elem = ReactDOM.findDOMNode(this)
        elem.style.opacity = 0;
        window.requestAnimationFrame(function () {
            elem.style.transition = "opacity 550ms";
            elem.style.opacity = 1;
        });
    }

    checkIfSignedUp(username, users = null) {
        if (users == null && this.state.session != null)
            users = this.state.session.users;
        if (users != null && username != null) {
            // toggle isInUsers if not aligned with users
            var isInUsers = false;
            users.forEach(function (user) {
                if (user.username == username) {
                    isInUsers = true;
                }
            }.bind(this));
            if(this.state.isSignedUp != isInUsers)
                this.setState({isSignedUp: !this.state.isSignedUp})
        }
        if (username == null && this.state.isSignedUp == true)
            this.setState({isSignedUp: false});
    };

    componentWillMount() {
        this.getSession();
    }

    getSession() {
        $.ajax({
            url: constants.API_HOST + "/session/" + this.props.match.params.sessionID,
            contentType: "application/json",
            cache: false,
            type: "GET",
        }).then(function (payload) {
            this.setState({session: payload.game_session, loading: false});
            store.dispatch(updateTitleAndSubtitle("", ""));
            this.checkIfSignedUp(this.props.username, payload.game_session.users);
        }.bind(this), function (err) {
            // no results
            console.log(err.responseText);
            this.setState({loading: false});
        }.bind(this));
    }

    render() {
        if (this.state.loading) {
            return (<Spinner />);
        }

        if (this.state.session == null)
            return (<NotFound/>);

        var openSlots = this.state.session.game.max_players - this.state.session.users.length;

        var slotsClass = "text-danger";
        var userLabel = <span className="label label-danger">Full</span>;
        if (openSlots == 1) {
            slotsClass = "text-warning";
            userLabel = <span className="label label-warning">Almost Full</span>;
        } else if (openSlots > 1) {
            slotsClass = "text-success";
            userLabel = <span className="label label-success">Open</span>;
        }

        if (this.state.isSignedUp) {
            userLabel = <span>{userLabel} <p className="label label-success">
                <i className="fa fa-check"/> Signed Up </p></span>;
        }

        var wellClass = "panel";
        var alertBox = "";
        if (this.state.session.sponsor_note != null) {
            wellClass = wellClass + " panel-info";
            alertBox =
                <div className="alert alert-warning"><h4>Sponsored Event!</h4><p>{this.state.session.sponsor_note}</p>
                </div>;
        } else {
            wellClass = wellClass + " panel-primary"
        }


        return (
            <div className="col-md-12 col-lg-12">
                {alertBox}
                <div className={wellClass}>
                    <div className="panel-heading session-box-heading">
                        <h4>{this.state.session.title} {userLabel}</h4>
                    </div>

                    <div className="panel-body session-box-description">
                        <div className="row">
                            <div className="col-md-12 col-lg-12">
                                <h4>
                                    <strong>Description:</strong> {this.state.session.note}
                                </h4>
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-md-4 col-lg-4">
                                <h4>Session Details</h4>
                                <div className="session-box-details">
                                    <p>
                                        <i className="fa fa-calendar"/>
                                        &nbsp;
                                        Start: {moment(this.state.session.start_time).format("dddd, MMMM Do YYYY, h:mm A")}
                                    </p>
                                    <p>
                                        <i className="fa fa-calendar"/>
                                        &nbsp;
                                        End: {moment(this.state.session.end_time).format("dddd, MMMM Do YYYY, h:mm A")}
                                    </p>
                                    <p className="session-box-details">
                                        <i className="fa fa-group"/> Players:
                                        <span className={slotsClass}>
                            &nbsp;{this.state.session.users.length}/{this.state.session.game.max_players}
                            </span>
                                    </p>

                                    <UserList session={this.state.session} username={this.props.username}
                                              openSlots={openSlots}
                                              isSignedUp={this.state.isSignedUp}
                                              getSession={this.getSession.bind(this)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-8 col-lg-8">
                                <GameDetails id={this.state.session.game.id}/>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        )
    };
}

class UserList extends Component {

    render() {
        var playerList = [];
        for (var i = 0; i < this.props.session.game.max_players; i++) {
            if (this.props.session.users.length > i) {
                var player = this.props.session.users[i];
                if (player.username == this.props.username) {
                    playerList.push(<span key={i} className="text-white"><i
                        className="fa fa-check-square-o"/><strong> {player.username} (you)</strong>&nbsp;
                        <SignupButton username={this.props.username} signedUp={true}
                                      style="link"
                                      openSlots={this.props.openSlots} session={this.props.session}
                                      parentSignUp={this.props.getSession.bind(this)} parentLeave={this.props.getSession.bind(this)}/>
                        <br /></span>);
                } else
                    playerList.push(<span key={i}><i className="fa fa-check-square-o"/> {player.username}<br /></span>);
            } else if (this.props.username != null && !this.props.isSignedUp) {
                playerList.push(<span key={i}><i className="fa fa-square-o"/>&nbsp;
                    <SignupButton
                        username={this.props.username} signedUp={false}
                        style="link"
                        openSlots={this.props.openSlots} session={this.props.session}
                        parentSignUp={this.props.getSession.bind(this)} parentLeave={this.props.getSession.bind(this)}/><br /></span>);
            } else if (this.props.username)
                playerList.push(<span key={i}><i className="fa fa-square-o"/><span className="text-warning"> Looking for more</span><br /></span>);
            else
                playerList.push(<span key={i}><i className="fa fa-square-o"/><span className="text-warning"> Login to sign up</span><br /></span>);
        }
        return (
            <div className="player-list">
                {playerList}
            </div>
        )
    }
}

class GameDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game: [],
        };
    }

    componentWillMount() {
        $.ajax({
            url: constants.API_HOST + "/game/" + this.props.id,
            contentType: "application/json",
            cache: false,
            type: "GET",
        }).then(function (payload) {
            this.setState({game: payload.game});
        }.bind(this), function (err) {
            // no results
            console.log(err.responseText);
        }.bind(this));
    }

    render() {
        if (this.state.game.length != 0) {
            var name = "";
            if (this.state.game.url != null)
                name = <a target="blank" href={this.state.game.url}>{this.state.game.name}</a>;
            var publisher = "";
            if (this.state.game.publisher.url != null)
                publisher = <a target="blank" href={this.state.game.publisher.url}>{this.state.game.publisher.name}</a>;
            return (<div>
                    <h4>Game Details</h4>
                    <div className="session-box-details">
                        <div className="row">
                            <div className="col-md-8 col-lg-8">
                                <p>
                                    <strong>Title:</strong> {name}
                                </p>
                                <p>
                                    <strong>Publisher: </strong> {publisher}
                                </p>
                                <p>
                                    <strong>Type: </strong> {this.state.game.game_type.name}
                                </p>
                                <p>
                                    <strong>Category: </strong> {this.state.game.game_category.name}
                                </p>
                                <p>
                                    <strong>Description: </strong> {this.state.game.description}
                                </p>
                            </div>
                            <div className="col-md-4 col-lg-4">
                                <GameImage size="200" bgg_id={this.state.game.bgg_id}/>
                            </div>
                        </div>

                    </div>
                </div>
            )
        }
        return (<div></div>);
    }
}

export default SessionPage