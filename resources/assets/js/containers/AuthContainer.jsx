import React, {Component} from 'react';
import {Link, Route, Switch} from 'react-router-dom';
import Forgot from '../components/auth/Forgot'
import Register from '../components/auth/Register'
import NotFound from '../components/NotFound'
import Verify from '../components/auth/Verify'


class AuthContainer extends Component {

    render() {

        return (
            <Switch>
                <Route exact path="/auth/forgot"  component={Forgot}/>
                <Route exact path="/auth/register" render={(props) => (<Register {...props} user={this.props.user} />)} />
                <Route exact path="/auth/verify/:emailToken" component={Verify} />
                <Route path="*" component={NotFound} />
            </Switch>
        );
    }
}

export default AuthContainer