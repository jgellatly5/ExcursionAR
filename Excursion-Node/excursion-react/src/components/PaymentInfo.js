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
        this.formatCardNumber = this.formatCardNumber.bind(this);
        this.formatExpDate = this.formatExpDate.bind(this);
        this.formatCvvNumber = this.formatCvvNumber.bind(this);
        this.formatZipCode = this.formatZipCode.bind(this);
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
        let stateAddress = this.stateInput.value;
        let terms = this.termsInput.checked;
        let regex = /[\d-]/g;
        if (paymentType != '0' && cardType !== '' && cardName !== '' && cardNumber !== '' && regex.test(cardNumber) &&
            expDate !== '' && regex.test(expDate) && cvvNumber !== '' && billingAddress !== '' && city !== '' &&
            zipCode !== '' && !isNaN(zipCode) && stateAddress !== '' && terms) {
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
        let cardName = this.cardNameInput.value;
        let cardType = this.cardTypeInput.value;
        let paymentType = this.state.paymentType;
        let billingAddress = this.billingAddressInput.value;
        let city = this.cityInput.value;
        let zipCode = this.zipCodeInput.value;
        let stateAddress = this.stateInput.value;
        this.props.handler(e, nextScreen, cardName, cardType, paymentType, billingAddress, city, zipCode, stateAddress);
    }
    formatCardNumber() {
        let cardNumber = this.cardNumberInput.value;
        // Regex includes any character excluding normal digits and spaces
        let regex = /[^\d ]/g;
        let first, second, third, fourth = '';
        if (cardNumber !== '') {
            // This essentially removes any character not a digit or a space from the input
            cardNumber = cardNumber.replace(regex, '');
            first = cardNumber.substr(0,5);
            if (first.length == 5) {
                first = first.substr(0,4) + '-' + first.charAt(4);
            }
            second = cardNumber.substr(5, 4);
            if (second.length == 4) {
                second = second.substr(0,3) + '-' + second.charAt(3);
            }
            third = cardNumber.substr(9, 4);
            if (third.length == 4) {
                third = third.substr(0,3) + '-' + third.charAt(3);
            }
            fourth = cardNumber.substr(13, 3);
            cardNumber = first + second + third + fourth;
            this.cardNumberInput.value = cardNumber;
        }
    }
    formatExpDate() {
        let expDate = this.expDateInput.value;
        let regex = /[^\d /]/g;
        let month, year = '';
        if (expDate !== '') {
            expDate = expDate.replace(regex, '');
            month = expDate.substr(0,3);
            if (month.length == 3) {
                month = month.substr(0,2) + '-' + month.charAt(2);
            }
            year = expDate.substr(3,1);
            expDate = month + year;
            this.expDateInput.value = expDate;
        }
    }
    formatCvvNumber() {
        let cvvNumber = this.cvvNumberInput.value;
        let regex = /[^\d]/g;
        let threeDigits = '';
        if (cvvNumber !== '') {
            cvvNumber = cvvNumber.replace(regex, '');
            threeDigits = cvvNumber.substr(0, 3);
            cvvNumber = threeDigits;
        }
        this.cvvNumberInput.value = cvvNumber;
    }
    formatZipCode() {
        let zipCode = this.zipCodeInput.value;
        let regex = /[^\d]/g;
        let fiveDigits = '';
        if (zipCode !== '') {
            zipCode = zipCode.replace(regex, '');
            fiveDigits = zipCode.substr(0, 5);
            zipCode = fiveDigits;
        }
        this.zipCodeInput.value = zipCode;
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
                    <Panel className="ad-signup-panel scroll">
                    <h1>Enter payment info</h1>
                    <p>Select a payment method</p>
                    <div>
                        <form>
                            <div className="form-group payment-method">
                                <label className="control-label" id="lastElement">Payment Method</label>
                                <Grid>
                                    <Row>
                                        <Col xs={3}>
                                            <Panel className={this.state.insertCreditCardClass} onClick={this.onSelectCreditCard} ref="creditCardCard" eventKey="1" name="creditCard">
                                                <img className="credit-card" src={require("../blank.png")} alt="blank"/>
                                                <h4>Credit Card</h4>
                                            </Panel>
                                        </Col>
                                        <Col xs={3} className="pay-pal-card">
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
                                <FormControl componentClass="select" onChange={this.onChange} inputRef={ref => { this.cardTypeInput = ref; }} value={this.props.cardType} required>
                                    <option value="visa" >Visa</option>
                                    <option value="mastercard" >Mastercard</option>
                                    <option value="discover" >Discover</option>
                                    <option value="americanExpress" >American Express</option>
                                    <option value="other" >Other...</option>
                                </FormControl>
                            </FormGroup>

                            <div className="form-group">
                                <label className="control-label">Name on Card</label>
                                <input
                                    value={this.props.cardName}
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
                                    value={this.props.cardNumber}
                                    onChange={this.onChange}
                                    name="cardNumber"
                                    type="text"
                                    className="form-control"
                                    onKeyUp={this.formatCardNumber}
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
                                                value={this.props.expDate}
                                                onChange={this.onChange}
                                                type="text"
                                                name="expDate"
                                                className="form-control payment-exp"
                                                onKeyUp={this.formatExpDate}
                                                ref={(input) => { this.expDateInput = input }}
                                                required
                                            />
                                        </Col>
                                        <Col xs={4}>
                                            <label className="control-label">CVV Number</label>
                                            <input
                                                value={this.props.cvvNumber}
                                                onChange={this.onChange}
                                                type="text"
                                                name="cvvNumber"
                                                className="form-control payment-exp"
                                                onKeyUp={this.formatCvvNumber}
                                                ref={(input) => { this.cvvNumberInput = input }}
                                                required
                                            />
                                        </Col>
                                    </Row>
                                </Grid>
                            </div>

                            <div className="payment-margin">
                                <div className="form-group">
                                    <label className="control-label">Billing Address</label>
                                    <input
                                        value={this.props.billingAddress}
                                        onChange={this.onChange}
                                        type="text"
                                        name="billingAddress"
                                        className="form-control address-margin"
                                        ref={(input) => { this.billingAddressInput = input }}
                                        placeholder="12345 Street Name"
                                        required
                                    />
                                    <input
                                        value={this.props.billingAddress2}
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
                                        value={this.props.city}
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
                                        value={this.props.zipCode}
                                        onChange={this.onChange}
                                        type="text"
                                        name="zipCode"
                                        className="form-control"
                                        onKeyUp={this.formatZipCode}
                                        ref={(input) => { this.zipCodeInput = input }}
                                        required
                                    />
                                </div>

                                {/*TODO Change default drop down style button*/}
                                <FormGroup controlId="formControlsSelect">
                                    <ControlLabel>State</ControlLabel>
                                    <FormControl componentClass="select" onChange={this.onChange} inputRef={ref => { this.stateInput = ref; }} value={this.props.stateAddress} required>
                                        <option value="N/A">N/A</option>
                                        <option value="AK">Alaska</option>
                                        <option value="AL">Alabama</option>
                                        <option value="AR">Arkansas</option>
                                        <option value="AZ">Arizona</option>
                                        <option value="CA">California</option>
                                        <option value="CO">Colorado</option>
                                        <option value="CT">Connecticut</option>
                                        <option value="DC">District of Columbia</option>
                                        <option value="DE">Delaware</option>
                                        <option value="FL">Florida</option>
                                        <option value="GA">Georgia</option>
                                        <option value="HI">Hawaii</option>
                                        <option value="IA">Iowa</option>
                                        <option value="ID">Idaho</option>
                                        <option value="IL">Illinois</option>
                                        <option value="IN">Indiana</option>
                                        <option value="KS">Kansas</option>
                                        <option value="KY">Kentucky</option>
                                        <option value="LA">Louisiana</option>
                                        <option value="MA">Massachusetts</option>
                                        <option value="MD">Maryland</option>
                                        <option value="ME">Maine</option>
                                        <option value="MI">Michigan</option>
                                        <option value="MN">Minnesota</option>
                                        <option value="MO">Missouri</option>
                                        <option value="MS">Mississippi</option>
                                        <option value="MT">Montana</option>
                                        <option value="NC">North Carolina</option>
                                        <option value="ND">North Dakota</option>
                                        <option value="NE">Nebraska</option>
                                        <option value="NH">New Hampshire</option>
                                        <option value="NJ">New Jersey</option>
                                        <option value="NM">New Mexico</option>
                                        <option value="NV">Nevada</option>
                                        <option value="NY">New York</option>
                                        <option value="OH">Ohio</option>
                                        <option value="OK">Oklahoma</option>
                                        <option value="OR">Oregon</option>
                                        <option value="PA">Pennsylvania</option>
                                        <option value="PR">Puerto Rico</option>
                                        <option value="RI">Rhode Island</option>
                                        <option value="SC">South Carolina</option>
                                        <option value="SD">South Dakota</option>
                                        <option value="TN">Tennessee</option>
                                        <option value="TX">Texas</option>
                                        <option value="UT">Utah</option>
                                        <option value="VA">Virginia</option>
                                        <option value="VT">Vermont</option>
                                        <option value="WA">Washington</option>
                                        <option value="WI">Wisconsin</option>
                                        <option value="WV">West Virginia</option>
                                        <option value="WY">Wyoming</option>
                                    </FormControl>
                                </FormGroup>

                                <div className="payment-terms">
                                    <input
                                        value="true"
                                        type="checkbox"
                                        name="termsAndConditions"
                                        className="payment-checkbox"
                                        onChange={this.onChange}
                                        ref={(input) => { this.termsInput = input }}
                                        required
                                    />
                                    <label className="control-label">I agree to Excursion{`'`}s terms and conditions</label>
                                </div>
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
