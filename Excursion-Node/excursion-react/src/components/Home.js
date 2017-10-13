import React, { Component } from 'react';
import {Grid, Row, Col, Panel, Jumbotron, Button, Modal, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import { Link } from 'react-router';
// import success from '../../api/success';
// import failure from '../../api/failure';
// import { Bert } from 'meteor/themeteorchef:bert';
import { LinkContainer } from 'react-router-bootstrap';

class Home extends Component{
    constructor(props) {
        super(props);
        this.state = {
            showContact: false,
            showDev: false
        }
        this.baseState = this.state;
        this.close = this.close.bind(this);
        this.openContact = this.openContact.bind(this);
        this.openDev = this.openDev.bind(this);
        this.onSubmitContact = this.onSubmitContact.bind(this);
        this.onSubmitDev = this.onSubmitDev.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleSendMessage = this.handleSendMessage.bind(this);
        this.handleDevForm = this.handleDevForm.bind(this);
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    onSubmitContact(e) {
        e.preventDefault();
        this.handleSendMessage();
        console.log("submitted contact");
        this.setState(this.baseState);
    }
    onSubmitDev(e) {
        e.preventDefault();
        this.handleDevForm();
        this.setState(this.baseState);
    }
    handleSendMessage() {
        console.log("handling message");
        const message = {
            name: this.state.contactName,
            email: this.state.contactEmail,
            message: this.state.contactMessage
        };

        // Meteor.call('messages.sendMessage', message, (error) => {
        //     if (error) {
        //         Bert.alert(error.reason, 'danger');
        //     } else {
        //         close();
        //         Bert.alert('Thank you for your message! We will be in touch.', 'success');
        //     }
        // });
    }
    handleDevForm() {
        const message = {
            name: this.state.devName,
            email: this.state.devEmail,
            companyName: this.state.devCompany,
            website: this.state.devWebsite,
            storeLink: this.state.devStoreLink,
            refer: this.state.devRefer,
            message: this.state.devMessage
        };

        // Meteor.call('messages.sendDevKit', message, (error) => {
        //     if (error) {
        //         Bert.alert(error.reason, 'danger');
        //     } else {
        //         close();
        //         Bert.alert('Thanks for signing up! We will reach out to you shortly.', 'success');
        //     }
        // });
    }
    close() {
        this.setState({showContact: false, showDev: false});
    }
    openContact() {
        this.setState({showContact: true});
    }
    openDev() {
        this.setState({showDev: true});
    }
    render() {
        return (
            <div>
                <div id="headerwrap"></div>
                <div className="greywrap">
                    <Jumbotron bsClass="description">
                        <h1>A powerful tool for incorporating advertisments into augmented reality apps!</h1>
                        <p>
                            <LinkContainer to="/learnMore">
                                <Button bsStyle="info" className="hvr-grow">
                                    Learn More
                                </Button>
                            </LinkContainer>
                        </p>
                    </Jumbotron>
                    <Modal show={this.state.showContact} onHide={this.close}>
                        <Modal.Header closeButton className="modalhead">
                            <Modal.Title>Contact Us</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h4 className="modal-header">We would like to hear from you!</h4>
                            <p className="modal-para">Reach out to us about incorporating Excursion into your next project.</p>

                            <form onSubmit={this.onSubmitContact} id="contact">
                                <div className="form-group">
                                    <label className="control-label"><i className="fa fa-user" aria-hidden="true"></i> Name</label>
                                    <input
                                        value={this.state.contactName}
                                        onChange={this.onChange}
                                        type="text"
                                        name="contactName"
                                        className="form-control"
                                        placeholder="Enter your Name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="control-label"><i className="fa fa-envelope" aria-hidden="true"></i> Email</label>
                                    <input
                                        value={this.state.contactEmail}
                                        onChange={this.onChange}
                                        type="email"
                                        name="contactEmail"
                                        className="form-control"
                                        placeholder="Enter your Email"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="control-label">Message</label>
                                    <textarea
                                        value={this.state.contactMessage}
                                        onChange={this.onChange}
                                        type="text"
                                        name="contactMessage"
                                        className="form-control"
                                        placeholder="Ask us anything..."
                                    />
                                </div>

                                <div className="form-group">
                                    <button className="contactsend btn btn-info btn-lg hvr-bounce-in">
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.close}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
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
                        {/*TODO re-style SDK registration*/}
                        <Modal show={this.state.showDev} onHide={this.close}>
                            <Modal.Header closeButton className="modalhead">
                                <Modal.Title>Beta Registration</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="sdkform">
                                <h4 className="modal-header">Be the first to use the Excursion SDK!</h4>
                                <p className="modal-para">We will notify you when Excursion is ready.</p>

                                <form onSubmit={this.onSubmitDev} id="contact">
                                    <div className="form-group">
                                        <label className="control-label"><i className="fa fa-user" aria-hidden="true"></i> Full Name</label>
                                        <input
                                            value={this.state.devName}
                                            onChange={this.onChange}
                                            type="text"
                                            name="devName"
                                            className="form-control"
                                            placeholder="Enter your Name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="control-label"><i className="fa fa-envelope" aria-hidden="true"></i> Email</label>
                                        <input
                                            value={this.state.devEmail}
                                            onChange={this.onChange}
                                            type="email"
                                            name="devEmail"
                                            className="form-control"
                                            placeholder="Enter your Email"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="control-label"><i className="fa fa-building" aria-hidden="true"></i> Company Name</label>
                                        <input
                                            value={this.state.devCompany}
                                            onChange={this.onChange}
                                            type="text"
                                            name="devCompany"
                                            className="form-control"
                                            placeholder="Enter Company Name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="control-label"><i className="fa fa-television" aria-hidden="true"></i> Website</label>
                                        <input
                                            value={this.state.devWebsite}
                                            onChange={this.onChange}
                                            type="url"
                                            name="devWebsite"
                                            className="form-control"
                                            placeholder="http://"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="control-label"><i className="fa fa-mobile" aria-hidden="true"></i> App Store Link to AR App</label>
                                        <input
                                            value={this.state.devStoreLink}
                                            onChange={this.onChange}
                                            type="url"
                                            name="devStoreLink"
                                            className="form-control"
                                            placeholder="http://"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="control-label"><i className="fa fa-handshake-o" aria-hidden="true"></i> How did you hear about us?</label>
                                        <input
                                            value={this.state.devRefer}
                                            onChange={this.onChange}
                                            type="text"
                                            name="devRefer"
                                            className="form-control"
                                            placeholder="Referral?"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="control-label">Message</label>
                                        <textarea
                                            value={this.state.devMessage}
                                            onChange={this.onChange}
                                            type="text"
                                            name="devMessage"
                                            className="form-control"
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>

                                    <div className="form-group">
                                        <button className="contactsend btn btn-info btn-lg hvr-bounce-in">
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={this.close}>Close</Button>
                            </Modal.Footer>
                        </Modal>
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

export default Home;
