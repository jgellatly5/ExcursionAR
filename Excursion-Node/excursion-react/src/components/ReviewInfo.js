import React, { Component } from 'react';
import { Grid, Row, Col, Panel, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class ReviewInfo extends Component{
    constructor(props) {
        super(props);
        this.state = {

        };
        this.lastScreen = this.lastScreen.bind(this);
        this.endScreen = this.endScreen.bind(this);
    }
    lastScreen(e) {
        let nextScreen = this.props.screenId - 1;
        this.props.handler(e, nextScreen);
    }
    endScreen(e) {
        let nextScreen = this.props.screenId + 1;
        this.props.handler(e, nextScreen);
    }
    render() {
        return (
            <div className="ad-signup-container">
                <div className="ad-signup" id="fix-margin">
                    <Panel className="ad-signup-panel">
                        <div className="review-ad-container">
                            <h1>Review your ad</h1>
                            <p>Review your ad and your settings</p>
                            <form>
                                <Grid>
                                    <Row>
                                        <Col xs={6}>
                                            <div className="form-group">
                                                <label className="control-label">Ad Preview</label>
                                                <img src={require("../phonePreview.png")}/>
                                            </div>
                                        </Col>
                                        <Col xs={6} className="right-side-review">
                                            <div className="form-group">
                                                <label className="control-label">Company/Product Name</label>
                                                <p className="ad-type">Hooli</p>
                                            </div>

                                            <div className="form-group">
                                                <label className="control-label">Ad Name</label>
                                                <p className="ad-type">Hooli Nucleus Recruitment</p>
                                            </div>

                                            <div className="form-group">
                                                <label className="control-label">Genre</label>
                                                <p className="ad-type">Tecnology</p>
                                            </div>

                                            <div className="form-group">
                                                <label className="control-label">Format</label>
                                                <p className="ad-type">Dynamic</p>
                                            </div>

                                            <div className="form-group">
                                                <label className="control-label">Budget Amount</label>
                                                <p className="ad-type">$25 per day</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </Grid>
                            </form>
                        </div>
                        <div className="bottom-form review-ad-bottom">
                            <button className="btn btn-lg back hvr-grow" ref="buttonBack" onClick={this.lastScreen}>
                                Back
                            </button>
                            <button className="btn btn-lg looks-great active hvr-grow" ref="buttonNext" onClick={this.endScreen}>
                                <div className="looks-great-text align-middle">Looks Great</div>
                            </button>
                        </div>
                    </Panel>
                </div>
            </div>
        );
    }
};

export default ReviewInfo;
