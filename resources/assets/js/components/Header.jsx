import React, {Component} from 'react';
import {constants} from '../constants';
import {Link} from 'react-router-dom';
import LoginMenu from './auth/Login';

class Header extends Component {

    render() {

        var groupAddonStyle = {width: "1%"};

        return (
            <div className="navbar navbar-default navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse"
                                data-target=".navbar-collapse">
                            <span className="icon-bar"/>
                            <span className="icon-bar"/>
                            <span className="icon-bar"/>
                        </button>
                        <a className="navbar-brand" href="/">{constants.APP_NAME}</a>
                    </div>
                    <div className="navbar-collapse collapse" id="nav-searchbar">
                        <ul className="nav navbar-nav navbar-right ">
                            <li><p className="navbar-btn"><a className="btn btn-success" href="/game/create">Start a
                                Game</a></p></li>
                            <li><Link to="#">Leagues</Link></li>
                            <LoginMenu/>
                        </ul>
                        <div className="col-sm-6 col-md-6">
                            <form className="navbar-form" id="search-form">
                                <div className="form-group">
                                    <div className="input-group">
                            <span className="input-group-addon" style={groupAddonStyle}><span
                                className="glyphicon glyphicon-search"/></span>
                                        <input className="form-control search-bar dark-textbox" name="search"
                                               placeholder="Search for a session"
                                               autoComplete="off"
                                               autoFocus="autofocus" id="search-bar" type="text"/>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}

export default Header