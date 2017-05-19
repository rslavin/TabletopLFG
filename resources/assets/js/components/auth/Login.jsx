import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {constants} from '../../constants';
import SpinnerButton from '../SpinnerText';
import {updateUsername, updateAdmin, clearUser} from '../../actions/index';
import store from '../../store';

class LoginMenu extends Component {


    componentWillMount() {
        // see if there is a token
        var token = localStorage.getItem('token');
        if (this.props.username == null && token != null) {
            $.ajax({
                url: constants.API_HOST + "/authenticate/user",
                contentType: "application/json",
                cache: false,
                type: "GET",
                headers: {
                    'Authorization': 'Bearer: ' + token,
                },
            }).then(function (payload) {
                store.dispatch(updateUsername(payload.user.username));
                store.dispatch(updateAdmin(payload.user.is_admin));
            }.bind(this), function (err) {
                console.log(err.responseText);
                localStorage.removeItem('token');
            }.bind(this));
        }
    }

    render() {
        if (this.props.username != null) {
            var adminMenu = "";
            if(this.props.isAdmin) {
                adminMenu = <li><Link to="/admin">Admin Panel</Link></li>
            }
            return (

                <li className="dropdown">
                    <a className="dropdown-toggle" data-toggle="dropdown" href="#" id="auth">{this.props.username}<span
                        className="caret"/></a>
                    <ul className="dropdown-menu" aria-labelledby="auth">
                        <li><Link to="#">My Sessions</Link></li>
                        <li><Link to="#">My Games</Link></li>
                        {adminMenu}
                        <li className="divider"/>
                        <li><a href="#" onMouseUp={logout.bind(this)}>Logout</a></li>
                    </ul>
                </li>

            )
        }
        return (
            <li className="dropdown">
                <a className="dropdown-toggle" data-toggle="dropdown" href="#" id="auth">Login <span
                    className="caret"/></a>
                <ul className="dropdown-menu" aria-labelledby="auth" id="auth-dd">
                    <div className="row">
                        <div className="col-md-12">
                            <LoginForm />
                        </div>
                        <div className="bottom text-center">
                            Need an account? <Link to="/auth/register"><b>Register</b></Link>
                        </div>
                    </div>
                </ul>
            </li>
        );
    }
}

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            remember: false,
            authError: "",
            loading: false,
        };
    }

    doAuth(e) {
        e.preventDefault();

        $.ajax({
            url: constants.API_HOST + "/authenticate",
            contentType: "application/json",
            cache: false,
            type: "POST",
            data: JSON.stringify({
                "username": this.state.username,
                "password": this.state.password,
            }),
            beforeSend: function () {
                this.setState({loading: true})
            }.bind(this)
        }).then(function (payload) {
            if (payload.token != undefined) {
                localStorage.setItem('token', payload.token);
                store.dispatch(updateUsername(payload.user.username));
                store.dispatch(updateAdmin(payload.user.is_admin));
            }else if(payload.error == "EMAIL_NOT_VERIFIED"){
                this.setState({authError: "Email not verified", loading: false});
            }
        }.bind(this), function (err) {
            console.log(err.responseText);
            if (err.status == 401) {
                this.setState({authError: "Invalid credentials", loading: false});
            }
        }.bind(this));
    }

    toggleRemember(){
        this.setState({remember: !this.state.remember});
    }

    onChange(e) {
        var state = {};
        state[e.target.name] = e.target.value.trim();
        this.setState(state);
    }

    render() {
        var note = this.state.authError.length > 0 ? this.state.authError : "";
        return (
            <form onSubmit={this.doAuth.bind(this)} className="form" role="form" acceptCharset="UTF-8" id="login-nav">
                <span className="has-error">{note}</span>
                <div className="form-group">
                    <label className="sr-only" htmlFor="exampleInputEmail2">Username</label>
                    <input autoComplete="off" name="username" className="form-control dark-textbox"
                           id="exampleInputEmail2" placeholder="Username"
                           required onChange={this.onChange.bind(this)}/>
                </div>
                <div className="form-group">
                    <label className="sr-only" htmlFor="exampleInputPassword2">Password</label>
                    <input name="password" type="password" className="form-control dark-textbox"
                           id="exampleInputPassword2"
                           placeholder="Password" required onChange={this.onChange.bind(this)}/>
                    <div className="help-block text-right"><Link to="/auth/forgot">Forget your password?</Link></div>
                </div>
                <div className="form-group">
                    <button type="submit" disabled={this.state.loading} className="btn btn-primary btn-block">Sign in <SpinnerButton
                        loading={this.state.loading}/></button>
                </div>
                <div className="checkbox">
                    <label>
                        <input type="checkbox" name="remember" value="1" checked={this.state.remember} onChange={this.toggleRemember.bind(this)}/> keep me logged-in
                    </label>
                </div>
            </form>
        )
    }
}

export function logout() {
    localStorage.removeItem('token');
    store.dispatch(clearUser());
}

export default LoginMenu