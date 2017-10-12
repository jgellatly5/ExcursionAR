import React, { Component } from 'react';
// import login from '../../api/login';
// import success from '../../api/success';
// import failure from '../../api/failure';
import { Jumbotron } from 'react-bootstrap';
// import { Link } from 'react-router';

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginUsername: '',
            loginPassword: ''
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
        // login(success, failure);
        this.setState(this.baseState);
    }
    render() {
        return (
            <div>
                <Jumbotron>
                    <h3 className="registration">Login to Excursion</h3>
                    <p className="registration">Login to access your advertising dashboard, view daily budget, and monitor ad performance.</p>
                </Jumbotron>
                <div className="login">
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label className="control-label">Username</label>
                            <input
                                value={this.state.loginUsername}
                                onChange={this.onChange}
                                type="text"
                                name="loginUsername"
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label className="control-label">Password</label>
                            <input
                                value={this.state.loginPassword}
                                onChange={this.onChange}
                                type="password"
                                name="loginPassword"
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <button className="btn btn-info btn-lg">
                                Log in
                            </button>
                            {/*<Link className="register" to="/signup">Register for an Account</Link>*/}
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

export default LoginForm;
