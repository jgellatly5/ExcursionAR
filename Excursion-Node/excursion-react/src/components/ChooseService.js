import React, { Component } from 'react';
import {Grid, Row, Col, Panel} from 'react-bootstrap';

class ChooseService extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isActive: true,
            insertCardClass: "choose-service-panel",
            insertCard2Class: "choose-service-panel"
        };
        this.onSelectFree = this.onSelectFree.bind(this);
        this.onSelectPremium = this.onSelectPremium.bind(this);
    }
    onSelectFree(e) {
        let buttonNext = this.refs.buttonNext;
        let buttonBack = this.refs.buttonBack;
        buttonNext.classList.add('active', 'hvr-grow');
        buttonNext.removeAttribute('disabled');
        buttonBack.classList.add('stable');
        this.setState({
            insertCardClass: "choose-service-panel active",
            insertCard2Class: "choose-service-panel unactive"
        });
    }
    onSelectPremium(e) {
        let buttonNext = this.refs.buttonNext;
        let buttonBack = this.refs.buttonBack;
        // let freeCard = this.refs.freeCard;
        // console.log(card);
        buttonNext.classList.add('active', 'hvr-grow');
        buttonNext.removeAttribute('disabled');
        // buttonBack.classList.add('active');
        this.setState({
            insertCardClass: "choose-service-panel unactive",
            insertCard2Class: "choose-service-panel active"
        });
    }
    render() {
        return (
            <div className="choose-service-container">
                <div className="ad-signup">
                    <Panel className="ad-signup-panel">
                    <h1 className="top-header">Choose what service you would like to use</h1>
                    <p className="top">Choose from our own ads or create and submit your own.</p>
                    <div className="container-services choose-service">
                        <Grid>
                            <Row>
                                <Col xs={6}>
                                    <Panel className={this.state.insertCardClass} ref="freeCard" onClick={this.onSelectFree}>
                                        <img src={require("../blank.png")} className="icon-confetti"/>
                                        <h3 className="header-service">Free</h3>
                                        <p className="desc">I am addicted to Chinese food</p>
                                        <p className="desc">I am addicted to Chinese food</p>
                                        <p className="desc">I am addicted to Chinese food</p>
                                    </Panel>
                                </Col>
                                <Col xs={6}>
                                    <Panel className={this.state.insertCard2Class} ref="premiumCard" onClick={this.onSelectPremium}>
                                        <img src={require("../blank.png")} className="icon-dollar"/>
                                        <h3 className="header-service">Premium</h3>
                                        <p className="desc">I am addicted to Chinese food</p>
                                        <p className="desc">I am addicted to Chinese food</p>
                                        <p className="desc">I am addicted to Chinese food</p>
                                    </Panel>
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                    <div className="bottom-form">
                        <button className="btn btn-lg back hvr-grow" ref="buttonBack" onClick={this.endScreen}>
                            Back
                        </button>
                        <button className="btn btn-lg next" ref="buttonNext" onClick={this.endScreen}>
                            Next
                        </button>
                    </div>
                    </Panel>
                </div>
            </div>
        );
    }
};

export default ChooseService;
