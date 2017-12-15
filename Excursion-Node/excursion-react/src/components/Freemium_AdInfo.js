import React, { Component } from 'react';
import { Grid, Row, Col, Panel, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class Freemium_AdInfo extends Component{
    constructor(props) {
        super(props);
        this.state = {
            adType: 'freemium',
            insertStaticClass: 'freemium-path-panel',
            insertDynamicClass: 'freemium-path-panel',
            insertInteractiveClass: 'freemium-path-panel'
        };
        this.adFormat = 0;
        this.onChange = this.onChange.bind(this);
        this.onSelectStatic = this.onSelectStatic.bind(this);
        this.onSelectDynamic = this.onSelectDynamic.bind(this);
        this.onSelectInteractive = this.onSelectInteractive.bind(this);
        this.lastScreen = this.lastScreen.bind(this);
        this.endScreen = this.endScreen.bind(this);
    }
    onChange(e) {
        let buttonNext = this.refs.buttonNext;
        let adName = this.adNameInput.value;
        let genre = this.genreInput.value;
        let adFormat = this.adFormat;
        if (adName !== '' && genre !== '' && adFormat != '0') {
            buttonNext.classList.add('active', 'hvr-grow');
            buttonNext.removeAttribute('disabled');
        } else {
            buttonNext.classList.remove('active', 'hvr-grow');
            buttonNext.setAttribute('disabled','disabled');
        }
    }
    onSelectStatic(e) {
        e.preventDefault();
        this.adFormat = this.refs.staticAd.props.eventKey;
        this.setState({
            adFormat: 'static',
            insertStaticClass: 'freemium-path-panel active',
            insertDynamicClass: 'freemium-path-panel',
            insertInteractiveClass: 'freemium-path-panel'
        });
        this.onChange(e);
    }
    onSelectDynamic(e) {
        e.preventDefault();
        this.adFormat = this.refs.dynamicAd.props.eventKey;
        this.setState({
            adFormat: 'dynamic',
            insertStaticClass: 'freemium-path-panel',
            insertDynamicClass: 'freemium-path-panel active',
            insertInteractiveClass: 'freemium-path-panel'
        });
        this.onChange(e);
    }
    onSelectInteractive(e) {
        e.preventDefault();
        this.adFormat = this.refs.interactiveAd.props.eventKey;
        this.setState({
            adFormat: 'interactive',
            insertStaticClass: 'freemium-path-panel',
            insertDynamicClass: 'freemium-path-panel',
            insertInteractiveClass: 'freemium-path-panel active'
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
                    <Panel className="ad-signup-panel">
                    <h1>Time to set up your ad</h1>
                    <p>Choose what ad you would like to use on our platform.</p>
                    <div>
                        <form>
                            {/*<div className="form-group">
                                <label className="control-label">Ad Type</label>
                                <p className="ad-type">Freemium</p>
                            </div>*/}

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
                                <FormControl componentClass="select" onChange={this.onChange} inputRef={ref => { this.genreInput = ref; }} value={this.state.genre} required>
                                    <option value="technology" >Technology</option>
                                    <option value="finance" >Finance</option>
                                    <option value="retail" >Retail</option>
                                    <option value="entertainment" >Entertainment</option>
                                    <option value="restaurant" >Restaurant</option>
                                    <option value="other" >Other...</option>
                                </FormControl>
                            </FormGroup>

                            <div className="form-group freemium-path">
                                <label className="control-label" id="lastElement">Type of Ad</label>
                                <Grid>
                                    <Row>
                                        <Col xs={4}>
                                            <Panel className={this.state.insertStaticClass} onClick={this.onSelectStatic} ref="staticAd" eventKey="1">
                                                <img src={require("../blank.png")}/>
                                                <h4>Static</h4>
                                                <p>The ad remains in a fixed position. Example: TV screen or potted plant</p>
                                            </Panel>
                                        </Col>
                                        <Col xs={4}>
                                            <Panel className={this.state.insertDynamicClass} onClick={this.onSelectDynamic} ref="dynamicAd" eventKey="2">
                                                <img src={require("../blank.png")}/>
                                                <h4>Dynamic</h4>
                                                <p>The ad moves across the screen or contains an animation. Example: plane or rocket</p>
                                            </Panel>
                                        </Col>
                                        <Col xs={4}>
                                            <Panel className={this.state.insertInteractiveClass} onClick={this.onSelectInteractive} ref="interactiveAd" eventKey="3">
                                                <img src={require("../blank.png")}/>
                                                <h4>Interactive</h4>
                                                <p>The ad provides in-app rewards or extends the normal user experience. Example: applied discount at a restaurant</p>
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
