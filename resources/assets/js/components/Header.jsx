import React, {Component} from 'react';
import {constants} from '../constants';
import {Link} from 'react-router-dom';
import LoginMenu from './auth/Login';
import SearchBar from './SearchBar';
import ReactTooltip from 'react-tooltip';

class Header extends Component {

    render() {
        var startGame = "";
        if(this.props.orgShortName != null && this.props.username != null)
            startGame = <Link to={"/session/create/" + this.props.orgShortName} className="btn btn-success">Start a Game</Link>;
        else
            startGame = <button className="btn disabled btn-success" data-tip="Login and select an organization to start a game.">Start a Game</button>;
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
                        <Link to="/" className="navbar-brand">{constants.APP_NAME}</Link>
                    </div>
                    <div className="navbar-collapse collapse" id="nav-searchbar">

                        <ul className="nav navbar-nav navbar-right ">
                            <li><Link to="#">Leagues</Link></li>
                            <LoginMenu username={this.props.username}/>
                        </ul>
                        <div className="col-sm-6 col-md-6">
                            <SearchBar orgShortName={this.props.orgShortName}/>
                        </div>
                        <form className="navbar-form navbar-default">
                            {startGame}
                        </form>
                    </div>
                </div>
                <ReactTooltip/>
            </div>
        )
    };
}

export default Header