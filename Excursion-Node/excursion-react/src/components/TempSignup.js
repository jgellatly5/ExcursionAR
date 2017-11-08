import React, { Component } from 'react';
import { Jumbotron, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { browserHistory } from 'react-router';

class TempSignup extends Component {
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
        fetch('https://ns8ytd9vbl.execute-api.us-east-1.amazonaws.com/dev/sendAdEmail', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Request-Headers' : '*'
            },
            body: JSON.stringify({
                name: this.state.contactName,
                email: this.state.contactEmail,
                phone: this.state.phoneNumber,
                company: this.state.companyName,
                // industry: this.state.industry,
                website: this.state.website,
                referral: this.state.referral
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
            <div>
                <Jumbotron className="signup-header">
                    <h1 className="registration">Sign Up for Excursion!</h1>
                    <p>The platform is currently in development...</p>
                    <p>We will get back to you very soon.</p>
                </Jumbotron>
                <div className="adform">
                    <form onSubmit={this.onSubmit}>
                        <div className="formcolumn">
                            <div className="form-group">
                                <label className="control-label"><i className="fa fa-user" aria-hidden="true"></i> Contact Name</label>
                                <input
                                    value={this.state.contactName}
                                    onChange={this.onChange}
                                    type="text"
                                    name="contactName"
                                    className="form-control"
                                    placeholder="Enter your Name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="control-label"><i className="fa fa-building" aria-hidden="true"></i> Company Name</label>
                                <input
                                    value={this.state.companyName}
                                    onChange={this.onChange}
                                    type="text"
                                    name="companyName"
                                    className="form-control"
                                    placeholder="Enter Company Name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="control-label"><i className="fa fa-phone" aria-hidden="true"></i> Phone Number</label>
                                <input
                                    value={this.state.phoneNumber}
                                    onChange={this.onChange}
                                    type="number"
                                    name="phoneNumber"
                                    className="form-control"
                                    placeholder="Enter Phone Number"
                                    required
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
                                    required
                                />
                            </div>
                        </div>
                        <div className="formcolumn">
                            <FormGroup controlId="formControlsSelect">
                                <ControlLabel><i className="fa fa-industry" aria-hidden="true"></i> Industry</ControlLabel>
                                <FormControl className="list" componentClass="select" placeholder="Please select from the dropdown">
                                    <option value={this.state.industry} name="industry">Business&Information</option>
                                    <option value={this.state.industry} name="industry">Agriculture</option>
                                    <option value={this.state.industry} name="industry">Construction/Contracting</option>
                                    <option value={this.state.industry} name="industry">Education</option>
                                    <option value={this.state.industry} name="industry">Finance&Insurance</option>
                                    <option value={this.state.industry} name="industry">Food&Hospitality</option>
                                    <option value={this.state.industry} name="industry">Gaming</option>
                                    <option value={this.state.industry} name="industry">Health Services</option>
                                    <option value={this.state.industry} name="industry">Natural/Environmental</option>
                                    <option value={this.state.industry} name="industry">Other</option>
                                    <option value={this.state.industry} name="industry">Personal Services</option>
                                    <option value={this.state.industry} name="industry">Real Estate & Housing</option>
                                    <option value={this.state.industry} name="industry">Safety/Security & Legal</option>
                                    <option value={this.state.industry} name="industry">Transportation</option>
                                </FormControl>
                            </FormGroup>

                            <div className="form-group">
                                <label className="control-label"><i className="fa fa-television" aria-hidden="true"></i> Website</label>
                                <input
                                    value={this.state.website}
                                    onChange={this.onChange}
                                    type="url"
                                    name="website"
                                    className="form-control"
                                    placeholder="http://"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="control-label"><i className="fa fa-handshake-o" aria-hidden="true"></i> How did you hear about us?</label>
                                <input
                                    value={this.state.referral}
                                    onChange={this.onChange}
                                    type="text"
                                    name="referral"
                                    className="form-control"
                                    placeholder="Referral?"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <button className="btn btn-primary btn-lg hvr-bounce-in">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>
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

export default TempSignup;
