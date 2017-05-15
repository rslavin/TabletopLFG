import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';

import SessionBox from './Session';

class SessionList extends Component {


    render() {
        var sRows = [];
        if (this.props.sessions) {
            var count = 1;
            var rowSessions = [];
            console.log(this.props.sessions);
            this.props.sessions.forEach(function (session) {
                if(count == 5){
                    sRows.push(<SessionListRow key={rowSessions} sessions={rowSessions} />);
                    rowSessions = [];
                    count = 1;
                }
                rowSessions.push(session);
                count++;
            });
            if(rowSessions !== []){
                sRows.push(<SessionListRow key={rowSessions} sessions={rowSessions} />);
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
            r.push(<SessionBox key={session.id} data={session}/>)
        });
        return (
            <div className="row">
                {r}
            </div>
        )
    }
}

export default SessionList