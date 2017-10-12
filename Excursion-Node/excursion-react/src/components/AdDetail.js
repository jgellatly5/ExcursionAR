import React, { Component } from 'react';
// import removeAd from '../../api/removeAd';
// import success from '../../api/success';
// import failure from '../../api/failure';
import { browserHistory } from 'react-router';
import { Table } from 'react-bootstrap';

class AdDetail extends Component{
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onSubmit(e) {
        e.preventDefault();
        // removeAd(this.props.advertisement._id, success, failure);
        browserHistory.push('/dashboard');
    }
    renderRemoveButton() {
        return (
            <form onSubmit={this.onSubmit}>
                <div className="form-group">
                    <button className="btn btn-danger btn-sm">
                        Remove
                    </button>
                </div>
            </form>
        );
    }
    render() {
        if (!this.props.advertisement) {
            return (
                <div className="row">
                    <div className="description">
                        <h3>Please create an advertisement to get started.</h3>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="table">
                    <Table striped condensed hover>
                        <thead>
                            <tr>
                                <th>Advertisement Name</th>
                                <th>Description</th>
                                <th>Company Name</th>
                                <th>Contact Name</th>
                                <th>Industry</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{this.props.advertisement.advertisementName}</td>
                                <td>{this.props.advertisement.description}</td>
                                <td>{this.props.advertisement.companyName}</td>
                                <td>{this.props.advertisement.contactName}</td>
                                <td>{this.props.advertisement.industry}</td>
                                {this.renderRemoveButton()}
                            </tr>
                        </tbody>
                    </Table>
                </div>
            );
        }
    }
};

export default AdDetail;
