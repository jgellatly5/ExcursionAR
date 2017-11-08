import React, { Component } from 'react';
import {Grid, Row, Col, Panel, Jumbotron, Button, Modal, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

class Screen_1_0 extends Component{
    constructor(props) {
        super(props);
        this.state = {

        }
        this.baseState = this.state;
    }
    render() {
        return (
            <div className="choose-path">
                <div className="container">
                    <h1>Welcome to Excursion</h1>
                    <p>Please choose the following:</p>
                    <Grid>
                        <Row>
                            <Col xs={6}>
                                <Panel className="choose-path-panel">
                                    <i className="fa fa-clock-o big gradient-icon" aria-hidden="true"></i>
                                    <p className="path">I want to advertise my business.</p>
                                    <p className="desc">Excursion rocks!</p>
                                    <Button bsStyle="info" onClick={this.openDev} className="choose-path-button hvr-grow">
                                        Let{`'`}s Get Started
                                    </Button>
                                </Panel>
                            </Col>
                            <Col xs={6} className="choose-path-panel">
                                <Panel>
                                    <i className="fa fa-clock-o big gradient-icon" aria-hidden="true"></i>
                                    <p className="path">I want to monetize my business.</p>
                                    <p className="desc">Excursion rocks!</p>
                                    <Button bsStyle="info" onClick={this.openDev} className="choose-path-button hvr-grow">
                                        Let{`'`}s Get Started
                                    </Button>
                                </Panel>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </div>
        );
    }
};

export default Screen_1_0;
