import React, { Component } from 'react';
import {Grid, Row, Col, Panel, Button} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class Screen_1_0 extends Component{
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            screen: 0
        }
    }
    handleChange(e) {
        this.props.onActiveStateChange();
    }
    render() {
        const isActive = this.props.isActive;
        return (
            <div className="choose-path">
                <h1>Welcome to Excursion</h1>
                <p>Please choose the following:</p>
                <Grid>
                    <Row>
                        <Col xs={6}>
                            <Panel className="choose-path-panel">
                                <i className="fa fa-clock-o big gradient-icon" aria-hidden="true"></i>
                                <p className="path">I want to advertise my business.</p>
                                <p className="desc">Excursion rocks!</p>
                                <Button bsStyle="info" className="choose-path-button hvr-grow" onClick={(e) => this.props.handler(e, 1)}>
                                    Let{`'`}s Get Started
                                </Button>
                            </Panel>
                        </Col>
                        <Col xs={6} className="choose-path-panel">
                            <Panel>
                                <i className="fa fa-clock-o big gradient-icon" aria-hidden="true"></i>
                                <p className="path">I want to monetize my business.</p>
                                <p className="desc">Excursion rocks!</p>
                                <Button bsStyle="info" className="choose-path-button hvr-grow">
                                    Let{`'`}s Get Started
                                </Button>
                            </Panel>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
};

export default Screen_1_0;
