import React, { Component } from 'react';
import {Grid, Row, Col, Panel, Jumbotron, Button, Modal, FormGroup, ControlLabel, FormControl, Carousel} from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

class Screen_1_1 extends Component{
    constructor(props) {
        super(props);
        this.state = {

        }
        this.baseState = this.state;
    }
    render() {
        return (
            <div className="ad-signup">
                <h1>Let{`'`}s Get Started</h1>
                <p>Please choose the following:</p>
                <Carousel activeIndex={this.state.index} direction={this.state.direction} onSelect={this.handleSelect}>
                    <Carousel.Item>
                        <Carousel.Caption>
                            <h3>First slide label</h3>
                            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <Carousel.Caption>
                            <h3>Second slide label</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <Carousel.Caption>
                            <h3>Third slide label</h3>
                            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </div>
        );
    }
};

export default Screen_1_1;
