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
            <div>
                <div>
                    <div className="greywrap first">
                        <Panel>
                        <h1>A new computing revolution in advertising...</h1>
                            <Grid>
                                <Row>
                                    <Col xs={4}>
                                        <i className="fa fa-map-o big gradient-icon" aria-hidden="true"></i>
                                        <h4>Creating Immersive Ads</h4>
                                        <p>Host 3-Dimensional advertisements in your augmented reality applications and collect payment from views.
                                        </p>
                                    </Col>
                                    <Col xs={4} className="context">
                                        <i className="fa fa-clock-o big gradient-icon" aria-hidden="true"></i>
                                        <h4>Contextual Placement</h4>
                                        <p>Our SDK provides flexibility for publishers to anchor 3-Dimensional ads in their augmented reality environments.
                                        </p>
                                    </Col>
                                    <Col xs={4} className="monetize">
                                        <i className="fa fa-money big gradient-icon" aria-hidden="true"></i>
                                        <h4>Monetize Your Application</h4>
                                        <p>Get paid to show advertisements to your application{`'`}s users.
                                        </p>
                                    </Col>
                                </Row>
                            </Grid>
                        <div>
                            <Button bsStyle="info" onClick={this.openDev} className="sdk hvr-grow">
                                Signup for the Excursion SDK!
                            </Button>
                        </div>
                        </Panel>
                    </div>
                    <div className="greywrap second">
                        {/*<video preload="preload" autoPlay="autoPlay" loop="loop">
                            <source src="video/excursionPrototype.mp4" type="video/mp4"></source>
                        </video>*/}

                        <Jumbotron bsClass="altbg">
                            <h1>Proof of Concept/Demo</h1>
                            <iframe width="1000" height="600" src="https://www.youtube.com/embed/irljsEAt8YE?rel=0&amp;controls=0&amp;showinfo=0" frameBorder="0" allowFullScreen></iframe>
                        </Jumbotron>
                        <Panel>
                        <h1>Bringing sponsors and publishers together...</h1>
                            <Grid>
                                <Row>
                                    <Col xs={4}>
                                        <i className="fa fa-users big gradient-icon" aria-hidden="true"></i>
                                        <h4>Sponsors</h4>
                                        <p>Sign up today to begin displaying your ads in augmented reality.
                                        Become a part of the digital reality revolution.
                                        </p>
                                    </Col>
                                    <Col xs={4}>
                                        <i className="fa fa-file-image-o big gradient-icon" aria-hidden="true"></i>
                                        <h4>Cost-Per-Impression</h4>
                                        <p>Set a budget and bid for a price cost to display your advertisement.
                                        This is the price you pay when someone interacts with your ad.
                                        </p>
                                    </Col>
                                    <Col xs={4}>
                                        <i className="fa fa-tachometer big gradient-icon" aria-hidden="true"></i>
                                        <h4>Dashboard</h4>
                                        <p>Upload your ad and monitor its performance over time. Your ad will be the first of its kind to enter
                                         the 3 dimensional realm.
                                        </p>
                                    </Col>
                                </Row>
                            </Grid>
                        <div>
                            <LinkContainer to="/getStarted">
                                <Button bsStyle="info" className="hvr-grow adv">
                                    Sponsors - Get Started
                                </Button>
                            </LinkContainer>
                        </div>
                        </Panel>
                    </div>
                    <div className="greywrap">
                        <Jumbotron className="contactfooter">
                            <h1>Incorporate your next ad with Excursion!</h1>
                            <p>
                                <LinkContainer to="/contact">
                                    <Button bsStyle="primary" className="contactbutton hvr-grow">
                                        Contact Us
                                    </Button>
                                </LinkContainer>
                            </p>
                        </Jumbotron>
                    </div>
                </div>
                <footer className="footer-distributed">
                <hr/>
        			{/*<div className="footer-right">
        				<a href="#" className="hvr-grow"><i className="fa fa-facebook"></i></a>
        				<a href="#" className="hvr-grow"><i className="fa fa-twitter"></i></a>
        				<a href="#" className="hvr-grow"><i className="fa fa-linkedin"></i></a>
        				<a href="#" className="hvr-grow"><i className="fa fa-github"></i></a>
        			</div>*/}
        			<div className="footer-left">
        				<p className="footer-links">
        					<a href="/" className="hvr-underline-from-left-white">Home</a>
        					|
                            <a href="/learnMore" className="hvr-underline-from-left-white">FAQ</a>
        					|
        					<a href="/getStarted" className="hvr-underline-from-left-white">Get Started</a>
        					{/*|
        					<a href="#" className="hvr-underline-from-left">API Docs</a>*/}
        					|
        					<a href="/contact" className="hvr-underline-from-left-white">Contact</a>
        				</p>
        				<p>Excursion &copy; 2017</p>
        			</div>
                </footer>
            </div>
        );
    }
};

export default Screen_1_0;
