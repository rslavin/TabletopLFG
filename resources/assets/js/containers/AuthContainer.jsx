import React, {Component} from 'react';
import {Link, Route, Switch} from 'react-router-dom';
import Forgot from '../components/auth/Forgot'
import Register from '../components/auth/Register'
import NotFound from '../components/NotFound'

class AuthContainer extends Component {

    render() {

        return (
            <Switch>
                <Route exact path="/auth/forgot"  component={Forgot}/>
                <Route exact path="/auth/register" render={(props) => (<Register {...props} username={this.props.username} />)} />
                <Route path="*" component={NotFound} />
            </Switch>
        );
    }
}

export default AuthContainer