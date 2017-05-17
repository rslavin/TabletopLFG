import React, {Component} from 'react';
import {constants} from '../constants';
import {Link} from 'react-router-dom';
import LoginMenu from './auth/Login';
import SearchBar from './SearchBar';

class Header extends Component {

    render() {
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
                            <LoginMenu username={this.props.username}/>
                        </ul>
                        <div className="col-sm-6 col-md-6">
                            <SearchBar />
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}

export default Header