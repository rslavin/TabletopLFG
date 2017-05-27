import React, {Component} from 'react';
import {render} from 'react-dom';
import store from '../store';
import {updateTitleAndSubtitle, updateOrgNames} from '../actions/index';

class NotFound extends Component {
    componentWillReceiveProps(){
        store.dispatch(updateTitleAndSubtitle("Page Not Found", ''));
    }
    render() {
        return (
            <div>
                <h3>Error 404</h3>
                <p>We are sorry but the page you are looking for does not exist.</p>
            </div>
        );

    }
}

export default NotFound