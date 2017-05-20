import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import store from '../store';
import {closeModal} from '../actions/index';

class Modal extends Component {

    closeModal() {
        store.dispatch(closeModal())
    }

    render() {
        return (
            <div id="main-modal" className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" id="main-modal-top-close" className="close"
                                    onClick={this.closeModal.bind(this)}
                                    aria-label="Close"><span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">{this.props.attributes.title}</h4>
                        </div>
                        <div className="modal-body">
                            {this.props.attributes.body}
                        </div>
                        <div className="modal-footer">
                            <button type="button" id="main-modal-bottom-close" className="btn btn-default"
                                    onClick={this.closeModal.bind(this)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}

export default Modal