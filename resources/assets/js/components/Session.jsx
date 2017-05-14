import React, {Component} from 'react';

class Session extends Component {

    render() {
        var openSlots = this.props.data.game.max_players - this.props.data.users.length;
        return (
            <div className="well">
                <ul>
                    <li>Game: {this.props.data.game.name}</li>
                    <li>Start: {this.props.data.start_time}</li>
                    <li>End: {this.props.data.end_time}</li>
                    <li>Open Slots: {openSlots}</li>
                    <li>Note: {this.props.data.note}</li>
                </ul>
            </div>
        )
    };
}

export default Session