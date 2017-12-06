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
    }
    onChange(e) {
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
    componentDidMount() {
        let button = this.refs.button;
        button.setAttribute('disabled','disabled');
    }
    render() {
        const tooltip_phoneNumber = (
            <Tooltip id="tooltip">Format: 000-000-0000</Tooltip>
        );
        const tooltip_url = (
            <Tooltip id="tooltip">Format: "http://"</Tooltip>
        );
        return (
            <div className="ad-signup-container">
                <div className="ad-signup">
                    <Panel className="ad-signup-panel">
                    <h1>What is your business?</h1>
                    <p>Fill out information about your business.</p>
                    <div>
                        <form onSubmit={this.onSubmit}>
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
                                        pattern='\d{3}[\-]\d{3}[\-]\d{4}'
                                        className="form-control"
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