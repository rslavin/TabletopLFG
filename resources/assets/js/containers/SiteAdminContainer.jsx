import React, {Component} from 'react';
import store from '../store';
import {updateTitleAndSubtitle, updateOrgNames} from '../actions/index';
import {Link, Route, Switch} from 'react-router-dom';
import SiteAdminGames from '../components/SiteAdminGames';
import SiteAdminPublishers from '../components/SiteAdminPublishers';
import SiteAdminCategories from '../components/SiteAdminCategories';
import SiteAdminGameTypes from '../components/SiteAdminGameTypes';
import {isInt} from '../utils/helpers';
import NotFound from '../components/NotFound';

import {constants} from '../constants'

class SiteAdminContainer extends Component {

    componentWillReceiveProps(props) {
        if (props.user == null || !props.user.is_admin) {
            store.dispatch(updateTitleAndSubtitle("", ''));
        } else
            store.dispatch(updateTitleAndSubtitle(constants.APP_NAME, 'Administrative Panel'));
    }

    componentDidMount(){
        if (this.props.user == null || !this.props.user.is_admin) {
            store.dispatch(updateTitleAndSubtitle("", ''));
        } else
            store.dispatch(updateTitleAndSubtitle(constants.APP_NAME, 'Administrative Panel'));
    }

    render() {
        if (this.props.user == null) {
            return (
                <p>Please login to view your organization's admin panel</p>
            );
        } else if (!this.props.user.is_admin) {
            return (
                <p>Access Denied</p>
            );
        }

        return (
            <Switch>
                <Route exact path="/admin" component={SiteAdminIndex}/>
                <Route exact path="/admin/games"
                       render={(props) => (<SiteAdminGames {...props} user={this.props.user}/>)}/>
                <Route exact path="/admin/publishers"
                       render={(props) => (<SiteAdminPublishers {...props} user={this.props.user}/>)}/>
                <Route exact path="/admin/categories"
                       render={(props) => (<SiteAdminCategories {...props} user={this.props.user}/>)}/>
                <Route exact path="/admin/types"
                       render={(props) => (<SiteAdminGameTypes {...props} user={this.props.user}/>)}/>
                <Route path="*" component={NotFound}/>
            </Switch>
        );
    };
}

class SiteAdminIndex extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-md-3">
                    <SiteLibrary/>
                </div>
            </div>
        )
    }
}

class SiteLibrary extends Component {
    render() {
        return (
            <div className="list-group">
                <div className="list-group-item active">
                    <h5>Site Library</h5>
                </div>
                <Link to="/admin/games" className="list-group-item">Games</Link>
                <Link to="/admin/publishers" className="list-group-item">Publishers</Link>
                <Link to="/admin/categories" className="list-group-item">Categories</Link>
                <Link to="/admin/types" className="list-group-item">Game Types</Link>
            </div>
        )
    }
}

export default SiteAdminContainer