import React, { Component } from 'react';
import {Grid, Row, Col, Panel} from 'react-bootstrap';

class ChooseService extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isActive: true,
            insertClass: "choose-service-panel"
        };
        this.onSelect = this.onSelect.bind(this);
    }
    onSelect(e) {
        // let card = this.refs.card;
        // let button = this.refs.button;
        // console.log(card.classList);
        // console.log(button.classList);
        // card.classList.add('active');
        // let isActive = false;
        // if (e.onClick()){
        //     isActive = !isActive;
        //     return "choose-service-panel active";
        // } else {
        //     return "choose-service-panel";
        // }
        this.setState({
            insertClass: "choose-service-panel"
        });
        console.log("onSelect");
        console.log(e.onClick);
        // if (e.onClick) {
        //     this.setState({
        //         insertClass: "choose-service-panel active"
        //     });
        //     console.log(this.state.insertClass);
        // } else {
        //     this.setState({
        //         insertClass: "choose-service-panel"
        //     });
        // }
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
                                    <Panel className={this.state.insertClass} ref="card" onClick={this.onSelect}>
                                        <img src={require("../blank.png")} className="icon-confetti"/>
                                        <h3 className="header-service">Free</h3>
                                        <p className="desc">I am addicted to Chinese food</p>
                                        <p className="desc">I am addicted to Chinese food</p>
                                        <p className="desc">I am addicted to Chinese food</p>
                                    </Panel>
                                </Col>
                                <Col xs={6}>
                                    <Panel className="choose-service-panel" ref="card2" onClick={this.onSelect}>
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
                        <button className="btn btn-lg back hvr-grow" ref="button" onClick={this.endScreen}>
                            Back
                        </button>
                        <button className="btn btn-lg next" ref="button" onClick={this.endScreen}>
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
