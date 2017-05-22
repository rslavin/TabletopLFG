import React, {Component} from 'react';
import {constants} from '../constants';
import {Link} from 'react-router-dom';
import LoginMenu from './auth/Login';
import SearchBar from './SearchBar';
import ReactTooltip from 'react-tooltip';

class Header extends Component {
    componentWillReceiveProps() {
        ReactTooltip.rebuild();
    }

    render() {
        var startGame = "";
        if (this.props.orgShortName != null && this.props.username != null)
            startGame =
                <Link to={"/session/create/"} className="btn btn-success">Start a Game</Link>;
        else
            startGame =
                <div className="btn disabled btn-success" data-tip="Login and select an organization to start a game.">
                    Start a Game</div>;
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
                        <img className="logo-header pull-left" src="/img/logo.png" /><Link to="/" className="navbar-brand">{constants.APP_NAME}</Link>
                    </div>
                    <div className="navbar-collapse collapse" id="nav-searchbar">

                        <ul className="nav navbar-nav navbar-right ">
                            <LoginMenu username={this.props.username} isAdmin={this.props.isAdmin}/>
                        </ul>
                        <div className="col-sm-6 col-md-6">
                            <SearchBar orgShortName={this.props.orgShortName}/>
                        </div>
                        <form className="navbar-form navbar-default">
                            {startGame}
                        </form>
                    </div>
                </div>
            </div>
        )
    };
}

export default Header