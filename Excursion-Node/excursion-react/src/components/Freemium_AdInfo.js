import React, { Component } from 'react';
import { Grid, Row, Col, Panel, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class Freemium_AdInfo extends Component{
    constructor(props) {
        super(props);
        this.state = {
            adType: 'freemium',
            adName: '',
            appEnvironment: '',
            adFormat: '',
            insertType1Class: 'freemium-path-panel',
            insertType2Class: 'freemium-path-panel',
            insertType3Class: 'freemium-path-panel',
            insertType4Class: 'freemium-path-panel'
        };
        this.onChange = this.onChange.bind(this);
        this.onSelectType1 = this.onSelectType1.bind(this);
        this.onSelectType2 = this.onSelectType2.bind(this);
        this.onSelectType3 = this.onSelectType3.bind(this);
        this.onSelectType4 = this.onSelectType4.bind(this);
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
        let adFormat = this.state.adFormat;
        if (adName !== '' && genre !== '' && (indoorEnv !== '' || outdoorEnv !== '') && adFormat !== '') {
            buttonNext.classList.add('active', 'hvr-grow');
            buttonNext.removeAttribute('disabled');
        } else {
            buttonNext.classList.remove('active', 'hvr-grow');
            buttonNext.setAttribute('disabled','disabled');
        }
    }
    onSelectType1(e) {
        e.preventDefault();
        this.setState({
            adFormat: 'type1',
            insertType1Class: 'freemium-path-panel active',
            insertType2Class: 'freemium-path-panel',
            insertType3Class: 'freemium-path-panel',
            insertType4Class: 'freemium-path-panel'
        });
        this.onChange(e);
    }
    onSelectType2(e) {
        e.preventDefault();
        this.setState({
            adFormat: 'type2',
            insertType1Class: 'freemium-path-panel',
            insertType2Class: 'freemium-path-panel active',
            insertType3Class: 'freemium-path-panel',
            insertType4Class: 'freemium-path-panel'
        });
        this.onChange(e);
    }
    onSelectType3(e) {
        e.preventDefault();
        this.setState({
            adFormat: 'type3',
            insertType1Class: 'freemium-path-panel',
            insertType2Class: 'freemium-path-panel',
            insertType3Class: 'freemium-path-panel active',
            insertType4Class: 'freemium-path-panel'
        });
        this.onChange(e);
    }
    onSelectType4(e) {
        e.preventDefault();
        this.setState({
            adFormat: 'type4',
            insertType1Class: 'freemium-path-panel',
            insertType2Class: 'freemium-path-panel',
            insertType3Class: 'freemium-path-panel',
            insertType4Class: 'freemium-path-panel active'
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
                                <label className="control-label" id="lastElement">Type of Ad</label>
                                <Grid>
                                    <Row>
                                        <Col xs={3}>
                                            <Panel className={this.state.insertType1Class} onClick={this.onSelectType1}>
                                                <img src={require("../blank.png")}/>
                                                <h4>Type 1</h4>
                                                <p>Anyway you want it, thats the way you need it. Anyway you want it.</p>
                                            </Panel>
                                        </Col>
                                        <Col xs={3}>
                                            <Panel className={this.state.insertType2Class} onClick={this.onSelectType2}>
                                                <img src={require("../blank.png")}/>
                                                <h4>Type 2</h4>
                                                <p>When the lights go down in the city and the sun shines on the bay.</p>
                                            </Panel>
                                        </Col>
                                        <Col xs={3}>
                                            <Panel className={this.state.insertType3Class} onClick={this.onSelectType3}>
                                                <img src={require("../blank.png")}/>
                                                <h4>Type 3</h4>
                                                <p>Dont stop believing hold on to that feeling. Streetlights, people.</p>
                                            </Panel>
                                        </Col>
                                        <Col xs={3}>
                                            <Panel className={this.state.insertType4Class} onClick={this.onSelectType4}>
                                                <img src={require("../blank.png")}/>
                                                <h4>Type 4</h4>
                                                <p>The wheel in the sky keeps on turning. I dont know where Ill be tomorrow.</p>
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
