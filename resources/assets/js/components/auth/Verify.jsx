import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {constants} from '../../constants';
import {updateUser} from '../../actions/index';
import store from '../../store';
import Spinner from '../../components/Spinner';


class Verify extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            remember: false,
            authError: "",
            loading: true,
            validated: false
        };
    }

    componentWillMount() {
        $.ajax({
            url: constants.API_HOST + "/authenticate/verify/" + this.props.match.params.emailToken,
            contentType: "application/json",
            cache: false,
            type: "GET",
        }).then(function (payload) {
            if (payload.token != undefined) {
                localStorage.setItem('token', payload.token);
                store.dispatch(updateUser(payload.user));
                this.setState({validated: true, loading: false});
            } else if (payload.error == "EMAIL_NOT_VERIFIED") {
                this.setState({authError: "Email not verified", loading: false});
            }
        }.bind(this), function (err) {
            console.log(err.responseText);
            if (err.status == 404) {
                this.setState({authError: "Invalid token.", loading: false});
            }
        }.bind(this));
    }


    render() {
        if(this.state.loading){
            return(
                <Spinner/>
            )
        }
        if (this.state.validated) {
            return (
                <h2>
                    Verification successful!
                </h2>
            )
        }else {
            return (
                <h2>
                    Invalid token!
                </h2>
            )
        }
    }
}

export default Verify