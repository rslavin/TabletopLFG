import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';

import SessionBox from './SessionBox';

class SessionList extends Component {

    // TODO create a filter component and feed games, types, times, into it
    // TODO dynamically filter these based on the checkbox components

    render() {
        var sRows = [];
        if (this.props.sessions) {
            var count = 1;
            var rowSessions = [];
            var i = 1;
            this.props.sessions.forEach(function (session) {
                if(count == 5){
                    sRows.push(<SessionListRow key={i} sessions={rowSessions} username={this.props.username}/>);
                    rowSessions = [];
                    count = 1;
                }
                rowSessions.push(session);
                count++;
                i++;
            }.bind(this));
            if(rowSessions !== []){
                sRows.push(<SessionListRow key={i} sessions={rowSessions} username={this.props.username}/>);
            }
        } else {
            sRows.push(
                <h3>No sessions</h3>
            );
        }
        return (
            <div>
                {sRows}
            </div>
        )
    };
}

class SessionListRow extends Component {
    render() {
        var r = [];
        this.props.sessions.forEach(function(session){
            r.push(<SessionBox key={session.id} data={session} username={this.props.username} />)
        }.bind(this));
        return (
            <div className="row">
                {r}
            </div>
        )
    }
}

export default SessionList