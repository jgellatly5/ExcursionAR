import React, { Component } from 'react';
import { Panel, Tooltip, OverlayTrigger } from 'react-bootstrap';

class SponsorForm extends Component{
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.endScreen = this.endScreen.bind(this);
    }
    onChange(e) {
        let button = this.refs.button;
        let firstName = this.firstNameInput.value;
        let lastName = this.lastNameInput.value;
        let email = this.emailInput.value;
        let password = this.passwordInput.value;
        // String must contain at least one character in front of the @ symbol, an @ symbol
        // a character after the @ symbol, a ., and a character after the .
        let regex = /(\w+?@\w+?\x2E.+)/;
        if (this.firstName !== '' && lastName !== '' && email !== '' && regex.test(email) && password !== '' && password.length > 7) {
            button.classList.add('active', 'hvr-grow');
            button.removeAttribute('disabled');
        } else {
            button.classList.remove('active', 'hvr-grow');
            button.setAttribute('disabled','disabled');
        }
    }
    endScreen(e) {
        let nextScreen = this.props.screenId + 1;
        let firstName = this.firstNameInput.value;
        let lastName = this.lastNameInput.value;
        let email = this.emailInput.value;
        this.props.handler(e, nextScreen, firstName, lastName, email);
    }
    componentDidMount() {
        let button = this.refs.button;
        button.setAttribute('disabled','disabled');
    }
    render() {
        const tooltip_email = (
            <Tooltip id="tooltip">Must be a valid email address</Tooltip>
        );
        const tooltip_password = (
            <Tooltip id="tooltip">Must contain at least 8 characters</Tooltip>
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
                                    value={this.props.firstName}
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
                                    value={this.props.lastName}
                                    onChange={this.onChange}
                                    type="text"
                                    name="lastName"
                                    className="form-control"
                                    ref={(input) => { this.lastNameInput = input }}
                                    required
                                />
                            </div>

                            {/*TODO Extract this field for separate login validation*/}
                            <div className="form-group">
                                <label className="control-label">Email</label>
                                <OverlayTrigger placement="right" overlay={tooltip_email}>
                                    <input
                                        value={this.props.email}
                                        onChange={this.onChange}
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        ref={(input) => { this.emailInput = input }}
                                        required
                                    />
                                </OverlayTrigger>
                            </div>

                            {/*TODO Extract this field for separate login validation*/}
                            <div className="form-group">
                                <label className="control-label">Password</label>
                                <OverlayTrigger placement="right" overlay={tooltip_password}>
                                    <input
                                        value={this.props.password}
                                        onChange={this.onChange}
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        ref={(input) => { this.passwordInput = input }}
                                        id="last"
                                        required
                                    />
                                </OverlayTrigger>
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
