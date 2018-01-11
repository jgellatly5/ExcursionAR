import React, { Component } from 'react';
import { Panel, Tooltip, OverlayTrigger } from 'react-bootstrap';

class PublisherForm_AppInfo extends Component{
    constructor(props) {
        super(props);
        this.state = {...props};
        this.onChange = this.onChange.bind(this);
        this.changeScreen = this.changeScreen.bind(this);
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
        let button = this.refs.button;
        let companyName = this.companyNameInput.value;
        let industry = this.industryInput.value;
        let iOS = this.iOSInput.checked;
        let Android = this.androidInput.checked;
        let staticAd = this.staticInput.checked;
        let dynamicAd = this.dynamicInput.checked;
        let appStoreLink = this.appStoreLinkInput.value;
        let agreement = this.agreementInput.checked;
        let terms = this.termsInput.checked;
        // This should work for any website
        let regex = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;
        if (companyName !== '' && industry !== '' && (iOS || Android) && (staticAd || dynamicAd) && appStoreLink !== '' && regex.test(appStoreLink) && agreement && terms) {
            button.classList.add('active', 'hvr-grow');
            button.removeAttribute('disabled');
        } else {
            button.classList.remove('active', 'hvr-grow');
            button.setAttribute('disabled','disabled');
        }
    }
    changeScreen(e) {
        e.preventDefault();
        if (e.target.name == 'back') {
            this.props.handler({...this.state});
            this.props.handleLastScreen(this.state.lastScreen);
        } else {
            this.props.handler({...this.state});
            this.props.handleNextScreen(this.state.nextScreen);
        }
    }
    componentDidMount() {
        const {operatingSystem, adFormat} = this.props;
        let button = this.refs.button;
        button.setAttribute('disabled','disabled');
        if (operatingSystem == 'iOS') {
            this.iOSInput.checked = true;
        } else if (operatingSystem == 'Android') {
            this.androidInput.checked = true;
        } else {
            return;
        }
        if (adFormat == 'Static') {
            this.staticInput.checked = true;
        } else if (adFormat == 'Dynamic') {
            this.dynamicInput.checked = true;
        } else {
            return;
        }
    }
    render() {
        const tooltip_url = (
            <Tooltip id="tooltip">Must be a valid website</Tooltip>
        );
        return (
            <div className="ad-signup-container">
                <div className="ad-signup">
                    <Panel className="ad-signup-panel sponsor-form-two publisher-app-info">
                    <h1>What is your application?</h1>
                    <p>Fill out information about your app.</p>
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
                                <label className="control-label radio-label">Operating System</label>
                                    <br/>
                                    <input
                                        value="iOS"
                                        onChange={this.onChange}
                                        type="radio"
                                        name="operatingSystem"
                                        ref={(input) => { this.iOSInput = input }}
                                        required
                                    />
                                    <label className="control-label ios-label">iOS</label>
                                    <input
                                        value="Android"
                                        onChange={this.onChange}
                                        type="radio"
                                        name="operatingSystem"
                                        ref={(input) => { this.androidInput = input }}
                                        required
                                    />
                                    <label className="control-label">Android</label>
                            </div>

                            <div className="form-group">
                                <label className="control-label radio-label">Type of Ad Format</label>
                                    <br/>
                                    <input
                                        value="Static"
                                        onChange={this.onChange}
                                        type="radio"
                                        name="adFormat"
                                        ref={(input) => { this.staticInput = input }}
                                        required
                                    />
                                    <label className="control-label">Static</label>
                                    <input
                                        value="Dynamic"
                                        onChange={this.onChange}
                                        type="radio"
                                        name="adFormat"
                                        ref={(input) => { this.dynamicInput = input }}
                                        required
                                    />
                                    <label className="control-label">Dynamic</label>
                            </div>

                            <div className="form-group">
                                <label className="control-label">App Store Link</label>
                                <OverlayTrigger placement="right" overlay={tooltip_url}>
                                <input
                                    value={this.state.appStoreLink}
                                    onChange={this.onChange}
                                    type="url"
                                    name="appStoreLink"
                                    className="form-control"
                                    ref={(input) => { this.appStoreLinkInput = input }}
                                    required
                                />
                                </OverlayTrigger>
                            </div>

                            <div className="form-group publisher-app checkbox-agreement">
                                <input
                                    onChange={this.onChange}
                                    type="checkbox"
                                    name="agreement"
                                    className="payment-checkbox"
                                    ref={(input) => { this.agreementInput = input }}
                                    required
                                />
                                <label className="control-label terms-label">I agree to allow ads in Excursion{`'`}s network to be displayed in my application.</label>
                            </div>

                            <div className="form-group publisher-app checkbox-agreement">
                                <input
                                    onChange={this.onChange}
                                    type="checkbox"
                                    name="terms"
                                    className="payment-checkbox"
                                    ref={(input) => { this.termsInput = input }}
                                    required
                                />
                                <label className="control-label terms-label">I agree to Excursion{`'`}s terms of contract.</label>
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

export default PublisherForm_AppInfo;
