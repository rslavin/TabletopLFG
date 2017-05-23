import React, {Component} from 'react';
import {Link, Route, Switch} from 'react-router-dom';
import UserSessions from '../components/UserSessions';
import NotFound from '../components/NotFound';


class UserContainer extends Component {

    render() {

        return (
            <Switch>
                <Route exact path="/user/sessions" render={(props) => (<UserSessions {...props} user={this.props.user} />)} />
                <Route path="*" component={NotFound} />
            </Switch>
        );
    }
}

export default UserContainer