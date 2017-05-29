import React, {Component} from 'react';
import {updateTitleAndSubtitle, updateOrgNames} from '../actions/index';
import {Link} from 'react-router-dom'
import Datatable from 'react-bs-datatable';
import {isInt} from '../utils/helpers';
import SpinnerText from './SpinnerText';
import {xmlToJson, stripTags} from '../utils/helpers';
import store from '../store';
import {updateModal} from '../actions/index';

import {constants} from '../constants'

class SiteAdminCategories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orgId: 0,
            key: 0,
            itemId: null
        };
    }


    // rerender inventory on added game
    updateKey() {
        this.setState({key: this.state.key + 1});
    }

    updateItemId(id) {
        this.setState({itemId: id})
    }

    render() {
        if (this.props.user == null) {
            store.dispatch(updateTitleAndSubtitle("", ''));
            return (
                <p>Please login to view your organization's admin panel</p>
            );
        } else if (!this.props.user.is_admin) {
            store.dispatch(updateTitleAndSubtitle("", ''));
            return (
                <p>Access Denied</p>
            );
        }

        return (
            <div>
                <AddCategory updateKey={this.updateKey.bind(this)} itemId={this.state.itemId}/>
                <CategoryList key={this.state.key} updateItemId={this.updateItemId.bind(this)}/>
            </div>
        );
    };
}

class AddCategory extends Component {

    constructor(props) {
        super(props);
        this.state = this.cleanCatFromState();
    }

    cleanCatFromState() {
        return {
            loading: false,
            regErrors: null,
            name: "",
            description: "",
            short_name: "",
            itemId: null,
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.itemId != null && this.state.itemId != newProps.itemId) {
            $.ajax({
                url: constants.API_HOST + "/gamecat/" + newProps.itemId,
                contentType: "application/json",
                cache: false,
                type: "GET",
            }).then(function (payload) {
                if (payload.hasOwnProperty('game_category')) {
                    this.setState(payload.game_category);
                }
            }.bind(this), function (err) {
                console.log(err.responseText);
            });
            this.setState({itemId: newProps.itemId});
        }
    }

    onChange(e) {
        var state = {};
        state[e.target.name] = e.target.value.trim();
        this.setState(state);
    }

    doCreate(e) {
        e.preventDefault();
        var token = localStorage.getItem('token');
        if (token != null) {
            var uri = "/gamecat", method = "POST"; // create
            if (this.state.itemId != null) { // update
                uri = "/gamecat/" + this.state.itemId;
                method = "PUT"
            }
            $.ajax({
                url: constants.API_HOST + uri,
                contentType: "application/json",
                cache: false,
                type: method,
                headers: {
                    'Authorization': 'Bearer: ' + token,
                },
                data: JSON.stringify(this.sanitizeFields()),
                beforeSend: function () {
                    this.setState({loading: true})
                }.bind(this)
            }).then(function (payload) {
                if (payload.hasOwnProperty('error')) {
                    this.setState({regErrors: payload.error, loading: false});
                    window.scrollTo(0, 0);
                } else {
                    this.props.updateKey();
                    this.setState(this.cleanCatFromState());
                }
            }.bind(this), function (err) {
                console.log(err.responseText);
                this.setState({loading: false})
            });
        }
    }

    sanitizeFields() {
        var fields = {};
        if (this.state.name != "" && this.state.name != null)
            fields.name = this.state.name;
        if (this.state.short_name != "" && this.state.short_name != null)
            fields.short_name = this.state.short_name;
        if (this.state.description != "" && this.state.description != null)
            fields.description = this.state.description;
        if (this.props.itemId != null && this.props.itemId > 0)
            fields.itemId = this.props.itemId;
        return fields;
    }

    render() {
        var e = "";

        var errors = {};
        if (this.state.regErrors != null) {
            e = <div className="row">
                <div className="col-md-4 col-md-offset-4 well well-danger">There were errors with your input:</div>
            </div>;
            // this is probably not the most concise way to do this...
            if (this.state.regErrors != null) {
                if (this.state.regErrors.hasOwnProperty('name'))
                    errors.name = <div className="col-md-3 text-danger">{this.state.regErrors.name}</div>;
                if (this.state.regErrors.hasOwnProperty('description'))
                    errors.description = <div className="col-md-3 text-danger">{this.state.regErrors.description}</div>;
                if (this.state.regErrors.hasOwnProperty('short_name'))
                    errors.short_name =
                        <div className="col-md-3 text-danger">{this.state.regErrors.short_name}</div>;
            }
        }

        return (
            <div className="panel panel-primary">
                <div className="panel-heading">
                    <h2>Add a Game Category</h2>
                </div>
                <div className="panel-body">
                    <div className="container">
                        {e}
                        <div className="row">
                            <form className="form-horizontal">
                                <fieldset>

                                    <div className={"form-group" + (errors.name ? " has-error" : "")}>
                                        <label className="col-md-4 control-label" htmlFor="textinput">Name*</label>
                                        <div className="col-md-4">
                                            <input id="textinput" name="name"
                                                   className="form-control input-md dark-textbox" required=""
                                                   type="text" value={this.state.name}
                                                   onChange={this.onChange.bind(this)}/>
                                            <span className="help-block"> </span>
                                        </div>
                                        {errors.name}
                                    </div>

                                    <div className={"form-group" + (errors.description ? " has-error" : "")}>
                                        <label className="col-md-4 control-label"
                                               htmlFor="textinput">Description*</label>
                                        <div className="col-md-4">
                                            <textarea id="textinput" name="description"
                                                      className="form-control input-md dark-textbox" required=""
                                                      type="text" rows="7" value={this.state.description}
                                                      onChange={this.onChange.bind(this)}/>
                                            <span className="help-block"> </span>
                                        </div>
                                        {errors.description}
                                    </div>

                                    <div className={"form-group" + (errors.short_name ? " has-error" : "")}>
                                        <label className="col-md-4 control-label" htmlFor="textinput">Short Name*</label>
                                        <div className="col-md-4">
                                            <input id="textinput" name="short_name"
                                                   className="form-control input-md dark-textbox" required=""
                                                   type="text" value={this.state.short_name}
                                                   onChange={this.onChange.bind(this)}/>
                                            <span className="help-block"> </span>
                                        </div>
                                        {errors.short_name}
                                    </div>

                                    <div className="form-group">
                                        <label className="col-md-4 control-label" htmlFor="singlebutton"> </label>
                                        <div className="col-md-4">
                                            <button id="singlebutton" name="singlebutton" disabled={this.state.loading}
                                                    onClick={this.doCreate.bind(this)}
                                                    className="btn btn-block btn-primary">Add Category<SpinnerText
                                                loading={this.state.loading}/>
                                            </button>
                                        </div>
                                    </div>
                                </fieldset>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class CategoryList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
        };
    }

    componentWillMount() {
        $.ajax({
            url: constants.API_HOST + "/gamecats/",
            contentType: "application/json",
            cache: false,
            type: "GET",
        }).then(function (payload) {
            this.setState({categories: payload.game_categories});
        }.bind(this), function (err) {
            console.log(err.responseText);
        });

    }

    render() {
        var header = [
            {title: 'Game Category', prop: 'categories', sortable: true, filterable: true},
            {title: 'Short Name', prop: 'shortName', sortable: true, filterable: true},
            {title: 'Delete', prop: 'delete', sortable: false, filterable: true},
        ];

        var itemRows = [];
        this.state.categories.forEach(function (i) {
            itemRows.push({
                categories: <a href="#" onClick={this.props.updateItemId.bind(this, i.id)}>{i.name}</a>,
                shortName: i.short_name,
                delete: <DeleteButton itemId={i.id}/>
            });
        }.bind(this));
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">
                    <h2>Existing Categories</h2>
                </div>
                <div className="panel-body">
                    <Datatable
                        tableHeader={header}
                        tableBody={itemRows}
                        keyName="userTable"
                        tableClass="table table-striped table-warning table-hover responsive"
                        rowsPerPage={10}
                        rowsPerPageOption={[5, 10, 20, 50, 100]}
                        initialSort={{prop: "category", isAscending: true}}
                    />
                </div>
            </div>
        );
    }
}

class DeleteButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            deleted: false
        };
    }

    onClick() {
        var token = localStorage.getItem('token');
        if (token != null) {

            $.ajax({
                url: constants.API_HOST + "/gamecat/" + this.props.itemId,
                contentType: "application/json",
                cache: false,
                type: "DELETE",
                headers: {
                    'Authorization': 'Bearer: ' + token,
                },
                beforeSend: function () {
                    this.setState({loading: true})
                }.bind(this)
            }).then(function (payload) {
                this.setState({loading: false, deleted: true})
            }.bind(this), function (err) {
                console.log(err.responseText);
                this.setState({loading: false})
            });
        }
    }

    onClickUndelete() {
        var token = localStorage.getItem('token');
        if (token != null) {

            $.ajax({
                url: constants.API_HOST + "/gamecat/" + this.props.itemId + "/undelete",
                contentType: "application/json",
                cache: false,
                type: "POST",
                headers: {
                    'Authorization': 'Bearer: ' + token,
                },
                beforeSend: function () {
                    this.setState({loading: true})
                }.bind(this)
            }).then(function (payload) {
                this.setState({loading: false, deleted: false})
            }.bind(this), function (err) {
                console.log(err.responseText);
                this.setState({loading: false})
            });
        }
    }

    render() {
        var icon = <SpinnerText loading={true}/>;

        if (this.state.deleted) {
            if (!this.state.loading)
                icon = "";
            return (
                <span>
                        <span className="label label-danger">DELETED</span>
                        <button
                            className="btn-success btn-xs floatright"
                            onClick={this.onClickUndelete.bind(this)}>Undo {icon}</button>
                    </span>
            );
        } else {
            if (!this.state.loading)
                icon = <i className="fa fa-times"/>;
            return (
                <button className="btn-danger btn-xs floatright" onClick={this.onClick.bind(this)}>{icon}</button>
            );
        }
    }
}

export default SiteAdminCategories