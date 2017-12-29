import React, { Component } from 'react';
import { Grid, Row, Col, Panel, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class PaymentInfo extends Component{
    constructor(props) {
        super(props);
        this.state = {
            insertCreditCardClass: 'payment-info-panel',
            insertPayPalClass: 'payment-info-panel'
        };
        this.paymentType = 0;
        this.onChange = this.onChange.bind(this);
        this.onSelectCreditCard = this.onSelectCreditCard.bind(this);
        this.onSelectPayPal = this.onSelectPayPal.bind(this);
        this.changeScreen = this.changeScreen.bind(this);
    }
    onChange(e) {
        let buttonNext = this.refs.buttonNext;
        let paymentType = this.paymentType;
        let cardType = this.cardTypeInput.value;
        let cardName = this.cardNameInput.value;
        let cardNumber = this.cardNumberInput.value;
        let expDate = this.expDateInput.value;
        let cvvNumber = this.cvvNumberInput.value;
        let billingAddress = this.billingAddressInput.value;
        let billingAddress2 = this.billingAddress2Input.value;
        let city = this.cityInput.value;
        let zipCode = this.zipCodeInput.value;
        let stateAdress = this.stateInput.value;
        let terms = this.termsInput.value;
        // this.setState({
        //     cardName: cardName,
        //     cardType: cardType
        // });
        if (paymentType != '0' && cardType !== '' && cardName !== '' && cardNumber !== '' &&
            expDate !== '' && cvvNumber !== '' && billingAddress !== '' && city !== '' &&
            zipCode !== '' && stateAdress !== '' && terms !== '') {
            buttonNext.classList.add('active', 'hvr-grow');
            buttonNext.removeAttribute('disabled');
        } else {
            buttonNext.classList.remove('active', 'hvr-grow');
            buttonNext.setAttribute('disabled','disabled');
        }
    }
    onSelectCreditCard(e) {
        e.preventDefault();
        this.paymentType = this.refs.creditCardCard.props.eventKey;
        this.setState({
            paymentType: 'creditCard',
            insertCreditCardClass: 'payment-info-panel active',
            insertPayPalClass: 'payment-info-panel'
        });
        this.onChange(e);
    }
    onSelectPayPal(e) {
        e.preventDefault();
        this.paymentType = this.refs.payPalCard.props.eventKey;
        this.setState({
            paymentType: 'payPal',
            insertCreditCardClass: 'payment-info-panel',
            insertPayPalClass: 'payment-info-panel active'
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
        let cardName = this.state.cardName;
        let cardType = this.state.cardType;
        let paymentType = this.state.paymentType;
        this.props.handler(e, nextScreen, cardName, cardType, paymentType);
    }
    componentDidMount() {
        let cardName = this.props.cardName;
        let cardType = this.props.cardType;
        let buttonNext = this.refs.buttonNext;
        if (cardName == undefined && cardType == undefined && paymentType == undefined) {
            buttonNext.setAttribute('disabled','disabled');
        } else {
            buttonNext.classList.add('active', 'hvr-grow');
            buttonNext.removeAttribute('disabled');
        }
        let paymentType = this.props.paymentType;
        if (paymentType == 'creditCard') {
            this.paymentType = this.refs.creditCardCard.props.eventKey;
            this.setState({
                paymentType: 'creditCard',
                insertCreditCardClass: 'payment-info-panel active',
                insertPayPalClass: 'payment-info-panel'
            });
        } else if (paymentType == 'payPal') {
            this.paymentType = this.refs.payPalCard.props.eventKey;
            this.setState({
                paymentType: 'payPal',
                insertCreditCardClass: 'payment-info-panel',
                insertPayPalClass: 'payment-info-panel active'
            });
        } else {
            this.setState({
                insertCreditCardClass: 'payment-info-panel',
                insertPayPalClass: 'payment-info-panel'
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
                                            <Panel className={this.state.insertCreditCardClass} onClick={this.onSelectCreditCard} ref="creditCardCard" eventKey="1" name="creditCard">
                                                <img className="credit-card" src={require("../blank.png")} alt="blank"/>
                                                <h4>Credit Card</h4>
                                            </Panel>
                                        </Col>
                                        <Col xs={4} className="pay-pal-card">
                                            <Panel className={this.state.insertPayPalClass} onClick={this.onSelectPayPal} ref="payPalCard" eventKey="2" name="payPal">
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

                            <div className="form-group payment-card-details">
                                <Grid>
                                    <Row>
                                        <Col xs={4}>
                                            <label className="control-label">Exp Date</label>
                                            <input
                                                value={this.state.expDate}
                                                onChange={this.onChange}
                                                type="text"
                                                name="expDate"
                                                className="form-control payment-exp"
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
                                                className="form-control payment-exp"
                                                ref={(input) => { this.cvvNumberInput = input }}
                                                required
                                            />
                                        </Col>
                                    </Row>
                                </Grid>
                            </div>

                            <hr className="payment-hr"/>

                            <div className="form-group">
                                <label className="control-label">Billing Address</label>
                                <input
                                    value={this.state.billingAddress}
                                    onChange={this.onChange}
                                    type="text"
                                    name="billingAddress"
                                    className="form-control address-margin"
                                    ref={(input) => { this.billingAddressInput = input }}
                                    placeholder="12345 Street Name"
                                    required
                                />
                                <input
                                    value={this.state.billingAddress2}
                                    onChange={this.onChange}
                                    type="text"
                                    name="billingAddress2"
                                    className="form-control"
                                    ref={(input) => { this.billingAddress2Input = input }}
                                    placeholder="Apt 123"
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

                            <div className="radio-buttons">
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
