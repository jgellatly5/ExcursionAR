import React, { Component } from 'react';
import { Grid, Row, Col, Panel } from 'react-bootstrap';

class Freemium_AdInfo extends Component{
    constructor(props) {
        super(props);
        this.state = {
            adType: '',
            adName: '',
            genre: '',
            appEnvironment: '',
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
        let buttonNext = this.refs.buttonNext;
        buttonNext.setAttribute('disabled','disabled');
    }
    render() {
        return (
            <div className="ad-signup-container">
                <div className="ad-signup">
                    <Panel className="ad-signup-panel">
                    <h1>Time to set up your ad</h1>
                    <p>Choose what ad you would like to use on our platform.</p>
                    <div>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label className="control-label">Ad Type</label>
                                <p>Freemium</p>
                            </div>

                            <div className="form-group">
                                <label className="control-label">Ad Name</label>
                                <input
                                    value={this.state.adName}
                                    onChange={this.onChange}
                                    type="text"
                                    name="adName"
                                    className="form-control"
                                    ref={(input) => { this.industryInput = input }}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="control-label">Genre</label>
                                    <input
                                        value={this.state.genre}
                                        onChange={this.onChange}
                                        type="tel"
                                        name="phoneNumber"
                                        pattern='\d{3}[\-]\d{3}[\-]\d{4}'
                                        className="form-control"
                                        ref={(input) => { this.phoneNumberInput = input }}
                                        required
                                    />
                            </div>

                            <div className="form-group">
                                <label className="control-label">App Environment</label>
                                <br/>
                                <input
                                    value={this.state.environment}
                                    type="radio"
                                    name="environment"
                                    ref={(input) => { this.websiteInput = input }}
                                    required
                                />
                                Indoor
                                <input
                                    value={this.state.environment}
                                    type="radio"
                                    name="environment"
                                    ref={(input) => { this.websiteInput = input }}
                                    required
                                />
                                Outdoor
                            </div>

                            <div className="form-group freemium-path">
                                <label className="control-label">Type of Ad</label>
                                <Grid>
                                    <Row>
                                        <Col xs={3}>
                                            <Panel className="freemium-path-panel">
                                                Type 1
                                            </Panel>
                                        </Col>
                                        <Col xs={3}>
                                            <Panel className="freemium-path-panel">
                                                Type 2
                                            </Panel>
                                        </Col>
                                        <Col xs={3}>
                                            <Panel className="freemium-path-panel">
                                                Type 3
                                            </Panel>
                                        </Col>
                                        <Col xs={3}>
                                            <Panel className="freemium-path-panel">
                                                Type 4
                                            </Panel>
                                        </Col>
                                    </Row>
                                </Grid>
                            </div>

                            <div className="bottom-form">
                                <button className="btn btn-lg back hvr-grow" ref="buttonBack" onClick={this.lastScreen}>
                                    Back
                                </button>
                                <button className="btn btn-lg next" ref="buttonNext" onClick={this.endScreen}>
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

export default Freemium_AdInfo;
