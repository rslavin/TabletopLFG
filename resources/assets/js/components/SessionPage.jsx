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
import PropTypes from 'prop-types';
import Truncate from 'react-truncate';

var moment = require('moment');

class SessionPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            session: null,
            isSignedUp: false,
            deleted: false
        };
    }

    componentWillReceiveProps(newProps) {
        this.checkIfSignedUp(newProps.user);

        // fade in
        var elem = ReactDOM.findDOMNode(this);
        elem.style.opacity = 0;
        window.requestAnimationFrame(function () {
            elem.style.transition = "opacity 550ms";
            elem.style.opacity = 1;
        });
    }

    checkIfSignedUp(user, users = null) {
        if (users == null && this.state.session != null)
            users = this.state.session.users;
        if (users != null && user != null) {
            // toggle isInUsers if not aligned with users
            var isInUsers = false;
            users.forEach(function (sessionUser) {
                if (user.username == sessionUser.username) {
                    isInUsers = true;
                }
            }.bind(this));
            if (this.state.isSignedUp != isInUsers)
                this.setState({isSignedUp: !this.state.isSignedUp})
        }
        if (user == null && this.state.isSignedUp == true)
            this.setState({isSignedUp: false});
    };

    componentWillMount() {
        this.getSession();
        this.getMessages();
    }

    getMessages() {
        $.ajax({
            url: constants.API_HOST + "/sessionmes/" + this.props.match.params.sessionID,
            contentType: "application/json",
            cache: false,
            type: "GET",
        }).then(function (payload) {
            this.setState({messages: payload.messages, loading: false});
        }.bind(this), function (err) {
            // no results
            console.log(err.responseText);
            this.setState({loading: false, deleted: true});
        }.bind(this));
    }

    getSession() {
        $.ajax({
            url: constants.API_HOST + "/session/" + this.props.match.params.sessionID,
            contentType: "application/json",
            cache: false,
            type: "GET",
        }).then(function (payload) {
            this.setState({session: payload.game_session, loading: false});
            store.dispatch(updateTitleAndSubtitle(<Link
                to={"/o/" + payload.game_session.organization.short_name}>{payload.game_session.organization.name}</Link>, ""));
            this.checkIfSignedUp(this.props.user, payload.game_session.users);
        }.bind(this), function (err) {
            // no results
            console.log(err.responseText);
            this.setState({loading: false, deleted: true});
        }.bind(this));
    }

    handleNewMessage() {

    }

    render() {
        if (this.state.loading) {
            return (<Spinner />);
        }

        if (this.state.session == null)
            return (<NotFound/>);

        if (this.state.deleted) {
            return (
                <div className="alert alert-danger">
                    This session has been deleted.
                </div>
            )
        }

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

                                    <UserList session={this.state.session} user={this.props.user}
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
                <SessionMessages />
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
                if (this.props.user != null && player.username == this.props.user.username) {
                    playerList.push(<span key={i} className="text-white"><i
                        className="fa fa-check-square-o"/><strong> {player.username} (you)</strong>&nbsp;
                        <SignupButton user={this.props.user} signedUp={true}
                                      style="link"
                                      openSlots={this.props.openSlots} session={this.props.session}
                                      parentSignUp={this.props.getSession.bind(this)}
                                      parentLeave={this.props.getSession.bind(this)}/>
                        <br /></span>);
                } else
                    playerList.push(<span key={i}><i className="fa fa-check-square-o"/> {player.username}<br /></span>);
            } else if (this.props.user != null && !this.props.isSignedUp) {
                playerList.push(<span key={i}><i className="fa fa-square-o"/>&nbsp;
                    <SignupButton
                        user={this.props.user} signedUp={false}
                        style="link"
                        openSlots={this.props.openSlots} session={this.props.session}
                        parentSignUp={this.props.getSession.bind(this)} parentLeave={this.props.getSession.bind(this)}/><br /></span>);
            } else if (this.props.user)
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
            expanded: false,
            truncated: false
        };
        this.handleTruncate = this.handleTruncate.bind(this);
        this.toggleLines = this.toggleLines.bind(this);
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

    handleTruncate(truncated) {
        if (this.state.truncated !== truncated) {
            this.setState({
                truncated
            });
        }
    }

    toggleLines(event) {
        event.preventDefault();

        this.setState({
            expanded: !this.state.expanded
        });
    }

    render() {
        const {
            children,
            more,
            less,
            lines
        } = this.props;

        const {
            expanded,
            truncated
        } = this.state;

        if (this.state.game.length != 0) {
            var name = "";
            if (this.state.game.url != null)
                name = <a target="blank" href={this.state.game.url}>{this.state.game.name}</a>;
            else
                name = this.state.game.name;
            var publisher = "";
            if (this.state.game.publisher != null && this.state.game.publisher.url != null)
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
                                    <strong>Type: </strong> {this.state.game.game_type != null ? this.state.game.game_type.name : ""}
                                </p>
                                <p>
                                    <strong>Category: </strong> {this.state.game.game_category != null ? this.state.game.game_category.name : ""}
                                </p>
                                <p>
                                    <strong>Description: </strong>
                                    <Truncate
                                        lines={!expanded && lines}
                                        ellipsis={(
                                            <span>... <a href='#' onClick={this.toggleLines}>{more}</a></span>
                                        )}
                                        onTruncate={this.handleTruncate}
                                    >
                                        {this.state.game.description}
                                    </Truncate>
                                    {!truncated && expanded && (
                                        <span> <a href='#' onClick={this.toggleLines}>{less}</a></span>
                                    )}
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

GameDetails.defaultProps = {
    lines: 3,
    more: 'Read more',
    less: 'Show less'
};

GameDetails.propTypes = {
    text: PropTypes.node,
    lines: PropTypes.number
};

class SessionMessages extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="panel panel-primary">
                <div className="panel-body">
                <div className="row">
                    <div className="col-lg-11">
                        <div className="input-group">
                      <span className="input-group-btn">
                        <button className="btn btn-primary" type="button">Send</button>
                      </span>
                            <input type="text" className="form-control" placeholder="Enter Message"/>
                        </div>
                    </div>
                </div>
                </div>
                <div className="panel-body panel-height">
                    <p>jasontandv: A testing message</p>
                    <p>jasontandv: A longer testing message that may line break with enough characters. Better keep talking</p>
                </div>
            </div>
        )
    }
}

export default SessionPage