import React, { Component } from 'react';
import {Grid, Row, Col, Panel, Button, Form, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import Screen_1_2 from './Screen_1_2';

class Screen_1_1 extends Component{
    constructor(props) {
        super(props);
        this.state = {
            screen1_1: 'visible',
            screen1_2: 'hidden',
            anim: ''
        }
        this.baseState = this.state;
        this.toggleHidden = this.toggleHidden.bind(this);
    }
    toggleHidden(e) {
        e.preventDefault();
        this.setState({
            screen1_1: 'hidden',
            screen1_2: 'visible',
            anim: 'move-in-from-right'
        });
    }
    render() {
        return (
            <div className="ad-signup-container">
                <div id={this.state.screen1_1} className="ad-signup">
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
                                <button className="btn btn-lg" onClick={this.toggleHidden}>
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
