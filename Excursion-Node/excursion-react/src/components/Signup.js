import React, { Component } from 'react';
import {Grid, Row, Col, Panel, Button} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class Signup extends Component{
    render() {
        const nextScreen = 1;
        return (
            <div className="choose-path">
                <div className="container">
                    <h1>Welcome to Excursion</h1>
                    <p>Please choose the following:</p>
                    <Grid>
                        <Row>
                            <Col xs={6}>
                                <Panel className="choose-path-panel">
                                    <img src={require("../blank.png")} className="icon-speaker"/>
                                    <p className="path">I want to advertise my business.</p>
                                    <p className="desc">Excursion rocks!</p>
                                    <LinkContainer to="/sponsor">
                                        <Button bsStyle="info" className="choose-path-button hvr-grow">
                                            Let{`'`}s Get Started
                                        </Button>
                                    </LinkContainer>
                                </Panel>
                            </Col>
                            <Col xs={6} className="choose-path-panel">
                                <Panel>
                                    <img src={require("../blank.png")} className="icon-phone"/>
                                    <p className="path">I want to monetize my business.</p>
                                    <p className="desc">Excursion rocks!</p>
                                    <Button bsStyle="info" className="choose-path-button hvr-grow">
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

export default Signup;
