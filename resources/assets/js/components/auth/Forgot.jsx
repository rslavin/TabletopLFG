import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {constants} from '../../constants';
import SpinnerButton from '../SpinnerText';
import {updateUsername, clearUsername} from '../../actions/index';
import store from '../../store';

class Forgot extends Component {

    render() {
        return (
           <div>
               Forgot your password?
           </div>
        );
    }
}



export default Forgot