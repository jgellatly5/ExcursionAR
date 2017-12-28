import React, { Component } from 'react';
import { Panel, Tooltip, OverlayTrigger } from 'react-bootstrap';

class SponsorForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            email: this.props.email,
            password: ''
        }
        this.onChange = this.onChange.bind(this);
        this.endScreen = this.endScreen.bind(this);
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
        let button = this.refs.button;
        let firstName = this.firstNameInput.value;
        let lastName = this.lastNameInput.value;
        let email = this.emailInput.value;
        let password = this.passwordInput.value;
        if (firstName !== '' && lastName !== '' && email !== '' && email.includes("@") && password !== '') {
            button.classList.add('active', 'hvr-grow');
            button.removeAttribute('disabled');
        } else {
            button.classList.remove('active', 'hvr-grow');
            button.setAttribute('disabled','disabled');
        }
    }
    endScreen(e) {
        let email = this.emailInput.value;
        if (email.includes("@")) {
            let nextScreen = this.props.screenId + 1;
            let firstName = this.state.firstName;
            let lastName = this.state.lastName;
            this.props.handler(e, nextScreen, firstName, lastName, email);
        }
    }
    componentDidMount() {
        let button = this.refs.button;
        button.setAttribute('disabled','disabled');
    }
    render() {
        const tooltip_email = (
            <Tooltip id="tooltip">Must contain an @ symbol</Tooltip>
        );
        return (
            <div className="ad-signup-container">
                <div className="ad-signup">
                    <Panel className="ad-signup-panel sponsor-form">
                    <h1>Let{`'`}s Get Started</h1>
                    <p>Create your account.</p>
                    <div>
                        <form>
                            <div className="form-group">
                                <label className="control-label">First Name</label>
                                <input
                                    value={this.state.firstName}
                                    onChange={this.onChange}
                                    type="text"
                                    name="firstName"
                                    className="form-control"
                                    ref={(input) => { this.firstNameInput = input }}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="control-label">Last Name</label>
                                <input
                                    value={this.state.lastName}
                                    onChange={this.onChange}
                                    type="text"
                                    name="lastName"
                                    className="form-control"
                                    ref={(input) => { this.lastNameInput = input }}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="control-label">Email</label>
                                <OverlayTrigger placement="right" overlay={tooltip_email}>
                                    <input
                                        value={this.state.email}
                                        onChange={this.onChange}
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        ref={(input) => { this.emailInput = input }}
                                        required
                                    />
                                </OverlayTrigger>
                            </div>

                            <div className="form-group">
                                <label className="control-label">Password</label>
                                <input
                                    value={this.state.password}
                                    onChange={this.onChange}
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    ref={(input) => { this.passwordInput = input }}
                                    id="last"
                                    required
                                />
                            </div>
                        </form>
                        <div className="bottom-form">
                            <button className="btn btn-lg" ref="button" onClick={this.endScreen}>
                                Next
                            </button>
                        </div>
                    </div>
                    </Panel>
                </div>
            </div>
        );
    }
};

export default SponsorForm;
