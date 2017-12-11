import React, { Component } from 'react';
import { Panel, Tooltip, OverlayTrigger } from 'react-bootstrap';

class SponsorForm_BusinessInformation extends Component{
    constructor(props) {
        super(props);
        this.state = {
            companyName: '',
            industry: '',
            phoneNumber: '',
            website: ''
        };
        this.onChange = this.onChange.bind(this);
        this.endScreen = this.endScreen.bind(this);
        this.formatNumber = this.formatNumber.bind(this);
    }
    onChange(e) {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
        let button = this.refs.button;
        let companyName = this.companyNameInput.value;
        let industry = this.industryInput.value;
        let phoneNumber = this.phoneNumberInput.value;
        let website = this.websiteInput.value;
        if (companyName !== '' && industry !== '' && phoneNumber !== '' && website !== '') {
            button.classList.add('active', 'hvr-grow');
            button.removeAttribute('disabled');
        } else {
            button.classList.remove('active', 'hvr-grow');
            button.setAttribute('disabled','disabled');
        }
    }
    endScreen(e) {
        let website = this.websiteInput.value;
        if (website.includes(".")) {
            let nextScreen = this.props.screenId + 1;
            this.props.handler(e, nextScreen);
        }
    }
    formatNumber() {
        let phoneNumber = this.phoneNumberInput.value,
        r = /(\D+)/g,
        npa = '',
        nxx = '',
        last4 = '';
        if (phoneNumber !== '') {
            phoneNumber = phoneNumber.replace(r, '');
            npa = phoneNumber.substr(0, 4);
            if (npa.length == 4) {
                npa = npa.substr(0, 3) + '-' + npa.charAt(3);
            }
            nxx = phoneNumber.substr(4, 2);
            if (nxx.length == 2) {
                nxx = nxx.substr(0, 3) + '-' + nxx.charAt(3);
            }
            last4 = phoneNumber.substr(6, 4);
            phoneNumber = npa + nxx + last4;
            // phoneNumber = npa + nxx;
            this.setState({
                phoneNumber: phoneNumber
            });
        }
    }
    componentDidMount() {
        let button = this.refs.button;
        button.setAttribute('disabled','disabled');
    }
    render() {
        const tooltip_phoneNumber = (
            <Tooltip id="tooltip">Format: 000-000-0000</Tooltip>
        );
        const tooltip_url = (
            <Tooltip id="tooltip">Format: "https:// or http://"</Tooltip>
        );
        return (
            <div className="ad-signup-container">
                <div className="ad-signup">
                    <Panel className="ad-signup-panel">
                    <h1>What is your business?</h1>
                    <p>Fill out information about your business.</p>
                    <div>
                        <form>
                            <div className="form-group">
                                <label className="control-label">Company Name</label>
                                <input
                                    value={this.state.companyName}
                                    onChange={this.onChange}
                                    type="text"
                                    name="companyName"
                                    className="form-control"
                                    ref={(input) => { this.companyNameInput = input }}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="control-label">Industry</label>
                                <input
                                    value={this.state.industry}
                                    onChange={this.onChange}
                                    type="text"
                                    name="industry"
                                    className="form-control"
                                    ref={(input) => { this.industryInput = input }}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="control-label">Phone Number</label>
                                <OverlayTrigger placement="right" overlay={tooltip_phoneNumber}>
                                    <input
                                        value={this.state.phoneNumber}
                                        onChange={this.onChange}
                                        type="tel"
                                        name="phoneNumber"
                                        className="form-control"
                                        pattern='\d{3}[\-]\d{3}[\-]\d{4}'
                                        onKeyUp={this.formatNumber}
                                        ref={(input) => { this.phoneNumberInput = input }}
                                        required
                                    />
                                </OverlayTrigger>
                            </div>

                            <div className="form-group">
                                <label className="control-label">Website</label>
                                <OverlayTrigger placement="right" overlay={tooltip_url}>
                                <input
                                    value={this.state.website}
                                    onChange={this.onChange}
                                    type="url"
                                    name="website"
                                    pattern='^https?://'
                                    className="form-control"
                                    ref={(input) => { this.websiteInput = input }}
                                    required
                                    id="last"
                                />
                                </OverlayTrigger>
                            </div>

                            <div className="form-group">
                                <button className="btn btn-lg" ref="button" onClick={this.endScreen}>
                                    Next
                                </button>
                            </div>
                        </form>
                    </div>
                    </Panel>
                </div>
            </div>
        );
    }
};

export default SponsorForm_BusinessInformation;
