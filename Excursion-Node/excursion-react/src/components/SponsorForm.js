import React, { Component } from 'react';
import {Grid, Row, Col, Panel, Button, Form, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

class SponsorForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            active: 'btn btn-lg'
        }
        this.baseState = this.state;
        this.onChange = this.onChange.bind(this);
    }
    onChange() {
        this.setState({
            active: 'btn btn-lg active'
        });
    }
    render() {
        return (
            <div className="ad-signup-container">
                <div className="ad-signup">
                    <Panel className="ad-signup-panel">
                    <h1>Let{`'`}s Get Started</h1>
                    <p>Create your account.</p>
                    <div>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label className="control-label">First Name</label>
                                <input
                                    value={this.state.firstName}
                                    type="text"
                                    name="firstName"
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="control-label">Last Name</label>
                                <input
                                    value={this.state.lastName}
                                    type="text"
                                    name="lastName"
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="control-label">Email</label>
                                <input
                                    value={this.state.email}
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="control-label">Password</label>
                                <input
                                    value={this.state.password}
                                    onChange={this.onChange}
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    id="last"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <button className={this.state.active}>
                                    Next
                                </button>
                            </div>
                        </form>
                    </div>
                    </Panel>
                </div>
            </div>
        );
    }
};

export default SponsorForm;
