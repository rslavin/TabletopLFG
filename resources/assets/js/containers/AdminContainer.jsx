import React, {Component} from 'react';
import {Link, Route, Switch} from 'react-router-dom';
import Forgot from '../components/auth/Forgot'
import Register from '../components/auth/Register'
import OrgAdminPage from '../components/OrgAdminPage'
import NotFound from '../components/NotFound'


class AdminContainer extends Component {

    render() {

        return (
            <Switch>
                <Route exact path="/admin/"  component={Forgot}/>
                <Route exact path="/admin/o/:org" render={(props) => (<OrgAdminPage {...props} user={this.props.user} />)} />
                <Route path="*" component={NotFound} />
            </Switch>
        );
    }
}

export default AdminContainer