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
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
        if (this.state.firstName != undefined && this.state.lastName != undefined && this.state.email != undefined && this.state.password != undefined) {
            this.setState({
                active: 'btn btn-lg active hvr-grow'
            });
        }
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
                                    onChange={this.onChange}
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
                                    onChange={this.onChange}
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
                                    onChange={this.onChange}
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    title="Please enter a valid email address."
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
