import React, { Component } from 'react';
import { Grid, Row, Col, Panel, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

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
                    <Panel className="ad-signup-panel scroll">
                    <h1>Time to set up your ad</h1>
                    <p>Choose what ad you would like to use on our platform.</p>
                    <div>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label className="control-label">Ad Type</label>
                                <p className="ad-type">Freemium</p>
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

                            <FormGroup controlId="formControlsSelect">
                                <ControlLabel>Genre</ControlLabel>
                                <FormControl componentClass="select" placeholder="Technology">
                                    <option value="technology">Technology</option>
                                    <option value="other">...</option>
                                </FormControl>
                            </FormGroup>

                            <div className="form-group radio-buttons">
                                <label className="control-label" id="environment">App Environment</label>
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
                                                <h4>Type 1</h4>
                                                <p>Anyway you want it, thats the way you need it. Anyway you want it.
                                                She loves to laugh, she loves to sing. She does everything.</p>
                                            </Panel>
                                        </Col>
                                        <Col xs={3}>
                                            <Panel className="freemium-path-panel">
                                                <h4>Type 2</h4>
                                                <p>When the lights go down in the city and the sun shines on the bay.
                                                Oh I want to be there in my city Oh oo woah oo oahooo.</p>
                                            </Panel>
                                        </Col>
                                        <Col xs={3}>
                                            <Panel className="freemium-path-panel">
                                                <h4>Type 3</h4>
                                                <p>Dont stop believing hold on to that feeling. Streetlights, people.</p>
                                            </Panel>
                                        </Col>
                                        <Col xs={3}>
                                            <Panel className="freemium-path-panel">
                                                <h4>Type 4</h4>
                                                <p>The wheel in the sky keeps on turning.</p>
                                            </Panel>
                                        </Col>
                                    </Row>
                                </Grid>
                            </div>
                        </form>
                        <div className="bottom-form">
                            <button className="btn btn-lg back hvr-grow" ref="buttonBack" onClick={this.lastScreen}>
                                Back
                            </button>
                            <button className="btn btn-lg next" ref="buttonNext" onClick={this.endScreen}>
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

export default Freemium_AdInfo;
