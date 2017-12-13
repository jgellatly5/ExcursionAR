import React, { Component } from 'react';
import { Grid, Row, Col, Panel, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class Premium_AdInfo extends Component{
    constructor(props) {
        super(props);
        this.state = {
            adType: 'premium',
            adName: '',
            appEnvironment: '',
            isAdUploaded: false,
            insertClass: 'premium-path-panel',
        };
        this.onChange = this.onChange.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.lastScreen = this.lastScreen.bind(this);
        this.endScreen = this.endScreen.bind(this);
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
        let buttonNext = this.refs.buttonNext;
        let adName = this.adNameInput.value;
        let genre = this.genreInput.value;
        let outdoorEnv = this.outdoorEnvInput.value;
        let indoorEnv = this.indoorEnvInput.value;
        let isAdUploaded = this.state.isAdUploaded;
        if (adName !== '' && genre !== '' && (indoorEnv !== '' || outdoorEnv !== '') && isAdUploaded !== '') {
            buttonNext.classList.add('active', 'hvr-grow');
            buttonNext.removeAttribute('disabled');
        } else {
            buttonNext.classList.remove('active', 'hvr-grow');
            buttonNext.setAttribute('disabled','disabled');
        }
    }
    onUpload(e) {
        e.preventDefault();
        this.setState({
            insertClass: 'premium-path-panel active'
        });
        this.onChange(e);
    }
    lastScreen(e) {
        let nextScreen = this.props.screenId - 1;
        this.props.handler(e, nextScreen);
    }
    endScreen(e) {
        let nextScreen = this.props.screenId + 1;
        this.props.handler(e, nextScreen);
    }
    componentDidMount() {
        let buttonNext = this.refs.buttonNext;
        buttonNext.setAttribute('disabled','disabled');
    }
    render() {
        return (
            <div className="ad-signup-container">
                <div className="ad-signup" id="fix-margin">
                    <Panel className="ad-signup-panel scroll">
                    <h1>Time to set up your ad</h1>
                    <p>Choose what ad you would like to use on our platform.</p>
                    <div>
                        <form>
                            <div className="form-group">
                                <label className="control-label">Ad Type</label>
                                <p className="ad-type">Premium: upload your own model</p>
                            </div>

                            <div className="form-group">
                                <label className="control-label">Ad Name</label>
                                <input
                                    value={this.state.adName}
                                    onChange={this.onChange}
                                    type="text"
                                    name="adName"
                                    className="form-control"
                                    ref={(input) => { this.adNameInput = input }}
                                    required
                                />
                            </div>

                            <FormGroup controlId="formControlsSelect">
                                <ControlLabel>Genre</ControlLabel>
                                <FormControl componentClass="select" placeholder="..." onChange={this.onChange} inputRef={ref => { this.genreInput = ref; }} value={this.state.genre}>
                                    <option value="other" >...</option>
                                    <option value="technology" >Technology</option>
                                    <option value="finance" >Finance</option>
                                    <option value="retail" >Retail</option>
                                    <option value="entertainment" >Entertainment</option>
                                    <option value="restaurant" >Restaurant</option>
                                </FormControl>
                            </FormGroup>

                            <div className="form-group radio-buttons">
                                <label className="control-label" id="environment">App Environment</label>
                                <br/>
                                <input
                                    value="indoor"
                                    type="radio"
                                    name="appEnvironment"
                                    onChange={this.onChange}
                                    ref={(input) => { this.indoorEnvInput = input }}
                                    required
                                />
                                Indoor
                                <input
                                    value="outdoor"
                                    type="radio"
                                    name="appEnvironment"
                                    onChange={this.onChange}
                                    ref={(input) => { this.outdoorEnvInput = input }}
                                    required
                                />
                                Outdoor
                            </div>

                            <div className="form-group freemium-path">
                                <label className="control-label" id="lastElement">Upload {'3D'} Image</label>
                                <Grid>
                                    <Row>
                                        <Col xs={6}>
                                            <Panel className={this.state.insertClass} onClick={this.onUpload}>
                                                <img src={require("../blank.png")}/>
                                                <p><strong>Drag & drop</strong> your file here or <strong>browse</strong></p>
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

export default Premium_AdInfo;
