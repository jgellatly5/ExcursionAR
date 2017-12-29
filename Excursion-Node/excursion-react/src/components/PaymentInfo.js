import React, { Component } from 'react';
import { Grid, Row, Col, Panel, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class PaymentInfo extends Component{
    constructor(props) {
        super(props);
        this.state = {
            insertStaticClass: 'payment-info-panel',
            insertDynamicClass: 'payment-info-panel'
        };
        this.paymentType = 0;
        this.onChange = this.onChange.bind(this);
        this.onSelectCreditCard = this.onSelectCreditCard.bind(this);
        this.onSelectPayPal = this.onSelectPayPal.bind(this);
        this.changeScreen = this.changeScreen.bind(this);
    }
    onChange(e) {
        let buttonNext = this.refs.buttonNext;
        let adName = this.adNameInput.value;
        let genre = this.cardTypeInput.value;
        let paymentType = this.paymentType;
        this.setState({
            adName: adName,
            genre: genre
        });
        if (adName !== '' && genre !== '' && paymentType != '0') {
            buttonNext.classList.add('active', 'hvr-grow');
            buttonNext.removeAttribute('disabled');
        } else {
            buttonNext.classList.remove('active', 'hvr-grow');
            buttonNext.setAttribute('disabled','disabled');
        }
    }
    onSelectCreditCard(e) {
        e.preventDefault();
        this.paymentType = this.refs.staticAd.props.eventKey;
        this.setState({
            paymentType: 'static',
            insertStaticClass: 'payment-info-panel active',
            insertDynamicClass: 'payment-info-panel'
        });
        this.onChange(e);
    }
    onSelectPayPal(e) {
        e.preventDefault();
        this.paymentType = this.refs.dynamicAd.props.eventKey;
        this.setState({
            paymentType: 'dynamic',
            insertStaticClass: 'payment-info-panel',
            insertDynamicClass: 'payment-info-panel active'
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
        let paymentType = this.state.paymentType;
        this.props.handler(e, nextScreen, adName, genre, paymentType);
    }
    componentDidMount() {
        let adName = this.props.adName;
        let genre = this.props.genre;
        let buttonNext = this.refs.buttonNext;
        if (adName == undefined && genre == undefined && paymentType == undefined) {
            buttonNext.setAttribute('disabled','disabled');
        } else {
            buttonNext.classList.add('active', 'hvr-grow');
            buttonNext.removeAttribute('disabled');
        }
        let paymentType = this.props.paymentType;
        if (paymentType == 'static') {
            this.paymentType = this.refs.staticAd.props.eventKey;
            this.setState({
                paymentType: 'static',
                insertStaticClass: 'payment-info-panel active',
                insertDynamicClass: 'payment-info-panel'
            });
        } else if (paymentType == 'dynamic') {
            this.paymentType = this.refs.dynamicAd.props.eventKey;
            this.setState({
                paymentType: 'dynamic',
                insertStaticClass: 'payment-info-panel',
                insertDynamicClass: 'payment-info-panel active'
            });
        } else {
            this.setState({
                insertStaticClass: 'payment-info-panel',
                insertDynamicClass: 'payment-info-panel'
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
                            <div className="form-group">
                                <label className="control-label" id="lastElement">Payment Method</label>
                                <Grid>
                                    <Row>
                                        <Col xs={4}>
                                            <Panel className={this.state.insertStaticClass} onClick={this.onSelectCreditCard} ref="staticAd" eventKey="1" name="static">
                                                <img className="credit-card" src={require("../blank.png")} alt="blank"/>
                                                <h4>Credit Card</h4>
                                            </Panel>
                                        </Col>
                                        <Col xs={4} className="pay-pal-card">
                                            <Panel className={this.state.insertDynamicClass} onClick={this.onSelectPayPal} ref="dynamicAd" eventKey="2" name="dynamic">
                                                <img src={require("../pay_pal.png")} alt="pay pal"/>
                                                <h4>PayPal</h4>
                                            </Panel>
                                        </Col>
                                    </Row>
                                </Grid>
                            </div>

                            {/*TODO Change default drop down style button*/}
                            <FormGroup controlId="formControlsSelect">
                                <ControlLabel>Card Type</ControlLabel>
                                <FormControl componentClass="select" onChange={this.onChange} inputRef={ref => { this.cardTypeInput = ref; }} value={this.state.cardType} required>
                                    <option value="visa" >Visa</option>
                                    <option value="mastercard" >Mastercard</option>
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

                            <div className="form-group freemium-path">
                                <Grid>
                                    <Row>
                                        <Col xs={4}>
                                            <label className="control-label">Exp Date</label>
                                            <input
                                                value={this.state.expDate}
                                                onChange={this.onChange}
                                                type="text"
                                                name="expDate"
                                                className="form-control"
                                                ref={(input) => { this.expDateInput = input }}
                                                required
                                            />
                                        </Col>
                                        <Col xs={4}>
                                            <label className="control-label">CVV Number</label>
                                            <input
                                                value={this.state.cvvNumber}
                                                onChange={this.onChange}
                                                type="text"
                                                name="cvvNumber"
                                                className="form-control"
                                                ref={(input) => { this.cvvNumberInput = input }}
                                                required
                                            />
                                        </Col>
                                    </Row>
                                </Grid>
                            </div>
                            <hr/>

                            <div className="form-group">
                                <label className="control-label">Billing Address</label>
                                <input
                                    value={this.state.billingAddress}
                                    onChange={this.onChange}
                                    type="text"
                                    name="billingAddress"
                                    className="form-control"
                                    ref={(input) => { this.billingAddressInput = input }}
                                    required
                                />
                                <input
                                    value={this.state.billingAddress2}
                                    onChange={this.onChange}
                                    type="text"
                                    name="billingAddress2"
                                    className="form-control"
                                    ref={(input) => { this.billingAddress2Input = input }}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="control-label">City/Town</label>
                                <input
                                    value={this.state.city}
                                    onChange={this.onChange}
                                    type="text"
                                    name="city"
                                    className="form-control"
                                    ref={(input) => { this.cityInput = input }}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="control-label">Zip Code</label>
                                <input
                                    value={this.state.zipCode}
                                    onChange={this.onChange}
                                    type="text"
                                    name="zipCode"
                                    className="form-control"
                                    ref={(input) => { this.zipCodeInput = input }}
                                    required
                                />
                            </div>

                            {/*TODO Change default drop down style button*/}
                            <FormGroup controlId="formControlsSelect">
                                <ControlLabel>State</ControlLabel>
                                <FormControl componentClass="select" onChange={this.onChange} inputRef={ref => { this.stateInput = ref; }} value={this.state.stateAddress} required>
                                    <option value="alabama" >Alabama</option>
                                    <option value="arkansas" >Arkansas</option>
                                    <option value="california" >California</option>
                                    <option value="colorado" >Colorado</option>
                                    <option value="delaware" >Delaware</option>
                                    <option value="other" >Other...</option>
                                </FormControl>
                            </FormGroup>

                            <div className="form-group radio-buttons">
                                <input
                                    value="true"
                                    type="radio"
                                    name="termsAndConditions"
                                    onChange={this.onChange}
                                    ref={(input) => { this.termsInput = input }}
                                    required
                                />
                                I agree to Excursion{`'`}s terms and conditions
                            </div>

                        </form>
                        <div className="bottom-form">
                            <button className="btn btn-lg back hvr-grow" ref="buttonBack" name="back" onClick={this.changeScreen}>
                                Back
                            </button>
                            <button className="btn btn-lg next" ref="buttonNext" name="next" onClick={this.changeScreen}>
                                Done
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
