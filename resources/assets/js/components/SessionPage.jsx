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
import ReactTooltip from 'react-tooltip';
import YouTube from 'react-youtube';

var moment = require('moment');

class SessionPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            session: null,
            user: null,
            isSignedUp: false,
            deleted: false,
        };
    }

    componentWillReceiveProps(newProps) {
        this.checkIfSignedUp(newProps.user);
        this.setState({user: newProps.user});

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

        var where = "";
        if(this.state.session.where){
            where = <p>&nbsp;<i className="fa fa-map-marker"/>&nbsp; &nbsp;Where: {this.state.session.where}</p>
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
                        <h3>{this.state.session.game.name} {userLabel}</h3>
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
                                    {where}
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
                                <GameDetails session={this.state.session} id={this.state.session.game.id}/>
                            </div>
                        </div>

                    </div>

                </div>
                <SessionMessages messages={this.state.messages} user={this.props.user}
                                 sessionId={this.state.session.id}/>
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
            var type = "";
            var category = "";
            if (this.state.game.publisher != null && this.state.game.publisher.url != null)
                publisher = <p><strong>Publisher: </strong> <a target="blank" href={this.state.game.publisher.url}>{this.state.game.publisher.name}</a></p>;
            if (this.state.game.game_type != null)
                type = <p><strong>Type: </strong> {this.state.game.game_type.name}</p>;
            if (this.state.game.game_category != null)
                type = <p><strong>Category: </strong> {this.state.game.game_category.name}</p>;
            return (<div>
                    <h4>Game Details</h4>
                    <div className="session-box-details">
                        <div className="row">
                            <div className="col-md-8 col-lg-8">
                                <p>
                                    <strong>Title:</strong> {name}
                                </p>
                                {publisher}
                                {type}
                                {category}
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
                                <strong>Rules Explanation:</strong><br/>
                                    <RulesLink  session={this.props.session} />
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

class RulesLink extends React.Component {
    constructor(props) {
        super(props);

    }
    render() {
        const opts = {
            height: '225',
            width: '400',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 0
            }
        };

        return (
            <YouTube
                videoId={this.props.session.rules_link_id}
                opts={opts}
                onReady={this._onReady}
            />
        );
    }

    _onReady(event) {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
    }
}

class SessionMessages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            key: 0,
            loading: false
        };
    }

    componentWillMount() {
        this.getMessages();
    }

    getMessages() {
        $.ajax({
            url: constants.API_HOST + "/session/" + this.props.sessionId + "/messages/",
            contentType: "application/json",
            cache: false,
            type: "GET",
        }).then(function (payload) {
            this.setState({messages: payload.messages, loading: false});
        }.bind(this), function (err) {
            // no results
            console.log(err.responseText);
            this.setState({loading: false});
        }.bind(this));
    }

    // rerender inventory on added game
    updateKey() {
        this.getMessages();
    }

    onChange(e) {
        var state = {};
        state[e.target.name] = e.target.value.trim();
        this.setState(state);
        console.log(this.state.message);
    }

    render() {

        var messages = [];
        if (this.state.messages != []) {
            this.state.messages.forEach(function (message) {
                messages.push(<SessionMessage key={message.id} message={message}/>);
            });
        }
        var inputMessage = <div></div>;
        if (this.props.user) {
            inputMessage =
                <SessionMessageInput newMessage={this.props.newMessage} user={this.props.user}
                                     sessionId={this.props.sessionId}
                                     updateKey={this.updateKey.bind(this)}/>
        }


        return (
            <div className="list-group">
                <div className="list-group-item active">
                    Discussion
                </div>
                {inputMessage}
                {messages}
            </div>
        )
    }
}

class SessionMessage extends Component {

    componentDidMount(){
        ReactTooltip.rebuild();
    }

    render() {
        return (
            <div className="list-group-item">
                <span className="label label-default pull-right"
                      data-tip={moment(this.props.message.created_at).format("dddd, MMMM Do YYYY, h:mm A")}>
                    {relativeDate(this.props.message.created_at)}
                    </span>
                {this.props.message.user.username}: <span
                className="session-box-details">{this.props.message.message}</span>
            </div>
        )
    }
}

class SessionMessageInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            errors: [],
            loading: false
        };
    }

    // TODO JASON: handle errors

    handleNewMessage() {
        var token = localStorage.getItem('token');
        if (token && this.state.message != "") {
            $.ajax({
                url: constants.API_HOST + "/sessionmes",
                contentType: "application/json",
                cache: false,
                type: "POST",
                data: JSON.stringify({
                    'game_session_id': this.props.sessionId,
                    "message": this.state.message,
                }),
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                beforeSend: function () {
                    this.setState({loading: true})
                }.bind(this)
            }).then(function (payload) {
                if (payload.hasOwnProperty('error')) {
                    this.setState({errors: payload.error, loading: false});
                    window.scrollTo(0, 0);
                } else {
                    // re-render parent
                    this.props.updateKey();
                    this.setState({message: ''});
                }

            }.bind(this), function (err) {
                // if there was an conflict
                var error = "Unknown error";
                switch (err.responseJSON.error) {
                    default:
                        error = err.responseJSON.error;
                }
                this.setState({scheduleError: error, loading: false});
                window.scrollTo(0, 0);
                console.log(err.responseJSON.error);
            }.bind(this));
        }
    }

    onChange(e) {
        var state = {};
        state[e.target.name] = e.target.value;
        this.setState(state);
    }

    render() {
        return (
            <div className="list-group-item">
                <div className="input-group">
                      <span className="input-group-btn">
                        <button className="btn btn-primary" type="button"
                                onClick={this.handleNewMessage.bind(this)}>Send</button>
                      </span>
                    <input type="text" name="message" className="form-control dark-textbox"
                           placeholder="Enter Message"
                           value={this.state.message}
                           onChange={this.onChange.bind(this)}/>
                </div>
            </div>
        )
    }
}

export default SessionPage