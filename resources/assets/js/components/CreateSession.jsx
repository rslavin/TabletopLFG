import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {constants} from '../constants';
import SpinnerText from './SpinnerText';
import store from '../store';
import {updateTitleAndSubtitle} from '../actions/index';
import TimePicker from 'rc-time-picker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'rc-time-picker/assets/index.css';

const moment = require('moment');
const now = moment().hour(0).minute(0);
const format = 'h:mm A';

class CreateSession extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            note: "",
            sponsor_note: "",
            start_time: moment(),
            end_time: moment(),
            game_id: "",
            loading: false,
            registered: null,
            regErrors: null,
            scheduleError: null,
            games: [],
            date: moment(),
            where: "",
            rules_link: "",
            offInventorySelect: false
        };
        this.handleGameSelection = this.handleGameSelection.bind(this);
    }

    onDateChange(date) {
        this.setState({
            date: date
        })
    }

    onChangeEndTime(time) {
        this.setState({
            end_time: time
        })
    }

    onChangeStartTime(time) {
        this.setState({
            start_time: time
        })
    }

    onToggle() {
        this.setState({toggleActive: !this.state.toggleActive});
    }

    onChange(e) {
        var state = {};
        state[e.target.name] = e.target.value.trim();
        this.setState(state);
    }

    componentWillMount() {
        store.dispatch(updateTitleAndSubtitle(localStorage.getItem('org.name'), "Create Session"));
        $.ajax({
            url: constants.API_HOST + "/games/" + localStorage.getItem('org.id'),
            contentType: "application/json",
            cache: false,
            type: "GET",
        }).then(function (payload) {
            this.setState({games: payload.games});
        }.bind(this), function (err) {
            console.log(err.responseText);
        }.bind(this));
    }


    doRegister(e) {
        e.preventDefault();
        var token = localStorage.getItem('token');
        if (token != null) {
            $.ajax({
                url: constants.API_HOST + "/session",
                contentType: "application/json",
                cache: false,
                type: "POST",
                data: JSON.stringify({
                    'note': this.state.note,
                    "sponsor_note": this.state.sponsor_note,
                    "where": this.state.where,
                    "rules_link": this.state.rules_link,
                    'start_time': this.state.date.format("MM/DD/YYYY") + " " + this.state.start_time.format("h:mm A"),
                    'end_time': this.state.date.format("MM/DD/YYYY") + " " + this.state.end_time.format("h:mm A"),
                    'game_id': this.state.game_id,
                    'organization_id': localStorage.getItem('org.id') // can be short_name or id
                }),
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                beforeSend: function () {
                    this.setState({loading: true})
                }.bind(this)
            }).then(function (payload) {
                if (payload.hasOwnProperty('error')) {
                    this.setState({regErrors: payload.error, loading: false, scheduleError: null});
                    window.scrollTo(0, 0);
                } else {
                    this.props.history.push("/session/"+ payload.game_session.id);
                }
            }.bind(this), function (err) {
                // if there was an conflict
                var error = "Unknown error";
                switch (err.responseJSON.error) {
                    case "SESSION_OVERLAP_WITH_OTHER_SESSION":
                        error = <p>You already have <Link to={"/session/" + err.responseJSON.other_session.id}>another
                            session</Link> scheduled for that time period</p>;
                        break;
                    case "NO_GAME_UNITS_AVAILABLE":
                        error = <p>{localStorage.getItem('org.name')} does not have enough game units available at that time.</p>
                        break;
                    case "USER_HAS_TOO_MANY_SESSIONS":
                        error = <p>You have to many sessions (max: {err.responseJSON.max_sessions})</p>
                        break;
                    case "ONLY_YOUTUBE_LINKS_ALLOWED":
                        error = <p>Only youtube links are allowed for video rules explanations.</p>
                        break;
                    case "INVALID_TOKEN":
                        break;
                    default:

                }
                this.setState({scheduleError: error, loading: false});
                window.scrollTo(0, 0);
                console.log(err.responseJSON.error);
            }.bind(this));
        }
    }

    handleGameSelection() {
        if(this.state.offInventorySelect == false){
            this.setState({offInventorySelect: true});
        }
        else{
            this.setState({offInventorySelect: false});
        }
    }

    render() {
        // if props.username
        if (this.props.user == undefined || this.props.user == null) {
            return (
                <p>Please login first.</p>
            );
        }


        var games = [];
        this.state.games.forEach(function (gameInv) {
            games.push(<option key={gameInv.game.id} value={gameInv.game.id}>{gameInv.game.name}</option>);
        });

        var e = "";
        var errors = {};
        if (this.state.regErrors != null || (this.state.passMatch != null && !this.state.passMatch)) {
            e = <div className="row">
                <div className="col-md-4 col-md-offset-4 well well-danger">There were errors with your input:</div>
            </div>;
            if (this.state.regErrors != null) {
                if (this.state.regErrors.hasOwnProperty('title'))
                    errors.title = <div className="col-md-3 text-danger">{this.state.regErrors.title}</div>;
                if (this.state.regErrors.hasOwnProperty('note'))
                    errors.note = <div className="col-md-3 text-danger">{this.state.regErrors.note}</div>;
                if (this.state.regErrors.hasOwnProperty('where'))
                    errors.where = <div className="col-md-3 text-danger">{this.state.regErrors.where}</div>;
                if (this.state.regErrors.hasOwnProperty('rules_link'))
                    errors.rules_link = <div className="col-md-3 text-danger">{this.state.regErrors.rules_link}</div>;
                if (this.state.regErrors.hasOwnProperty('sponsor_note'))
                    errors.sponsor_note =
                        <div className="col-md-3 text-danger">{this.state.regErrors.sponsor_note}</div>;
                if (this.state.regErrors.hasOwnProperty('start_time'))
                    errors.start_time = <div className="col-md-3 text-danger">{this.state.regErrors.start_time}</div>;
                if (this.state.regErrors.hasOwnProperty('end_time'))
                    errors.end_time = <div className="col-md-3 text-danger">{this.state.regErrors.end_time}</div>;
                if (this.state.regErrors.hasOwnProperty('game_id'))
                    errors.game_id = <div className="col-md-3 text-danger">{this.state.regErrors.game_id}</div>;
            }
        }

        // scheduling errors
        var sError = "";
        if(this.state.scheduleError != null){
            sError = <div className="row">
                <div className="col-md-4 col-md-offset-4 well well-danger">{this.state.scheduleError}</div>
            </div>;
        }

        var sponsorField = "";
        if (this.props.user.is_admin) {
            sponsorField = <div className={"form-group" + (errors.sponsor_note ? " has-error" : "")}>
                <label className="col-md-3 control-label" htmlFor="textinput">Sponsor
                    Information</label>
                <div className="col-md-6">
                                    <textarea id="textinput" rows="5" name="sponsor_note"
                                              placeholder="Administrators can add a sponsor note here to set this session apart from others."
                                              className="form-control input-md dark-textbox" required="" type="text"
                                              onChange={this.onChange.bind(this)}/>
                    <span className="help-block"> </span>
                </div>
                {errors.sponsor_note}
            </div>
        }

        var gameSelection;
        if(this.state.offInventorySelect){
            gameSelection = <div className={"form-group" + (errors.game_id ? " has-error" : "")}>
                <label className="col-md-3 control-label" htmlFor="textinput">Game</label>
                <div className="col-md-6">
                    <textarea id="textinput" name="where"
                              placeholder="Enter Game Here(e.g. Monopoly)"
                              className="form-control input-md dark-textbox" required="" type="text"
                              onChange={this.onChange.bind(this)}/>
                    <a id="offinvgame" onClick={this.handleGameSelection}>Select Game From Drop Down</a>
                    <span className="help-block"> </span>
                </div>
                {errors.game_id}
            </div>
        } else
        {
            gameSelection = <div className={"form-group" + (errors.game_text ? " has-error" : "")}>
                <label className="col-md-3 control-label" htmlFor="textinput">Game</label>
                <div className="col-md-6">
                    <select id="textinput" name="game_text"
                            className="form-control input-md dark-textbox" required="" type="text"
                            onChange={this.onChange.bind(this)}>
                        <option>Select a game</option>
                        {games}
                    </select>
                    <a id="offinvgame" onClick={this.handleGameSelection}>Bringing my own game!</a>
                    <span className="help-block"> </span>
                </div>
                {errors.game_text}
            </div>
        }

        // registration page
        return (
            <div className="container">
                {e}
                {sError}
                <div className="row">
                    <form onSubmit={this.doRegister.bind(this)} className="form-horizontal">
                        <fieldset>

                            {gameSelection}

                            <div className={"form-group" + (errors.note ? " has-error" : "")}>
                                <label className="col-md-3 control-label" htmlFor="textinput">Game Details</label>
                                <div className="col-md-6">
                                    <textarea id="textinput" rows="5" name="note"
                                              placeholder="Experience level expected, any other details of the game session"
                                              className="form-control input-md dark-textbox" required="" type="text"
                                              onChange={this.onChange.bind(this)}/>
                                    <span className="help-block"> </span>
                                </div>
                                {errors.note}
                            </div>

                            {sponsorField}

                            <div className={"form-group" + (errors.note ? " has-error" : "")}>
                                <label className="col-md-3 control-label" htmlFor="textinput">Where (Optional)</label>
                                <div className="col-md-6">
                                    <textarea id="textinput" name="where"
                                              placeholder="Where to meet for game"
                                              className="form-control input-md dark-textbox" required="" type="text"
                                              onChange={this.onChange.bind(this)}/>
                                    <span className="help-block"> </span>
                                </div>
                                {errors.note}
                            </div>

                            <div className={"form-group" + (errors.note ? " has-error" : "")}>
                                <label className="col-md-3 control-label" htmlFor="textinput">Rules Link (Optional)</label>
                                <div className="col-md-6">
                                    <input id="textinput" name="rules_link"
                                              placeholder="Link to video with rules explanation"
                                              className="form-control input-md dark-textbox" required="" type="text"
                                              onChange={this.onChange.bind(this)}/>
                                    <span className="help-block"> </span>
                                </div>
                                {errors.note}
                            </div>

                            <div className={"form-group" + (errors.start_time || errors.end_time ? " has-error" : "")}>
                                <label className="col-md-3 control-label" htmlFor="textinput">Session Time</label>
                                <div className="col-md-3">
                                    <DatePicker
                                        inline
                                        selected={this.state.date}
                                        onChange={this.onDateChange.bind(this)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <div className="col-md-3 control-label">Start</div>
                                        <div className="col-md-9">
                                            <TimePicker
                                                showSecond={false}
                                                defaultValue={now}
                                                name="start_time"
                                                onChange={this.onChangeStartTime.bind(this)}
                                                format={format}
                                                use12Hours
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="col-md-3 control-label">End</div>
                                        <div className="col-md-9">
                                            <TimePicker
                                                showSecond={false}
                                                defaultValue={now}
                                                name="end_time"
                                                className="dark-textbox"
                                                onChange={this.onChangeEndTime.bind(this)}
                                                format={format}
                                                use12Hours
                                            />
                                        </div>
                                    </div>
                                </div>
                                {errors.start_time}
                                {errors.end_time}
                            </div>

                            <div className="form-group">
                                <label className="col-md-4 control-label" htmlFor="singlebutton"> </label>
                                <div className="col-md-4">
                                    <button id="singlebutton" name="singlebutton" disabled={this.state.loading}
                                            className="btn btn-block btn-primary">Schedule Session<SpinnerText
                                        loading={this.state.loading}/>
                                    </button>
                                </div>
                            </div>


                        </fieldset>
                    </form>

                </div>
            </div>
        );
    }
}

export default CreateSession