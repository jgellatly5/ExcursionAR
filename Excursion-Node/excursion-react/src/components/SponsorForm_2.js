import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';

class SponsorForm_2 extends Component{
    constructor(props) {
        super(props);
        this.state = {};
        this.baseState = this.state;
    }
    render() {
        const nextScreen = 3;
        return (
            <div className="ad-signup-container">
                <div id={this.state.screen1_2} className={'ad-signup' + ' ' + this.state.anim}>
                    <Panel className="ad-signup-panel">
                    <h1>What is your business?</h1>
                    <p>Fill out information about your business.</p>
                    <div>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label className="control-label">Company Name</label>
                                <input
                                    value={this.state.companyName}
                                    onChange={this.onChange}
                                    type="text"
                                    name="companyName"
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label className="control-label">Industry</label>
                                <input
                                    value={this.state.industry}
                                    onChange={this.onChange}
                                    type="text"
                                    name="industry"
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label className="control-label">Phone Number</label>
                                <input
                                    value={this.state.phoneNumber}
                                    onChange={this.onChange}
                                    type="text"
                                    name="phoneNumber"
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label className="control-label">Website</label>
                                <input
                                    value={this.state.website}
                                    onChange={this.onChange}
                                    type="text"
                                    name="website"
                                    className="form-control"
                                    id="last"
                                />
                            </div>

                            <div className="form-group">
                                <button className="btn btn-lg" ref="button" onClick={(e) => this.props.handler(e, nextScreen)}>
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

export default SponsorForm_2;
