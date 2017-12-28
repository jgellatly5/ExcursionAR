import React, { Component } from 'react';
import { Panel, Tooltip, OverlayTrigger } from 'react-bootstrap';

class SponsorForm_BusinessInformation extends Component{
    constructor(props) {
        super(props);
        this.state = {
            companyName: this.props.companyName,
            industry: this.props.industry,
            phoneNumber: this.props.phoneNumber,
            website: this.props.website
        }
        this.onChange = this.onChange.bind(this);
        this.lastScreen = this.lastScreen.bind(this);
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
        if (companyName !== '' && industry !== '' && phoneNumber !== '' && phoneNumber.length > 11 && website !== '') {
            button.classList.add('active', 'hvr-grow');
            button.removeAttribute('disabled');
        } else {
            button.classList.remove('active', 'hvr-grow');
            button.setAttribute('disabled','disabled');
        }
    }
    lastScreen(e) {
        let nextScreen = this.props.screenId - 1;
        let firstName = this.props.firstName;
        let lastName = this.props.lastName;
        let email = this.props.email;
        let companyName = this.state.companyName;
        let industry = this.state.industry;
        let phoneNumber = this.state.phoneNumber;
        let website = this.state.website;
        let adName = this.props.adName;
        let genre = this.props.genre;
        let adFormat = this.props.adFormat;
        let dailyBudget = this.props.dailyBudget;
        let monthlyBudget = this.props.monthlyBudget;
        this.props.handler(e, nextScreen, firstName, lastName, email, companyName, industry, phoneNumber, website, adName, genre, adFormat, dailyBudget, monthlyBudget);
    }
    endScreen(e) {
        let website = this.websiteInput.value;
        if (website.includes(".")) {
            let nextScreen = this.props.screenId + 1;
            let firstName = this.props.firstName;
            let lastName = this.props.lastName;
            let email = this.props.email;
            let companyName = this.state.companyName;
            let industry = this.state.industry;
            let phoneNumber = this.state.phoneNumber;
            let adName = this.props.adName;
            let genre = this.props.genre;
            let adFormat = this.props.adFormat;
            let dailyBudget = this.props.dailyBudget;
            let monthlyBudget = this.props.monthlyBudget;
            this.props.handler(e, nextScreen, firstName, lastName, email, companyName, industry, phoneNumber, website, adName, genre, adFormat, dailyBudget, monthlyBudget);
        }
    }
    formatNumber() {
        let phoneNumber = this.phoneNumberInput.value,
        r = /(\D+)/g,
        areaCode = '',
        firstDigits = '',
        lastDigits = '';
        if (phoneNumber !== '') {
            // every input is required to be a number by the r expression
            phoneNumber = phoneNumber.replace(r, '');
            // areaCode waits for length of string to reach 4 characters, then adds hyphen in between character 3 and 4
            areaCode = phoneNumber.substr(0, 4);
            if (areaCode.length == 4) {
                areaCode = areaCode.substr(0, 3) + '-' + areaCode.charAt(3);
            }
            // firstDigits start at the 5th character of the whole string, waits for length to reach 3 characters, then adds hyphen in between character 2 and 3
            firstDigits = phoneNumber.substr(4, 3);
            if (firstDigits.length == 3) {
                firstDigits = firstDigits.substr(0, 2) + '-' + firstDigits.charAt(2);
            }
            // lastDigits start at the 8th character of the whole string, and ends string after adding 3 more characters
            lastDigits = phoneNumber.substr(7, 3);
            phoneNumber = areaCode + firstDigits + lastDigits;
            this.setState({
                phoneNumber: phoneNumber
            });
        }
    }
    componentDidMount() {
        let companyName = this.props.companyName;
        let industry = this.props.industry;
        let phoneNumber = this.props.phoneNumber;
        let website = this.props.website;
        let button = this.refs.button;
        if (companyName == undefined || industry == undefined || phoneNumber == undefined || website == undefined) {
            button.setAttribute('disabled','disabled');
        } else {
            button.classList.add('active', 'hvr-grow');
            button.removeAttribute('disabled');
        }
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
                    <Panel className="ad-signup-panel sponsor-form-two">
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
                        </form>
                        <div className="bottom-form">
                            <button className="btn btn-lg back hvr-grow" ref="buttonBack" onClick={this.lastScreen}>
                                Back
                            </button>
                            <button className="btn btn-lg next" ref="button" onClick={this.endScreen}>
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

export default SponsorForm_BusinessInformation;
