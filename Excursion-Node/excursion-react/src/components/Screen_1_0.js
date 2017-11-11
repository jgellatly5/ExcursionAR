import React, { Component } from 'react';
import {Grid, Row, Col, Panel, Button} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class Screen_1_0 extends Component{
    render() {
        return (
            <div className="choose-path">
                <h1>Welcome to Excursion</h1>
                <p>Please choose the following:</p>
                <Grid>
                    <Row>
                        <Col xs={6}>
                            <Panel className="choose-path-panel">
                                <i className="fa fa-clock-o big gradient-icon" aria-hidden="true"></i>
                                <p className="path">I want to advertise my business.</p>
                                <p className="desc">Excursion rocks!</p>
                                <LinkContainer to="/screen_1_1">
                                    <Button bsStyle="info" className="choose-path-button hvr-grow">
                                        Let{`'`}s Get Started
                                    </Button>
                                </LinkContainer>
                            </Panel>
                        </Col>
                        <Col xs={6} className="choose-path-panel">
                            <Panel>
                                <i className="fa fa-clock-o big gradient-icon" aria-hidden="true"></i>
                                <p className="path">I want to monetize my business.</p>
                                <p className="desc">Excursion rocks!</p>
                                <LinkContainer to="/screen_1_1">
                                    <Button bsStyle="info" className="choose-path-button hvr-grow">
                                        Let{`'`}s Get Started
                                    </Button>
                                </LinkContainer>
                            </Panel>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
};

export default Screen_1_0;
