import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ReactDOM, {render} from 'react-dom';
import {relativeDate, xmlToJson} from '../utils/helpers';
import {constants} from '../constants';

var moment = require('moment');
class SessionBox extends Component {

    componentDidMount() {
        // fade in
        var elem = ReactDOM.findDOMNode(this)
        elem.style.opacity = 0;
        window.requestAnimationFrame(function () {
            elem.style.transition = "opacity 550ms";
            elem.style.opacity = 1;
        });
    }

    render() {
        var openSlots = this.props.data.game.max_players - this.props.data.users.length;

        var slotsClass = "text-danger";
        if (openSlots == 1)
            slotsClass = "text-warning";
        else if (openSlots > 1)
            slotsClass = "text-success";

        var wellClass = "well session-box";
        var titlePrefix = "";
        if (this.props.data.sponsor_note != null) {
            wellClass = wellClass + " sponsor-box";
            titlePrefix = "SPONSORED: ";
        }
        return (
            <div className="col-md-3 col-lg-3">
                <div className={wellClass}>
                    <div className="session-box-description">
                        <p className="text-info">
                            {titlePrefix + this.props.data.title}
                        </p>
                        <div className="row session-game">
                            <div className="col-md-4">
                                <SessionThumbnail bgg_id={this.props.data.game.bgg_id}/>
                            </div>
                            <div className="col-md-8">
                                {this.props.data.game.name}
                            </div>
                        </div>
                        <p className="session-box-details">
                            <i className="fa fa-group"/> Players:
                            <span className={slotsClass}>
                            &nbsp;{this.props.data.users.length}/{this.props.data.game.max_players}
                            </span>
                        </p>
                        <p className="session-box-details">
                            <i className="fa fa-calendar"/> When: {relativeDate(this.props.data.start_time)}
                        </p>
                    </div>
                    <hr />
                    <div className="session-box-buttons">
                        <Link to="#" className="floatleft btn btn-warning btn-xs">More Info</Link>
                        <Link to="#" className="pull-right btn btn-success btn-xs">Sign Up</Link>
                    </div>
                </div>
            </div>
        )
    };
}

class SessionThumbnail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            xml: "placeholder",
            loading: true,
        };
    }


    componentWillMount() {
        $.ajax({
            url: constants.BGG_API_HOST + "/boardgame/" + this.props.bgg_id,
            contentType: "text",
            cache: false,
            type: "GET",
        }).then(function (payload) {
            this.setState({xml: xmlToJson(payload), loading: false});
        }.bind(this), function (err) {
            console.log("error: " + err);
        });

    }

    render() {
        if(this.state.loading){
            return (
                <div  className="loader-small thumbnail-game"></div>
            )
        }
        if (this.state.xml != "placeholder") {
            return (
                <img className="thumbnail thumbnail-game" src={this.state.xml.boardgames.boardgame.thumbnail}/>);

        }
        return (<span><img width="42" src=""/></span>
        );
    }
}

export default SessionBox