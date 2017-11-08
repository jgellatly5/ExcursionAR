import React, { Component } from 'react';
import {Grid, Row, Col, Panel, Button, Form, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

class Screen_1_1 extends Component{
    constructor(props) {
        super(props);
        this.state = {

        }
        this.baseState = this.state;
    }
    render() {
        return (
            <div>
                <div className="ad-signup">
                    <Panel className="ad-signup-panel">
                    <h1>Let{`'`}s Get Started</h1>
                    <p>Create Your Account</p>
                    <div>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label className="control-label">First Name</label>
                                <input
                                    value={this.state.firstName}
                                    onChange={this.onChange}
                                    type="text"
                                    name="firstName"
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label className="control-label">Last Name</label>
                                <input
                                    value={this.state.lastName}
                                    onChange={this.onChange}
                                    type="text"
                                    name="lastName"
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label className="control-label">Email</label>
                                <input
                                    value={this.state.email}
                                    onChange={this.onChange}
                                    type="text"
                                    name="email"
                                    className="form-control"
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
                                />
                            </div>

                            <div className="form-group">
                                <button className="btn btn-lg">
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

export default Screen_1_1;
