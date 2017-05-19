import React, {Component} from 'react';
import {Switch, Route, withRouter} from 'react-router-dom';


class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "",
        };
    }

    handleSearch(e) {
        e.preventDefault();
        this.props.history.push("/o/"+this.props.orgShortName +"/search/"+ this.state.query);
    }

    onChange(e) {
        var state = {};
        state[e.target.name] = e.target.value.trim();
        this.setState(state);
    }

    render() {
        var groupAddonStyle = {width: "1%"};
        var placeholderText = "Search for a session", disabled = false;
        if(this.props.orgShortName == null) {
            placeholderText = "Select an organization to enable search";
            disabled = true;
        }

        return (
            <form className="navbar-form" id="search-form" onSubmit={this.handleSearch.bind(this)}>
                <div className="form-group">
                    <div className="input-group">
                            <span className="input-group-addon" style={groupAddonStyle}><span
                                className="glyphicon glyphicon-search"/></span>
                        <input className="form-control search-bar dark-textbox" name="query"
                               placeholder={placeholderText}
                               autoComplete="off"
                               disabled={disabled}
                               autoFocus="autofocus" id="search-bar" type="text" onChange={this.onChange.bind(this)}/>
                    </div>
                </div>
            </form>
        )
    };
}


export default withRouter(SearchBar)