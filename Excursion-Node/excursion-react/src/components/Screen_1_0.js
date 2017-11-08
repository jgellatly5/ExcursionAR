import React, { Component } from 'react';
import {Grid, Row, Col, Panel, Jumbotron, Button, Modal, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

class Screen_1_0 extends Component{
    constructor(props) {
        super(props);
        this.state = {

        }
        this.baseState = this.state;
    }
    render() {
        return (
            <div className="choose-path">
                <h1>Welcome to Excursion</h1>
                <Grid>
                    <Row>
                        <Col xs={6}>
                            <Panel>
                                <Button bsStyle="info" onClick={this.openDev} className="sdk hvr-grow">
                                    Signup for the Excursion SDK!
                                </Button>
                            </Panel>
                        </Col>
                        <Col xs={6} className="context">
                            <Panel>
                                <Button bsStyle="info" onClick={this.openDev} className="sdk hvr-grow">
                                    Signup for the Excursion SDK!
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
