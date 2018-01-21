import React, { Component } from 'react';
import {Grid, Row, Col, Panel, Button} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class Signup extends Component{
    render() {
        return (
            <div className="choose-path">
                <div className="container">
                    <h1>Welcome to Excursion</h1>
                    <p>Please choose the following:</p>
                    <Grid>
                        <Row>
                            <Col xs={6} className="choose-path-panel">
                                <Panel>
                                    <img src={require("../blank.png")} alt="sponsorSignup" className="icon-speaker"/>
                                    <p className="path">I want to advertise my business.</p>
                                    <p className="desc">
                                        Provide us with general information about you and your company.
                                        Then select from our different ad formats and set the budget for your ad campaign.
                                    </p>
                                    <LinkContainer to="/sponsor">
                                        <Button bsStyle="info" className="choose-path-button hvr-grow">
                                            Let{`'`}s Get Started
                                        </Button>
                                    </LinkContainer>
                                </Panel>
                            </Col>
                            <Col xs={6} className="choose-path-panel">
                                <Panel>
                                    <img src={require("../blank.png")} alt="publisherSignup" className="icon-phone"/>
                                    <p className="path">I want to monetize my business.</p>
                                    <p className="desc">
                                        Provide us with information about your AR application and your company.
                                        Then we will provide you with the API keys and access to our SDK.
                                    </p>
                                    <LinkContainer to="/publisher">
                                        <Button bsStyle="info" className="choose-path-button hvr-grow">
                                            Let{`'`}s Get Started
                                        </Button>
                                    </LinkContainer>
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
