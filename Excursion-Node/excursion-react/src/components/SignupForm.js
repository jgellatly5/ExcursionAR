import React, { Component } from 'react';
// import signup from '../../api/signup';
// import success from '../../api/success';
// import failure from '../../api/failure';
// import { Bert } from 'meteor/themeteorchef:bert';
import { Jumbotron } from 'react-bootstrap';
// import { Link } from 'react-router';

class SignupForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            passwordConfirmation: '',
        }
        this.baseState = this.state;
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    onSubmit(e) {
        e.preventDefault();
        // signup(success, failure);
        this.setState(this.baseState);
    }
    render() {
        return (
            <div>
                <Jumbotron>
                    <h2 className="registration">Advertisers - Register for Excursion</h2>
                    <p className="registration">When you sign up for Excursion, you can begin the ad bidding process and set your budget for your next campaign.</p>
                </Jumbotron>
                <div className="signup">
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label className="control-label">Username</label>
                            <input
                                value={this.state.username}
                                onChange={this.onChange}
                                type="text"
                                name="username"
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label className="control-label">Email</label>
                            <input
                                value={this.state.email}
                                onChange={this.onChange}
                                type="text"
                                name="email"
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label className="control-label">Password</label>
                            <input
                                value={this.state.password}
                                onChange={this.onChange}
                                type="password"
                                name="password"
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label className="control-label">Password Confirmation</label>
                            <input
                                value={this.state.passwordConfirmation}
                                onChange={this.onChange}
                                type="password"
                                name="passwordConfirmation"
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <button className="btn btn-info btn-lg">
                                Sign up
                            </button>
                            {/*<Link className="signup" to="/login">Login to Excursion</Link>*/}
                        </div>
                    </form>
                </div>
                <footer className="footer-distributed">
                <hr/>
        			<div className="footer-right">
        				<a href="#" className="hvr-grow"><i className="fa fa-facebook"></i></a>
        				<a href="#" className="hvr-grow"><i className="fa fa-twitter"></i></a>
        				<a href="#" className="hvr-grow"><i className="fa fa-linkedin"></i></a>
        				<a href="#" className="hvr-grow"><i className="fa fa-github"></i></a>
        			</div>
        			<div className="footer-left">
        				<p className="footer-links">
        					<a href="/" className="hvr-underline-from-left">Home</a>
        					|
                            <a href="/learnMore" className="hvr-underline-from-left">FAQ</a>
        					|
        					<a href="/getStarted" className="hvr-underline-from-left">Get Started</a>
        					|
        					<a href="#" className="hvr-underline-from-left">API Docs</a>
        					|
        					<a href="/contact" className="hvr-underline-from-left">Contact</a>
        				</p>
        				<p>Excursion &copy; 2017</p>
        			</div>
                </footer>
            </div>
        );
    }
};

export default SignupForm;
