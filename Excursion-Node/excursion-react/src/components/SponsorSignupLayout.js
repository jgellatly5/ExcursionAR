import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SponsorForm from "./SponsorForm";
import SponsorForm_BusinessInformation from "./SponsorForm_BusinessInformation";
// Not necessary until premium version is offered
// import ChooseService from './ChooseService';
import Freemium_AdInfo from './Freemium_AdInfo';
import SetBudget from './SetBudget';
import ReviewInfo from './ReviewInfo';
import PaymentInfo from './PaymentInfo';

class SponsorSignupLayout extends Component {
    constructor(props) {
        super(props);
        this.handleLastScreen = this.handleLastScreen.bind(this);
        this.handleNextScreen = this.handleNextScreen.bind(this);
        this.handleSponsorFormState = this.handleSponsorFormState.bind(this);
        this.handleSponsorFormBusinessInfoState = this.handleSponsorFormBusinessInfoState.bind(this);
        this.handleFreemiumAdInfoState = this.handleFreemiumAdInfoState.bind(this);
        this.handleSetBudgetState = this.handleSetBudgetState.bind(this);
        this.handlePaymentState = this.handlePaymentState.bind(this);
        this.state = {
            screen: 0,
            isScreenChanging: false
        };
    }
    componentDidMount() {
        this.setState({ isScreenChanging: true });
    }
    handleLastScreen(screen) {
        this.setState({ screen: screen });
    }
    handleNextScreen(screen) {
        this.setState({ screen: screen });
    }
    handleSponsorFormState(sponsor_form) {
        const {firstName, lastName, email} = sponsor_form;
        this.setState({
            firstName: firstName,
            lastName: lastName,
            email: email
        });
    }
    handleSponsorFormBusinessInfoState(sponsor_form) {
        const {companyName, industry, phoneNumber, website} = sponsor_form;
        this.setState({
            companyName: companyName,
            industry: industry,
            phoneNumber: phoneNumber,
            website: website
        });
    }
    handleFreemiumAdInfoState(sponsor_form) {
        const {adName, genre, adFormat} = sponsor_form;
        this.setState({
            adName: adName,
            genre: genre,
            adFormat: adFormat
        });
    }
    handleSetBudgetState(sponsor_form) {
        const {dailyBudget, monthlyBudget} = sponsor_form;
        this.setState({
            dailyBudget: dailyBudget,
            monthlyBudget: monthlyBudget
        });
    }
    handlePaymentState(sponsor_form) {
        const {cardName, cardType, paymentType, billingAddress, city, zipCode, stateAddress} = sponsor_form;
        this.setState({
            cardName: cardName,
            cardType: cardType,
            paymentType: paymentType,
            billingAddress: billingAddress,
            city: city,
            zipCode: zipCode,
            stateAddress: stateAddress
        });
    }
    render() {
        let child;
        const {
            firstName, lastName, email, companyName, industry, phoneNumber,
            website, adName, genre, adFormat, dailyBudget, monthlyBudget,
            cardName, cardType, paymentType, billingAddress, city, zipCode, stateAddress
        } = this.state;
        switch(this.state.screen) {
            case 0:
                if (this.state.isScreenChanging) {
                    child = <SponsorForm
                                handler={this.handleSponsorFormState}
                                handleNextScreen={this.handleNextScreen}
                                firstName={firstName}
                                lastName={lastName}
                                email={email}
                            />;
                }
                break;
            case 1:
                child = <SponsorForm_BusinessInformation
                            handler={this.handleSponsorFormBusinessInfoState}
                            handleLastScreen={this.handleLastScreen}
                            handleNextScreen={this.handleNextScreen}
                            companyName={companyName}
                            industry={industry}
                            phoneNumber={phoneNumber}
                            website={website}
                        />;
                break;
            // This case will be released when sponsor can choose between freemium or premium membership
            // case 2:
            //     child = <ChooseService screenId={this.state.screen} handler={this.handleScreenChange}/>;
            //     break;
            case 2:
                child = <Freemium_AdInfo
                            handler={this.handleFreemiumAdInfoState}
                            handleLastScreen={this.handleLastScreen}
                            handleNextScreen={this.handleNextScreen}
                            adName={adName}
                            genre={genre}
                            adFormat={adFormat}
                        />;
                break;
            case 3:
                child = <SetBudget
                            handler={this.handleSetBudgetState}
                            handleLastScreen={this.handleLastScreen}
                            handleNextScreen={this.handleNextScreen}
                            dailyBudget={dailyBudget}
                            monthlyBudget={monthlyBudget}
                        />;
                break;
            case 4:
                child = <ReviewInfo
                            handleLastScreen={this.handleLastScreen}
                            handleNextScreen={this.handleNextScreen}
                            firstName={firstName}
                            lastName={lastName}
                            email={email}
                            companyName={companyName}
                            industry={industry}
                            phoneNumber={phoneNumber}
                            website={website}
                            adName={adName}
                            genre={genre}
                            adFormat={adFormat}
                            dailyBudget={dailyBudget}
                        />;
                break;
            case 5:
                child = <PaymentInfo
                            handler={this.handlePaymentState}
                            handleLastScreen={this.handleLastScreen}
                            handleNextScreen={this.handleNextScreen}
                            cardName={cardName}
                            cardType={cardType}
                            paymentType={paymentType}
                            billingAddress={billingAddress}
                            city={city}
                            zipCode={zipCode}
                            stateAddress={stateAddress}
                        />
                break;
            default:
                break;
        }
        return(
            <div>
                <ReactCSSTransitionGroup
                    transitionName="sponsor"
                    transitionEnterTimeout={2000}
                    transitionLeaveTimeout={2000}
                >
                    {child}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

export default SponsorSignupLayout;
