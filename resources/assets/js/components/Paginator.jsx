import React, {Component} from 'react';

class Paginator extends Component {
    render() {
        return (
            <div>
                <PagerPrevious setSkip={this.props.setSkip.bind(this)} currentOffset={this.props.currentOffset}
                               interval={this.props.interval}/>
                <PagerNext setSkip={this.props.setSkip.bind(this)} currentOffset={this.props.currentOffset}
                           interval={this.props.interval}
                           disabled={this.props.disabled}/>
            </div>
        )
    }
}

class PagerNext extends Component {

    handleMouseUp() {
        this.props.setSkip(this.props.currentOffset + this.props.interval);
        console.log(this.props.currentOffset + this.props.interval);
    }

    render() {
        var disabled = "";
        if (this.props.disabled)
            disabled = "disabled";
        return <button className={"btn btn-default btn-lg floatright " + disabled}
                       onMouseUp={this.handleMouseUp.bind(this)}>Next &rarr;</button>;
    }
}

class PagerPrevious extends Component {

    handleMouseUp() {
        this.props.setSkip(this.props.currentOffset - this.props.interval);
    }

    render() {
        var disabled = "";
        if (this.props.currentOffset == 0)
            disabled = "disabled";
        return <button className={"btn btn-default btn-lg pull-left " + disabled}
                       onMouseUp={this.handleMouseUp.bind(this)}>&larr; Prev</button>;
    }
}

export default Paginator