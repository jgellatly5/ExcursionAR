import React, { Component } from 'react';
import { Grid, Row, Col, Panel, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class PaymentInfo extends Component{
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
        this.changeScreen = this.changeScreen.bind(this);
    }
    onChange(e) {
        let buttonNext = this.refs.buttonNext;
        let adName = this.adNameInput.value;
        let genre = this.genreInput.value;
        let adFormat = this.adFormat;
        this.setState({
            adName: adName,
            genre: genre
        });
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
    changeScreen(e) {
        let nextScreen;
        if (e.target.name == 'back') {
            nextScreen = this.props.screenId - 1;
        } else {
            nextScreen = this.props.screenId + 1;
        }
        let adName = this.state.adName;
        let genre = this.state.genre;
        let adFormat = this.state.adFormat;
        this.props.handler(e, nextScreen, adName, genre, adFormat);
    }
    componentDidMount() {
        let adName = this.props.adName;
        let genre = this.props.genre;
        let buttonNext = this.refs.buttonNext;
        if (adName == undefined && genre == undefined && adFormat == undefined) {
            buttonNext.setAttribute('disabled','disabled');
        } else {
            buttonNext.classList.add('active', 'hvr-grow');
            buttonNext.removeAttribute('disabled');
        }
        let adFormat = this.props.adFormat;
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
                    <h1>Enter payment info</h1>
                    <p>Select a payment method</p>
                    <div>
                        <form>
                            <div className="form-group freemium-path">
                                <label className="control-label" id="lastElement">Payment Method</label>
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
                                    </Row>
                                </Grid>
                            </div>

                            {/*TODO Change default drop down style button*/}
                            <FormGroup controlId="formControlsSelect">
                                <ControlLabel>Card Type</ControlLabel>
                                <FormControl componentClass="select" onChange={this.onChange} inputRef={ref => { this.genreInput = ref; }} value={this.state.genre} required>
                                    <option value="technology" >Technology</option>
                                    <option value="finance" >Finance</option>
                                    <option value="retail" >Retail</option>
                                    <option value="entertainment" >Entertainment</option>
                                    <option value="restaurant" >Restaurant</option>
                                    <option value="other" >Other...</option>
                                </FormControl>
                            </FormGroup>

                            <div className="form-group">
                                <label className="control-label">Name on Card</label>
                                <input
                                    value={this.state.cardName}
                                    onChange={this.onChange}
                                    type="text"
                                    name="cardName"
                                    className="form-control"
                                    ref={(input) => { this.cardNameInput = input }}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="control-label">Card Number</label>
                                <input
                                    value={this.state.cardNumber}
                                    onChange={this.onChange}
                                    type="text"
                                    name="cardNumber"
                                    className="form-control"
                                    ref={(input) => { this.cardNumberInput = input }}
                                    required
                                />
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

export default PaymentInfo;
