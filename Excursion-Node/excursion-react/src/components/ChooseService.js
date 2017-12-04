import React, { Component } from 'react';
import {Grid, Row, Col, Panel, Button} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class ChooseService extends Component{
    render() {
        return (
            <div className="ad-signup-container">
                <div className="ad-signup">
                    <Panel className="ad-signup-panel">
                    <h1>Choose what service you would like to use</h1>
                    <p>Choose from our own ads or create and submit your own.</p>
                    <div className="container choose-service">
                        <Grid>
                            <Row>
                                <Col xs={6}>
                                    <Panel className="choose-service-panel">
                                        <img src={require("../blank.png")} className="icon-speaker"/>
                                        <p className="desc">I am addicted to Chinese food</p>
                                        <p className="desc">I am addicted to Chinese food</p>
                                        <p className="desc">I am addicted to Chinese food</p>
                                    </Panel>
                                </Col>
                                <Col xs={6} className="choose-service-panel">
                                    <Panel>
                                        <img src={require("../blank.png")} className="icon-phone"/>
                                        <p className="desc">I am addicted to Chinese food</p>
                                        <p className="desc">I am addicted to Chinese food</p>
                                        <p className="desc">I am addicted to Chinese food</p>
                                    </Panel>
                                </Col>
                            </Row>
                        </Grid>
                        <div className="form-group">
                            <button className="btn btn-lg" ref="button" onClick={this.endScreen}>
                                Back
                            </button>
                            <button className="btn btn-lg" ref="button" onClick={this.endScreen}>
                                Next
                            </button>
                        </div>
                    </div>
                    </Panel>
                </div>
            </div>
        );
    }
};

export default ChooseService;
