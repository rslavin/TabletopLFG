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
        this.props.history.push("/o/"+localStorage.getItem('org.short_name') +"/search/"+ this.state.query);
    }

    onChange(e) {
        var state = {};
        state[e.target.name] = e.target.value.trim();
        this.setState(state);
    }

    render() {
        var groupAddonStyle = {width: "1%"};
        return (
            <form className="navbar-form" id="search-form" onSubmit={this.handleSearch.bind(this)}>
                <div className="form-group">
                    <div className="input-group">
                            <span className="input-group-addon" style={groupAddonStyle}><span
                                className="glyphicon glyphicon-search"/></span>
                        <input className="form-control search-bar dark-textbox" name="query"
                               placeholder="Search for a session"
                               autoComplete="off"
                               autoFocus="autofocus" id="search-bar" type="text" onChange={this.onChange.bind(this)}/>
                    </div>
                </div>
            </form>
        )
    };
}


export default withRouter(SearchBar)