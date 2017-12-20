import React, { Component } from 'react';
import { Grid, Row, Col, Panel, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class ReviewInfo extends Component{
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
                    <h1>Review your ad</h1>
                    <p>Review your ad and your settings</p>
                    <div>
                        <form>
                            <Grid>
                                <Row>
                                    <Col xs={6}>
                                        <div className="form-group">
                                            <label className="control-label">Ad Preview</label>
                                            <img src={require("../phonePreview.png")}/>
                                        </div>
                                    </Col>
                                    <Col xs={6}>
                                        <div className="form-group">
                                            <label className="control-label">Company/Product Name</label>
                                            <p className="ad-type">Hooli</p>
                                        </div>

                                        <div className="form-group">
                                            <label className="control-label">Ad Type</label>
                                            <p className="ad-type">Freemium</p>
                                        </div>

                                        <div className="form-group">
                                            <label className="control-label">App Environment</label>
                                            <p className="ad-type">Indoors</p>
                                        </div>

                                        <div className="form-group">
                                            <label className="control-label">Budget Amount</label>
                                            <p className="ad-type">$25 per day</p>
                                        </div>
                                    </Col>
                                </Row>
                            </Grid>
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

export default ReviewInfo;
