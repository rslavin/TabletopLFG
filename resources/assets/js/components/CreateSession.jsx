import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {constants} from '../constants';
import SpinnerButton from './SpinnerText';
import store from '../store';
import {updateTitleAndSubtitle, updateTitle} from '../actions/index';
import Switch from 'react-bootstrap-switch';
import ReactTooltip from 'react-tooltip';
import TimePicker from 'rc-time-picker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'rc-time-picker/assets/index.css';

const moment = require('moment');
const now = moment().hour(0).minute(0);
const format = 'h:mm A';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            username: "",
            email: "",
            password: "",
            password_confirm: "",
            authError: "",
            loading: false,
            registered: false,
            regErrors: null,
            passMatch: null,
            date: moment()
        };
    }

    handleDateChange(date) {
        this.setState({
            date: date
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
        store.dispatch(updateTitleAndSubtitle("Create Session", ""));
    }


    doRegister(e) {
        e.preventDefault();

        if (this.state.password != "" && this.state.password == this.state.password_confirm) {
            this.setState({passMatch: true});

            $.ajax({
                url: constants.API_HOST + "/register",
                contentType: "application/json",
                cache: false,
                type: "POST",
                data: JSON.stringify({
                    'first_name': this.state.first_name,
                    'last_name': this.state.last_name,
                    "username": this.state.username,
                    'email': this.state.email,
                    "password": this.state.password,
                }),
                beforeSend: function () {
                    this.setState({loading: true})
                }.bind(this)
            }).then(function (payload) {
                if (payload.hasOwnProperty('error')) {
                    this.setState({regErrors: payload.error, loading: false});
                } else {
                    this.setState({registered: true});
                }
            }.bind(this), function (err) {
                console.log(err.responseText);
            }.bind(this));
            this.state.passMatch = null;
        } else {
            this.setState({passMatch: false});
        }
    }

    render() {
        // if props.username
        if (this.props.username == undefined) {
            return (
                <p>Please login first.</p>
            );
        }

        // if just registered
        if (this.state.registered === true) {
            return (
                <p>Please check your email for a verification link.</p>
            );
        }

        var e = "";
        var errors = {};
        if (this.state.regErrors != null || (this.state.passMatch != null && !this.state.passMatch)) {
            e = <div className="row">
                <div className="col-md-4 col-md-offset-4 well well-danger">There were errors with your input:</div>
            </div>;
            if (this.state.regErrors != null) {
                if (this.state.regErrors.hasOwnProperty('first_name'))
                    errors.first_name = <div className="col-md-3 text-danger">{this.state.regErrors.first_name}</div>;
                if (this.state.regErrors.hasOwnProperty('last_name'))
                    errors.last_name = <div className="col-md-3 text-danger">{this.state.regErrors.last_name}</div>;
                if (this.state.regErrors.hasOwnProperty('username'))
                    errors.username = <div className="col-md-3 text-danger">{this.state.regErrors.username}</div>;
                if (this.state.regErrors.hasOwnProperty('email'))
                    errors.email = <div className="col-md-3 text-danger">{this.state.regErrors.email}</div>;
                if (this.state.regErrors.hasOwnProperty('password'))
                    errors.password = <div className="col-md-3 text-danger">{this.state.regErrors.password}</div>;
            }
            if (!this.state.passMatch)
                errors.password = <div className="col-md-3 text-danger">Passwords do not match</div>;
        }

        var timeRows = [];
        var openTime = 9;
        var closeTime = 18;
        for (var c = openTime; c <= closeTime; c++)
            timeRows.push(<ToggleTimeRow key={c} time={c}/>);


        // registration page
        return (
            <div className="container">
                {e}
                <div className="row">
                    <form onSubmit={this.doRegister.bind(this)} className="form-horizontal">
                        <fieldset>
                            <div className={"form-group" + (errors.first_name ? " has-error" : "")}>
                                <label className="col-md-3 control-label" htmlFor="textinput">Session Title</label>
                                <div className="col-md-6">
                                    <input id="textinput" name="first_name" placeholder="My Dumb Game"
                                           className="form-control input-md dark-textbox " required="" type="text"
                                           onChange={this.onChange.bind(this)}/>
                                    <span className="help-block"> </span>
                                </div>
                                {errors.first_name}
                            </div>

                            <div className={"form-group" + (errors.last_name ? " has-error" : "")}>
                                <label className="col-md-3 control-label" htmlFor="textinput">Description</label>
                                <div className="col-md-6">
                                    <textarea id="textinput" rows="5" name="last_name"
                                              placeholder="This is my game. Join it so I'm not so lonely"
                                              className="form-control input-md dark-textbox" required="" type="text"
                                              onChange={this.onChange.bind(this)}/>
                                    <span className="help-block"> </span>
                                </div>
                                {errors.last_name}
                            </div>

                            <div className={"form-group" + (errors.last_name ? " has-error" : "")}>
                                <label className="col-md-3 control-label" htmlFor="textinput">Sponsor
                                    Information</label>
                                <div className="col-md-6">
                                    <textarea id="textinput" rows="5" name="last_name"
                                              placeholder="Only visible for admins"
                                              className="form-control input-md dark-textbox" required="" type="text"
                                              onChange={this.onChange.bind(this)}/>
                                    <span className="help-block"> </span>
                                </div>
                                {errors.last_name}
                            </div>

                            <div className={"form-group" + (errors.username ? " has-error" : "")}>
                                <label className="col-md-3 control-label" htmlFor="textinput">Game</label>
                                <div className="col-md-6">
                                    <select id="textinput" name="username" placeholder="KobayashiMaruChamp69"
                                            className="form-control input-md dark-textbox" required="" type="text"
                                            onChange={this.onChange.bind(this)}>
                                        <option>Defaults to user's usual org</option>
                                        <option>Dumb</option>
                                        <option>Game</option>
                                    </select>
                                    <span className="help-block"> </span>
                                </div>
                                {errors.username}
                            </div>

                            <div className={"form-group" + (errors.username ? " has-error" : "")}>
                                <label className="col-md-3 control-label" htmlFor="textinput">Organization</label>
                                <div className="col-md-6">
                                    <select id="textinput" name="username" placeholder="KobayashiMaruChamp69"
                                            className="form-control input-md dark-textbox" required="" type="text"
                                            onChange={this.onChange.bind(this)}>
                                        <option>Some</option>
                                        <option>Dumb</option>
                                        <option>Bar</option>
                                    </select>
                                    <span className="help-block"> </span>
                                </div>
                                {errors.username}
                            </div>

                            <div className="form-group">
                                <label className="col-md-3 control-label" htmlFor="textinput">Session Time</label>
                                <div className="col-md-3">
                                    <DatePicker
                                        inline
                                        selected={this.state.date}
                                        onChange={this.handleDateChange.bind(this)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <div className="col-md-3 control-label">Start</div>
                                        <div className="col-md-9">
                                            <TimePicker
                                                showSecond={false}
                                                defaultValue={now}
                                                onChange={this.onChange.bind(this)}
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
                                                className="dark-textbox"
                                                onChange={this.onChange.bind(this)}
                                                format={format}
                                                use12Hours
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="col-md-4 control-label" htmlFor="singlebutton"> </label>
                                <div className="col-md-4">
                                    <button id="singlebutton" name="singlebutton" disabled={this.state.loading}
                                            className="btn btn-block btn-primary">Schedule Session<SpinnerButton
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

class ToggleTimeRow extends Component {
    render() {
        var t1, t2 = "";
        if (this.props.time < 13) {
            t1 = this.props.time + ":00 AM";
            t2 = this.props.time + ":30 AM"
        } else {
            t1 = (this.props.time - 12) + ":00 PM";
            t2 = (this.props.time - 12) + ":30 PM"
        }

        return (
            <div className="row">
                <div className="col-md-5">
                    <ToggleTime time={t1}/>
                </div>
                <div className="col-md-5">
                    <ToggleTime time={t2}/>
                </div>
            </div>
        )
    }
}

class ToggleTime extends Component {

    constructor(props) {
        super(props);
        this.state = {
            toggleActive: false,
            disabled: false
        }
    }

    onToggle() {
        this.setState({toggleActive: !this.state.toggleActive});
    }

    componentWillMount() {
        var disabled = Math.floor((Math.random() * 10) % 2);
        if (disabled)
            this.setState({disabled: true});
    }

    componentDidMount() {
        ReactTooltip.rebuild();
    }

    render() {
        if (this.state.disabled) {
            return (
                <span>
                <span className="col-md-7">
                    <span className="label label-default label-unavailable-toggle"
                          data-tip="The game is already reserved for this time period.">
                        Unavailable
                    </span>
                    </span>
                    <span className="col-md-5"> {this.props.time}
                    </span>
                    <ReactTooltip/>
                </span>
            )
        }
        return (
            <span><span className="col-md-7"><Switch
                onChange={this.onToggle.bind(this)} onText="Reserve"
                offText="Available" bsSize="mini"
                offColor="danger" onColor="success" value={this.state.toggleActive}
            /></span><span className="col-md-5"> {this.props.time}</span></span>
        )
    }
}


export default Register