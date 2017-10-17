import React, { Component } from 'react';
import { Grid, Row, Col, Jumbotron, Button } from 'react-bootstrap';
import { browserHistory } from 'react-router';

class ContactForm extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.baseState = this.state;
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleSendMessage = this.handleSendMessage.bind(this);
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    onSubmit(e) {
        e.preventDefault();
        this.handleSendMessage();
        this.setState(this.baseState);
        browserHistory.push('/');
    }
    handleSendMessage() {
        const message = {
            name: this.state.contactName,
            email: this.state.contactEmail,
            message: this.state.contactMessage
        };

        fetch('/contactForm', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: this.state.contactName,
                email: this.state.contactEmail,
                message: this.state.contactMessage
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.success) {
                this.setState({formSent: true})
            }
            else this.setState({formSent: false})
        })
        .catch((error) => {
            console.error(error);
        });
    }
    render() {
        return (
            <div className="contact">
                <Jumbotron className="contact-header">
                    <h1>Contact Us</h1>
                    <p>How can we help you? Reach out to us by filling the form below.</p>
                </Jumbotron>
                <div className="contactform">
                    <Grid>
                        <Row>
                            <Col md={6}>
                                <form onSubmit={this.onSubmit}>
                                    <div className="contactinput form-group">
                                        <label className="control-label">Name</label>
                                        <input
                                            value={this.state.contactName}
                                            onChange={this.onChange}
                                            type="text"
                                            name="contactName"
                                            className="form-control"
                                            placeholder="Enter your Name"
                                        />
                                    </div>

                                    <div className="contactinput form-group">
                                        <label className="control-label">Email</label>
                                        <input
                                            value={this.state.contactEmail}
                                            onChange={this.onChange}
                                            type="email"
                                            name="contactEmail"
                                            className="form-control"
                                            placeholder="Enter your Email"
                                        />
                                    </div>

                                    <div className="contactinput form-group">
                                        <label className="control-label">Message</label>
                                        <textarea
                                            value={this.state.contactMessage}
                                            onChange={this.onChange}
                                            type="text"
                                            name="contactMessage"
                                            className="form-control contactmessage"
                                            placeholder="Ask us anything..."
                                        />
                                    </div>

                                    <div className="form-group">
                                        <button className="contactsend btn btn-info btn-lg hvr-bounce-in">
                                            Send
                                        </button>
                                    </div>
                                </form>
                            </Col>
                            <Col md={6}>
                                <h2>Or contact us directly:</h2>
                                <p><i className="fa fa-envelope" aria-hidden="true"></i> contact@excursion-ar.com</p>
                                <p className="address"><i className="fa fa-building" aria-hidden="true"></i> San Francisco Bay Area</p>
                            </Col>
                        </Row>
                    </Grid>
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

export default ContactForm;
