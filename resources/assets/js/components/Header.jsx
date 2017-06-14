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
        var orgLink = "";
        if (this.props.orgShortName != null && this.props.orgShortName != ''){
            startGame =
                <Link to={"/session/create/"} className="btn btn-success">Start a Game</Link>;
            orgLink =
                <Link to={"/o/" + this.props.orgShortName} className="navbar-brand">{this.props.orgName}</Link>;
        }
        else
        {
            startGame =
                "";
            orgLink =
                <Link to={"/"} className="navbar-brand">{constants.APP_NAME}</Link>;
        }
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
                        <img className="logo-header pull-left" src="/img/logo.png" />{orgLink}
                    </div>
                    <div className="navbar-collapse collapse" id="nav-searchbar">
                        <ul className="nav navbar-nav navbar-right ">
                            <LoginMenu user={this.props.user}/>
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