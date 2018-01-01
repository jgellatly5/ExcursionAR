import React, { Component } from 'react';
import { Panel, Tooltip, OverlayTrigger } from 'react-bootstrap';

class SponsorForm_BusinessInformation extends Component{
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.changeScreen = this.changeScreen.bind(this);
        this.formatNumber = this.formatNumber.bind(this);
    }
    onChange(e) {
        let button = this.refs.button;
        let companyName = this.companyNameInput.value;
        let industry = this.industryInput.value;
        let phoneNumber = this.phoneNumberInput.value;
        let website = this.websiteInput.value;
        // The website must use a protocol identifier (http, https) and it must be valid (be totally correct)
        // Url must have at least a 2 character extension (.co)
        // Url must have a character in between the protocol ID (http) and the extension (.co)
        // This does NOT work for www extensions
        let regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
        if (companyName !== '' && industry !== '' && phoneNumber !== '' && phoneNumber.length > 11 && website !== '' && regex.test(website)) {
            button.classList.add('active', 'hvr-grow');
            button.removeAttribute('disabled');
        } else {
            button.classList.remove('active', 'hvr-grow');
            button.setAttribute('disabled','disabled');
        }
    }
    changeScreen(e) {
        let nextScreen;
        if (e.target.name == 'back') {
            nextScreen = this.props.screenId - 1;
        } else {
            nextScreen = this.props.screenId + 1;
        }
        let companyName = this.companyNameInput.value;
        let industry = this.industryInput.value;
        let phoneNumber = this.phoneNumberInput.value;
        let website = this.websiteInput.value;
        this.props.handler(e, nextScreen, companyName, industry, phoneNumber, website);
    }
    formatNumber() {
        let phoneNumber = this.phoneNumberInput.value,
        regex = /(\D+)/g,
        areaCode = '',
        firstDigits = '',
        lastDigits = '';
        if (phoneNumber !== '') {
            // every input is required to be a number by the r expression
            phoneNumber = phoneNumber.replace(regex, '');
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
            this.phoneNumberInput.value = phoneNumber;
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
            <Tooltip id="tooltip">Must be a valid website</Tooltip>
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
                                    value={this.props.companyName}
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
                                    value={this.props.industry}
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
                                        value={this.props.phoneNumber}
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
                                    value={this.props.website}
                                    onChange={this.onChange}
                                    type="url"
                                    name="website"
                                    pattern='^https?://'
                                    className="form-control"
                                    ref={(input) => { this.websiteInput = input }}
                                    onKeyUp={this.checkWebsite}
                                    required
                                    id="last"
                                />
                                </OverlayTrigger>
                            </div>
                        </form>
                        <div className="bottom-form">
                            <button className="btn btn-lg back hvr-grow" name="back" onClick={this.changeScreen}>
                                Back
                            </button>
                            <button className="btn btn-lg next" ref="button" name="next" onClick={this.changeScreen}>
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
