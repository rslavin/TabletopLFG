import React, {Component} from 'react';
import {Switch, Route, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import NotFound from '../components/NotFound'
import Organization from '../components/Organization'
import Landing from '../components/Landing'
import Header from '../components/Header'
import SearchResults from '../components/SearchResults'
import AuthContainer from './AuthContainer'
import UserContainer from './UserContainer'
import SessionPage from '../components/SessionPage'
import Modal from '../components/Modal'
import store from '../store';
import ReactTooltip from 'react-tooltip';
import {updateOrgShortName, updateOrgName} from '../actions/index';

const mapStateToProps = function (store) {
    return {
        title: store.titleState.title,
        subtitle: store.titleState.subtitle,
        username: store.userState.username,
        orgShortName: store.orgState.orgShortName,
        orgName: store.orgState.orgName,
        isAdmin: store.userState.isAdmin,
        modalAttributes: store.modalState.attributes
    }
};

class AppContainer extends Component {
    componentWillMount() {
        if (this.props.orgName == null && localStorage.getItem('org.name') != null)
            store.dispatch(updateOrgName(localStorage.getItem('org.name')));
        if (this.props.orgShortName == null && localStorage.getItem('org.short_name') != null)
            store.dispatch(updateOrgShortName(localStorage.getItem('org.short_name')));
    }

    render() {
        return (
            <div>
                <Modal attributes={this.props.modalAttributes} />
                <Header username={this.props.username} orgShortName={this.props.orgShortName}
                        isAdmin={this.props.isAdmin}/>
                <div id="wrap">
                    <div className="container">
                        <div className="page-header center-small">
                            <div className="row">
                                <div className="col-lg-8 col-md-7 col-sm-6">
                                    <h1>{this.props.title}</h1>
                                    <p className="lead">{this.props.subtitle}</p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-12">
                                <Switch>
                                    <Route exact path="/" component={Landing}/>
                                    <Route exact path="/o/:org" render={(props) => (
                                        <Organization {...props} username={this.props.username}/>)}/>
                                    <Route exact path="/o/:org/search/:q" render={(props) => (
                                        <SearchResults {...props} username={this.props.username}/>)}/>
                                    <Route path="/auth/:action" render={(props) => (
                                        <AuthContainer {...props} username={this.props.username}/>)}/>
                                    <Route path="/user/:action" render={(props) => (
                                        <UserContainer {...props} username={this.props.username}/>)}/>
                                    <Route exact path="/session/:sessionID" render={(props) => (
                                        <SessionPage {...props} username={this.props.username}/>)}/>
                                    <Route path="*" component={NotFound}/>
                                </Switch>
                            </div>
                        </div>
                    </div>
                    <ReactTooltip/>
                </div>
            </div>
        )
    };
}

export default withRouter(connect(mapStateToProps)(AppContainer))