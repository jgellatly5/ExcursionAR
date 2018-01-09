import React, { Component } from 'react';
import { Grid, Row, Col, Panel, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class Freemium_AdInfo extends Component{
    constructor(props) {
        super(props);
        this.state = {
            lastScreen: 1,
            nextScreen: 3,
            ...props,
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
        this.changeScreen = this.changeScreen.bind(this);
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
        let buttonNext = this.refs.buttonNext;
        let adName = this.adNameInput.value;
        let genre = this.genreInput.value;
        let adFormat = this.adFormat;
        if (adName !== '' && genre !== '' && adFormat !== 0) {
            buttonNext.classList.add('active', 'hvr-grow');
            buttonNext.removeAttribute('disabled');
        } else {
            buttonNext.classList.remove('active', 'hvr-grow');
            buttonNext.setAttribute('disabled','disabled');
        }
        this.setState({ genre: genre });
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
    changeScreen(e) {
        e.preventDefault();
        if (e.target.name == 'back') {
            this.props.handlerBack({...this.state});
        } else {
            this.props.handlerForward({...this.state});
        }
    }
    componentDidMount() {
        const {adName, genre, adFormat} = this.props;
        let buttonNext = this.refs.buttonNext;
        if (adName == undefined || genre == undefined || adFormat == undefined) {
            buttonNext.setAttribute('disabled','disabled');
        } else {
            buttonNext.classList.add('active', 'hvr-grow');
            buttonNext.removeAttribute('disabled');
        }
        if (adFormat == 'static') {
            this.adFormat = this.refs.staticAd.props.eventKey;
            this.setState({
                adFormat: 'static',
                insertStaticClass: 'freemium-path-panel active',
                insertDynamicClass: 'freemium-path-panel',
                insertInteractiveClass: 'freemium-path-panel'
            });
        } else if (adFormat == 'dynamic') {
            this.adFormat = this.refs.dynamicAd.props.eventKey;
            this.setState({
                adFormat: 'dynamic',
                insertStaticClass: 'freemium-path-panel',
                insertDynamicClass: 'freemium-path-panel active',
                insertInteractiveClass: 'freemium-path-panel'
            });
        } else if (adFormat == 'interactive') {
            this.adFormat = this.refs.interactiveAd.props.eventKey;
            this.setState({
                adFormat: 'interactive',
                insertStaticClass: 'freemium-path-panel',
                insertDynamicClass: 'freemium-path-panel',
                insertInteractiveClass: 'freemium-path-panel active'
            });
        } else {
            this.setState({
                insertStaticClass: 'freemium-path-panel',
                insertDynamicClass: 'freemium-path-panel',
                insertInteractiveClass: 'freemium-path-panel'
            });
        }
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
                            {/* //We are currently offering only one type of tier for sponsors, ad type will be necessary when we begin offering premium services
                                <div className="form-group">
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

                            {/*TODO Change default drop down style button*/}
                            <FormGroup controlId="formControlsSelect">
                                <ControlLabel>Genre</ControlLabel>
                                <FormControl componentClass="select" onChange={this.onChange} inputRef={ref => { this.genreInput = ref; }} value={this.state.genre} name="genre" required>
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
                                            <Panel className={this.state.insertStaticClass} onClick={this.onSelectStatic} ref="staticAd" eventKey="1" name="static">
                                                <img src={require("../blank.png")} alt="blank"/>
                                                <h4>Static</h4>
                                                <p>The ad remains in a fixed position. Example: TV screen or potted plant</p>
                                            </Panel>
                                        </Col>
                                        <Col xs={4}>
                                            <Panel className={this.state.insertDynamicClass} onClick={this.onSelectDynamic} ref="dynamicAd" eventKey="2" name="dynamic">
                                                <img src={require("../blank.png")} alt="blank"/>
                                                <h4>Dynamic</h4>
                                                <p>The ad moves across the screen or contains an animation. Example: plane or rocket</p>
                                            </Panel>
                                        </Col>
                                        <Col xs={4}>
                                            <Panel className={this.state.insertInteractiveClass} onClick={this.onSelectInteractive} ref="interactiveAd" eventKey="3" name="interactive">
                                                <img src={require("../blank.png")} alt="blank"/>
                                                <h4>Interactive</h4>
                                                <p>The ad provides in-app rewards or extends the normal user experience.</p>
                                            </Panel>
                                        </Col>
                                    </Row>
                                </Grid>
                            </div>
                        </form>
                        <div className="bottom-form">
                            <button className="btn btn-lg back hvr-grow" ref="buttonBack" name="back" onClick={this.changeScreen}>
                                Back
                            </button>
                            <button className="btn btn-lg next" ref="buttonNext" name="next" onClick={this.changeScreen}>
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
