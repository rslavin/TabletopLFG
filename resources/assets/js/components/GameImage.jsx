import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {render} from 'react-dom';
import {relativeDate, xmlToJson} from '../utils/helpers';
import {constants} from '../constants';



export class GameImage extends Component {

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
        var style = {'margin-botton': "5px !important",
        "height": this.props.size, "width": this.props.size};

        if (this.state.loading) {
            return (
                <div className="loader-small image-game" style={style}></div>
            )
        }
        if (this.state.xml != "placeholder") {
            return (
                <img className="thumbnail " style={style} src={this.state.xml.boardgames.boardgame.thumbnail}/>);

        }
        return (<span><img width="42" src=""/></span>
        );
    }
}

export default GameImage