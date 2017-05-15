import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom'
import {connect} from 'react-redux'

import NotFound from '../components/NotFound'
import Organization from '../components/Organization'
import Landing from '../components/Landing'
import Sidebar from '../components/Sidebar'
import SearchResults from '../components/SearchResults'

const mapStateToProps = function (store) {
    return {
        title: store.titleState.title,
        subtitle: store.titleState.subtitle,
    }
};

class AppContainer extends Component {
    render() {
        return (
            <div>
                <div className="page-header center-small">
                    <div className="row">
                        <div className="col-lg-8 col-md-7 col-sm-6">
                            <h1>{this.props.title}</h1>
                            <p className="lead">{this.props.subtitle}</p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12">
                        <Switch>
                            <Route exact path="/" component={Landing}/>
                            <Route exact path="/o/:org" component={Organization}/>
                            <Route exact path="/o/:org/search/:q" component={SearchResults}/>
                            <Route path="*" component={NotFound}/>
                        </Switch>
                    </div>
                </div>
            </div>
        )
    };
}

export default connect(mapStateToProps)(AppContainer)