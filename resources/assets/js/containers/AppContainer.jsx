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
import CreateSession from '../components/CreateSession'
import SessionPage from '../components/SessionPage'
import SiteAdminContainer from './SiteAdminContainer'
import OrgAdminPage from '../components/OrgAdminPage'
import Modal from '../components/Modal'
import store from '../store';
import ReactTooltip from 'react-tooltip';
import {updateOrgShortName, updateOrgName} from '../actions/index';
import OrgGameList from "../components/OrgGameList";

const mapStateToProps = function (store) {
    return {
        title: store.titleState.title,
        subtitle: store.titleState.subtitle,
        user: store.userState.user,
        orgShortName: store.orgState.orgShortName,
        orgName: store.orgState.orgName,
        orgId: store.orgState.orgId,
        modalAttributes: store.modalState.attributes
    }
};

class AppContainer extends Component {
    componentDidMount() {
        if (this.props.orgName == null && localStorage.getItem('org.name') != null)
            store.dispatch(updateOrgName(localStorage.getItem('org.name')));
        if (this.props.orgShortName == null && localStorage.getItem('org.short_name') != null)
            store.dispatch(updateOrgShortName(localStorage.getItem('org.short_name')));

    }

    render() {
        return (
            <div>
                <Modal attributes={this.props.modalAttributes}/>
                <Header orgName = {this.props.orgName} user={this.props.user} orgShortName={this.props.orgShortName}/>
                <div id="wrap">
                    <div className="container">
                        <div className="page-header center-small">
                            <h4>{this.props.subtitle}</h4>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-12">
                                <Switch>
                                    <Route exact path="/" component={Landing}/>
                                    <Route exact path="/o/:org" render={(props) => (
                                        <Organization {...props} user={this.props.user}/>)}/>
                                    <Route exact path="/o/:org/gamelist" render={(props) => (
                                        <OrgGameList {...props} orgId = {localStorage.getItem('org.id')} user={this.props.user}/>)}/>
                                    <Route exact path="/o/:org/search/:q" render={(props) => (
                                        <SearchResults {...props} user={this.props.user}/>)}/>
                                    <Route path="/auth/:action" render={(props) => (
                                        <AuthContainer {...props} user={this.props.user}/>)}/>
                                    <Route path="/user/:action" render={(props) => (
                                        <UserContainer {...props} user={this.props.user}/>)}/>
                                    <Route exact path="/session/create" render={(props) => (
                                        <CreateSession {...props} user={this.props.user}/>)}/>
                                    <Route exact path="/session/:sessionID" render={(props) => (
                                        <SessionPage {...props} user={this.props.user}/>)}/>
                                    <Route exact path="/admin/o/:org"
                                           render={(props) => (<OrgAdminPage {...props} user={this.props.user}/>)}/>
                                    <Route path="/admin/"
                                           render={(props) => (<SiteAdminContainer{...props} user={this.props.user}/>)}/>
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