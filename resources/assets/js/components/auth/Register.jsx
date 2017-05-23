import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {constants} from '../../constants';
import SpinnerButton from '../SpinnerText';
import store from '../../store';
import {updateTitleAndSubtitle, updateTitle} from '../../actions/index';
import {logout} from './Login';

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
        };
    }

    onChange(e) {
        var state = {};
        state[e.target.name] = e.target.value.trim();
        this.setState(state);
    }

    componentWillMount() {
        store.dispatch(updateTitleAndSubtitle("Register", "Members can participate in sessions and leagues"));
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
        if (this.props.user != null) {
            return (
                <p>You are already logged in. <a href="#" onMouseUp={logout.bind(this)}>Click here</a> to logout.</p>
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
                    errors.first_name = <div className="col-md-4 text-danger">{this.state.regErrors.first_name}</div>;
                if (this.state.regErrors.hasOwnProperty('last_name'))
                    errors.last_name = <div className="col-md-4 text-danger">{this.state.regErrors.last_name}</div>;
                if (this.state.regErrors.hasOwnProperty('username'))
                    errors.username = <div className="col-md-4 text-danger">{this.state.regErrors.username}</div>;
                if (this.state.regErrors.hasOwnProperty('email'))
                    errors.email = <div className="col-md-4 text-danger">{this.state.regErrors.email}</div>;
                if (this.state.regErrors.hasOwnProperty('password'))
                    errors.password = <div className="col-md-4 text-danger">{this.state.regErrors.password}</div>;
            }
            if (!this.state.passMatch)
                errors.password = <div className="col-md-4 text-danger">Passwords do not match</div>;
        }


        // registration page
        return (
            <div className="container">
                {e}
                <div className="row">
                    <form onSubmit={this.doRegister.bind(this)} className="form-horizontal">
                        <fieldset>
                            <div className={"form-group" + (errors.first_name ? " has-error" : "")}>
                                <label className="col-md-4 control-label" htmlFor="textinput">First Name</label>
                                <div className="col-md-4">
                                    <input id="textinput" name="first_name" placeholder="James"
                                           className="form-control input-md dark-textbox " required="" type="text"
                                           onChange={this.onChange.bind(this)}/>
                                    <span className="help-block"> </span>
                                </div>
                                {errors.first_name}
                            </div>

                            <div className={"form-group" + (errors.last_name ? " has-error" : "")}>
                                <label className="col-md-4 control-label" htmlFor="textinput">Last Name</label>
                                <div className="col-md-4">
                                    <input id="textinput" name="last_name" placeholder="Kirk"
                                           className="form-control input-md dark-textbox" required="" type="text"
                                           onChange={this.onChange.bind(this)}/>
                                    <span className="help-block"> </span>
                                </div>
                                {errors.last_name}
                            </div>

                            <div className={"form-group" + (errors.username ? " has-error" : "")}>
                                <label className="col-md-4 control-label" htmlFor="textinput">Username</label>
                                <div className="col-md-4">
                                    <input id="textinput" name="username" placeholder="KobayashiMaruChamp69"
                                           className="form-control input-md dark-textbox" required="" type="text"
                                           onChange={this.onChange.bind(this)}/>
                                    <span className="help-block"> </span>
                                </div>
                                {errors.username}
                            </div>

                            <div className={"form-group" + (errors.email ? " has-error" : "")}>
                                <label className="col-md-4 control-label" htmlFor="textinput">Email</label>
                                <div className="col-md-4">
                                    <input id="textinput" name="email" placeholder="jtkirk@ufp.org"
                                           className="form-control input-md dark-textbox" required="" type="email"
                                           onChange={this.onChange.bind(this)}/>
                                    <span className="help-block"> </span>
                                </div>
                                {errors.email}
                            </div>

                            <div className={"form-group" + (errors.password ? " has-error" : "")}>
                                <label className="col-md-4 control-label" htmlFor="textinput">Password</label>
                                <div className="col-md-4">
                                    <input id="textinput" name="password" placeholder="hunter2"
                                           className="form-control input-md dark-textbox" required="" type="password"
                                           onChange={this.onChange.bind(this)}/>
                                    <span className="help-block"> </span>
                                </div>
                                {errors.password}
                            </div>

                            <div className={"form-group" + (errors.password ? " has-error" : "")}>
                                <label className="col-md-4 control-label" htmlFor="textinput">Confirm Password</label>
                                <div className="col-md-4">
                                    <input id="textinput" name="password_confirm" placeholder="hunter2"
                                           className="form-control input-md dark-textbox" required="" type="password"
                                           onChange={this.onChange.bind(this)}/>
                                    <span className="help-block"> </span>
                                </div>
                                {errors.password}
                            </div>

                            <div className="form-group">
                                <label className="col-md-4 control-label" htmlFor="singlebutton"> </label>
                                <div className="col-md-4">
                                    <button id="singlebutton" name="singlebutton" disabled={this.state.loading}
                                            className="btn btn-block btn-primary">Register <SpinnerButton
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


export default Register