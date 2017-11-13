import React, { Component } from 'react';
import { Grid, Row, Col, Panel, Jumbotron, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class GetStarted extends Component{
    render() {
        return (
            <div className="learnmore">
                <Jumbotron className="learnmore-header">
                    <h1 className="getstarted">Get Started</h1>
                    <p className="getstarted">Ready to begin your ad journey with Excursion? Read our
                    three easy steps to start displaying ads.</p>
                </Jumbotron>
                <Panel>
                <h1>Reach your audience in 3 easy steps</h1>
                    <Grid>
                        <Row>
                            <Col xs={4}>
                                <i className="fa fa-calculator big gradient-icon" aria-hidden="true"></i>
                                <h4>1. Set The Ad Budget</h4>
                                <p>
                                    Determine your budget for your next ad campaign.
                                    If you go over, we will use your previous funds to offset it.
                                </p>
                            </Col>
                            <Col xs={4}>
                                <i className="fa fa-gavel big gradient-icon" aria-hidden="true"></i>
                                <h4>2. Bid For The Ad Spot</h4>
                                <p>
                                    You must place the cost-of-impression you are willing to spend
                                    on the particular ad. Each ad will be ranked on this cost and the quality of the ad.
                                </p>
                            </Col>
                            <Col xs={4}>
                                <i className="fa fa-bar-chart big gradient-icon" aria-hidden="true"></i>
                                <h4>3. Track The Performance</h4>
                                <p>
                                    In your dashboard, you can view the performance of the ad
                                    and decide whether to continue rendering the ad or allocate funding elsewhere.
                                </p>
                            </Col>
                        </Row>
                    </Grid>
                <div>
                    <LinkContainer to="/signup">
                        <Button bsStyle="info" className="hvr-grow adv">
                            Sponsor Signup
                        </Button>
                    </LinkContainer>
                </div>
                </Panel>
                <div className="greywrap">
                    <Jumbotron className="contactfooter">
                        <h1>Still have questions?</h1>
                        <p>
                            <LinkContainer to="/contact">
                                <Button bsStyle="primary" className="contactbutton hvr-grow">
                                    Contact Us
                                </Button>
                            </LinkContainer>
                        </p>
                    </Jumbotron>
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

export default GetStarted;
