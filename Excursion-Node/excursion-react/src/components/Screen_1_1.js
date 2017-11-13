import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';

class Screen_1_1 extends Component{
    constructor(props) {
        super(props);
        this.state = {};
        this.baseState = this.state;
    }
    render() {
        const nextScreen = 2;
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
                                <button className="btn btn-lg" onClick={(e) => this.props.handler(e, nextScreen)}>
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
