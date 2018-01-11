import React, { Component } from 'react';
import { Grid, Row, Col, Panel, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

const paymentTypeEnum = {
    CREDIT_CARD: 0,
    PAY_PAL: 1
}
Object.freeze(paymentTypeEnum);

class PaymentInfo extends Component{
    constructor(props) {
        super(props);
        this.state = {
            ...props,
            insertCreditCardClass: 'payment-info-panel',
            insertPayPalClass: 'payment-info-panel',
            insertPaymentTermsClass: 'payment-terms',
            insertPaymentPanelClass: 'payment-panel'
        };
        this.paymentType = paymentTypeEnum.CREDIT_CARD;
        this.onChange = this.onChange.bind(this);
        this.onSelectCreditCard = this.onSelectCreditCard.bind(this);
        this.onSelectPayPal = this.onSelectPayPal.bind(this);
        this.changeScreen = this.changeScreen.bind(this);
        this.formatCardNumber = this.formatCardNumber.bind(this);
        this.formatCardInfo = this.formatCardInfo.bind(this);
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
        let buttonNext = this.refs.buttonNext;
        let paymentType = this.paymentType;
        let cardType = this.cardTypeInput.value;
        let cardName = this.cardNameInput.value;
        let cardNumber = this.cardNumberInput.value;
        let expMonth = this.expMonthInput.value;
        let expYear = this.expYearInput.value;
        let cvvNumber = this.cvvNumberInput.value;
        let billingAddress = this.billingAddressInput.value;
        let billingAddress2 = this.billingAddress2Input.value;
        let city = this.cityInput.value;
        let zipCode = this.zipCodeInput.value;
        let stateAddress = this.stateInput.value;
        let terms = this.termsInput.checked;
        if (paymentType == 1 && terms) {
            buttonNext.classList.add('active', 'hvr-grow');
            buttonNext.removeAttribute('disabled');
        } else if (paymentType == 0 && cardType !== '' && cardName !== '' && cardNumber !== '' &&
            cardNumber.length >= 19 && expMonth !== '' &&  expMonth.length >= 2 && expYear !== '' &&
            expYear.length >= 2 && cvvNumber !== '' && cvvNumber.length >= 3 && billingAddress !== '' &&
            city !== '' && zipCode !== '' && !isNaN(zipCode) && zipCode.length >= 5 &&
            stateAddress !== 'Please Select' && terms) {
            buttonNext.classList.add('active', 'hvr-grow');
            buttonNext.removeAttribute('disabled');
        } else {
            buttonNext.classList.remove('active', 'hvr-grow');
            buttonNext.setAttribute('disabled','disabled');
        }
        this.setState({ cardType: cardType });
    }
    onSelectCreditCard(e) {
        e.preventDefault();
        this.paymentType = paymentTypeEnum.CREDIT_CARD;
        this.setState({
            paymentType: 'creditCard',
            insertCreditCardClass: 'payment-info-panel active',
            insertPayPalClass: 'payment-info-panel',
            hiddenClass: '',
            insertPaymentTermsClass: 'payment-terms',
            insertPaymentPanelClass: 'ad-signup-panel payment-panel'
        });
        this.onChange(e);
    }
    onSelectPayPal(e) {
        e.preventDefault();
        this.paymentType = paymentTypeEnum.PAY_PAL;
        this.setState({
            paymentType: 'payPal',
            insertCreditCardClass: 'payment-info-panel',
            insertPayPalClass: 'payment-info-panel active',
            hiddenClass: 'hidden',
            insertPaymentTermsClass: 'payment-terms paypal',
            insertPaymentPanelClass: 'ad-signup-panel payment-panel paypal'
        });
        this.onChange(e);
    }
    changeScreen(e) {
        e.preventDefault();
        if (e.target.name == 'back') {
            this.props.handler({...this.state});
            this.props.handleLastScreen(this.state.lastScreen);
        } else {
            this.props.handler({...this.state});
            this.props.handleNextScreen(this.state.nextScreen);
        }
    }
    formatCardNumber() {
        let cardNumber = this.cardNumberInput.value;
        // Regex includes any character excluding normal digits and spaces
        let regex = /[^\d]/g;
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
            this.setState({ cardNumber: cardNumber });
        }
    }
    formatCardInfo(e) {
        let regex = /[^\d]/g;
        e.target.value = e.target.value.replace(regex, '');
        if (e.target.name == "zipCode") {
            e.target.value = e.target.value.substr(0,5);
        } else if (e.target.name == "cvvNumber") {
            e.target.value = e.target.value.substr(0,3);
        } else {
            e.target.value = e.target.value.substr(0,2);
        }
        this.setState({ [e.target.name]: e.target.value });
    }
    componentDidMount() {
        const {paymentType} = this.props;
        let buttonNext = this.refs.buttonNext;
        buttonNext.setAttribute('disabled','disabled');
        if (paymentType == 'payPal') {
            this.paymentType = paymentTypeEnum.PAY_PAL;
            this.setState({
                paymentType: 'payPal',
                insertCreditCardClass: 'payment-info-panel',
                insertPayPalClass: 'payment-info-panel active',
                hiddenClass: 'hidden',
                insertPaymentTermsClass: 'payment-terms paypal',
                insertPaymentPanelClass: 'ad-signup-panel payment-panel paypal'
            });
        } else {
            this.paymentType = paymentTypeEnum.CREDIT_CARD;
            this.setState({
                paymentType: 'creditCard',
                insertCreditCardClass: 'payment-info-panel active',
                insertPayPalClass: 'payment-info-panel',
                hiddenClass: '',
                insertPaymentTermsClass: 'payment-terms',
                insertPaymentPanelClass: 'ad-signup-panel payment-panel'
            });
        }
    }
    render() {
        return (
            <div className="ad-signup-container">
                <div className="ad-signup payment-info" id="fix-margin">
                    <Panel className={this.state.insertPaymentPanelClass}>
                    <div className="payment-fix">
                        <h1 className="payment-header">Enter payment info</h1>
                        <p className="payment-para">Select a payment method</p>
                        <div>
                            <form>
                                <Grid>
                                    <Row>
                                        <Col xs={6}>
                                            <div className="form-group payment-method">
                                                <label className="control-label" id="lastElement">Payment Method</label>
                                                <Grid>
                                                    <Row>
                                                        <Col xs={3}>
                                                            <Panel className={this.state.insertCreditCardClass} onClick={this.onSelectCreditCard} name="creditCard">
                                                                <img className="credit-card" src={require("../blank.png")} alt="blank"/>
                                                                <h4>Credit Card</h4>
                                                            </Panel>
                                                        </Col>
                                                        <Col xs={3} className="pay-pal-card">
                                                            <Panel className={this.state.insertPayPalClass} onClick={this.onSelectPayPal} name="payPal">
                                                                <img src={require("../pay_pal.png")} alt="pay pal"/>
                                                                <h4>PayPal</h4>
                                                            </Panel>
                                                        </Col>
                                                    </Row>
                                                </Grid>
                                            </div>

                                            <div className={this.state.hiddenClass}>
                                            {/*TODO Change default drop down style button*/}
                                                <FormGroup controlId="formControlsSelect">
                                                    <ControlLabel>Card Type</ControlLabel>
                                                    <FormControl componentClass="select" onChange={this.onChange} inputRef={ref => { this.cardTypeInput = ref; }} name="cardType" value={this.state.cardType} required>
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
                                                            <Col xs={2}>
                                                                <label className="control-label">Exp Month</label>
                                                                <input
                                                                    value={this.state.expMonth}
                                                                    onChange={this.onChange}
                                                                    type="text"
                                                                    name="expMonth"
                                                                    className="form-control payment-exp"
                                                                    onKeyUp={this.formatCardInfo}
                                                                    ref={(input) => { this.expMonthInput = input }}
                                                                    placeholder="MM"
                                                                    required
                                                                />
                                                            </Col>
                                                            <Col xs={2}>
                                                                <label className="control-label">Exp Year</label>
                                                                <input
                                                                    value={this.state.expYear}
                                                                    onChange={this.onChange}
                                                                    type="text"
                                                                    name="expYear"
                                                                    className="form-control payment-exp"
                                                                    onKeyUp={this.formatCardInfo}
                                                                    ref={(input) => { this.expYearInput = input }}
                                                                    placeholder="YY"
                                                                    required
                                                                />
                                                            </Col>
                                                            <Col xs={2}>
                                                                <label className="control-label">CVV Number</label>
                                                                <input
                                                                    value={this.state.cvvNumber}
                                                                    onChange={this.onChange}
                                                                    type="text"
                                                                    name="cvvNumber"
                                                                    className="form-control payment-exp"
                                                                    onKeyUp={this.formatCardInfo}
                                                                    ref={(input) => { this.cvvNumberInput = input }}
                                                                    required
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </Grid>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={6} className="column-2">
                                            <div className="payment-margin">

                                                <div className={this.state.hiddenClass}>
                                                    <div className="form-group">
                                                        <label className="control-label billing-address">Billing Address</label>
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
                                                        <label className="control-label city-town">City/Town</label>
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
                                                            onKeyUp={this.formatCardInfo}
                                                            ref={(input) => { this.zipCodeInput = input }}
                                                            required
                                                        />
                                                    </div>

                                                    {/*TODO Change default drop down style button*/}
                                                    <FormGroup controlId="formControlsSelect" className="state-address">
                                                        <ControlLabel>State</ControlLabel>
                                                        <FormControl componentClass="select" onChange={this.onChange} inputRef={ref => { this.stateInput = ref; }} value={this.state.stateAddress} name="stateAddress" required>
                                                            <option value="Please Select">Please Select</option>
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
                                                </div>

                                                {/*TODO Customize the checkbox when checked*/}
                                                <div className={this.state.insertPaymentTermsClass}>
                                                    <input
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
                                        </Col>
                                    </Row>
                                </Grid>
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
                    </div>
                    </Panel>
                </div>
            </div>
        );
    }
};

export default PaymentInfo;
