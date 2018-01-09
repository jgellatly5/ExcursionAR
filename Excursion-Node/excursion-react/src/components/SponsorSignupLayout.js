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
        this.handleSponsorFormState = this.handleSponsorFormState.bind(this);
        this.handleSponsorFormBusinessInfoStateBack = this.handleSponsorFormBusinessInfoStateBack.bind(this);
        this.handleSponsorFormBusinessInfoStateForward = this.handleSponsorFormBusinessInfoStateForward.bind(this);
        this.handleFreemiumAdInfoStateBack = this.handleFreemiumAdInfoStateBack.bind(this);
        this.handleFreemiumAdInfoStateForward = this.handleFreemiumAdInfoStateForward.bind(this);
        this.handleSetBudgetStateBack = this.handleSetBudgetStateBack.bind(this);
        this.handleSetBudgetStateForward = this.handleSetBudgetStateForward.bind(this);
        this.handleReviewInfoStateBack = this.handleReviewInfoStateBack.bind(this);
        this.handleReviewInfoStateForward = this.handleReviewInfoStateForward.bind(this);
        this.handlePaymentStateBack = this.handlePaymentStateBack.bind(this);
        this.handlePaymentStateForward = this.handlePaymentStateForward.bind(this);
        this.state = {
            screen: 0,
            isScreenChanging: false
        };
    }
    componentDidMount() {
        this.setState({ isScreenChanging: true });
    }
    handleSponsorFormState(sponsor_form) {
        this.setState({
            screen: sponsor_form.nextScreen,
            firstName: sponsor_form.firstName,
            lastName: sponsor_form.lastName,
            email: sponsor_form.email
        });
    }
    handleSponsorFormBusinessInfoStateBack(sponsor_form) {
        this.setState({
            screen: sponsor_form.lastScreen,
            companyName: sponsor_form.companyName,
            industry: sponsor_form.industry,
            phoneNumber: sponsor_form.phoneNumber,
            website: sponsor_form.website
        });
    }
    handleSponsorFormBusinessInfoStateForward(sponsor_form) {
        this.setState({
            screen: sponsor_form.nextScreen,
            companyName: sponsor_form.companyName,
            industry: sponsor_form.industry,
            phoneNumber: sponsor_form.phoneNumber,
            website: sponsor_form.website
        });
    }
    handleFreemiumAdInfoStateBack(sponsor_form) {
        this.setState({
            screen: sponsor_form.lastScreen,
            adName: sponsor_form.adName,
            genre: sponsor_form.genre,
            adFormat: sponsor_form.adFormat
        });
    }
    handleFreemiumAdInfoStateForward(sponsor_form) {
        this.setState({
            screen: sponsor_form.nextScreen,
            adName: sponsor_form.adName,
            genre: sponsor_form.genre,
            adFormat: sponsor_form.adFormat
        });
    }
    handleSetBudgetStateBack(sponsor_form) {
        this.setState({
            screen: sponsor_form.lastScreen,
            dailyBudget: sponsor_form.dailyBudget,
            monthlyBudget: sponsor_form.monthlyBudget
        });
    }
    handleSetBudgetStateForward(sponsor_form) {
        this.setState({
            screen: sponsor_form.nextScreen,
            dailyBudget: sponsor_form.dailyBudget,
            monthlyBudget: sponsor_form.monthlyBudget
        });
    }
    handleReviewInfoStateBack(sponsor_form) {
        this.setState({ screen: sponsor_form.lastScreen });
    }
    handleReviewInfoStateForward(sponsor_form) {
        this.setState({ screen: sponsor_form.nextScreen });
    }
    handlePaymentStateBack(sponsor_form) {
        this.setState({
            screen: sponsor_form.lastScreen,
            cardName: sponsor_form.cardName,
            cardType: sponsor_form.cardType,
            paymentType: sponsor_form.paymentType,
            billingAddress: sponsor_form.billingAddress,
            city: sponsor_form.city,
            zipCode: sponsor_form.zipCode,
            stateAddress: sponsor_form.stateAddress
        });
    }
    handlePaymentStateForward(sponsor_form) {
        this.setState({
            screen: sponsor_form.nextScreen,
            cardName: sponsor_form.cardName,
            cardType: sponsor_form.cardType,
            paymentType: sponsor_form.paymentType,
            billingAddress: sponsor_form.billingAddress,
            city: sponsor_form.city,
            zipCode: sponsor_form.zipCode,
            stateAddress: sponsor_form.stateAddress
        });
    }
    render() {
        let child;
        switch(this.state.screen) {
            case 0:
                if (this.state.isScreenChanging) {
                    child = <SponsorForm
                                handler={this.handleSponsorFormState}
                                firstName={this.state.firstName}
                                lastName={this.state.lastName}
                                email={this.state.email}
                            />;
                }
                break;
            case 1:
                child = <SponsorForm_BusinessInformation
                            handlerBack={this.handleSponsorFormBusinessInfoStateBack}
                            handlerForward={this.handleSponsorFormBusinessInfoStateForward}
                            companyName={this.state.companyName}
                            industry={this.state.industry}
                            phoneNumber={this.state.phoneNumber}
                            website={this.state.website}
                        />;
                break;
            // This case will be released when sponsor can choose between freemium or premium membership
            // case 2:
            //     child = <ChooseService screenId={this.state.screen} handler={this.handleScreenChange}/>;
            //     break;
            case 2:
                child = <Freemium_AdInfo
                            handlerBack={this.handleFreemiumAdInfoStateBack}
                            handlerForward={this.handleFreemiumAdInfoStateForward}
                            adName={this.state.adName}
                            genre={this.state.genre}
                            adFormat={this.state.adFormat}
                        />;
                break;
            case 3:
                child = <SetBudget
                            handlerBack={this.handleSetBudgetStateBack}
                            handlerForward={this.handleSetBudgetStateForward}
                            dailyBudget={this.state.dailyBudget}
                            monthlyBudget={this.state.monthlyBudget}
                        />;
                break;
            case 4:
                child = <ReviewInfo
                            handlerBack={this.handleReviewInfoStateBack}
                            handlerForward={this.handleReviewInfoStateForward}
                            firstName={this.state.firstName}
                            lastName={this.state.lastName}
                            email={this.state.email}
                            companyName={this.state.companyName}
                            industry={this.state.industry}
                            phoneNumber={this.state.phoneNumber}
                            website={this.state.website}
                            adName={this.state.adName}
                            genre={this.state.genre}
                            adFormat={this.state.adFormat}
                            dailyBudget={this.state.dailyBudget}
                        />;
                break;
            case 5:
                child = <PaymentInfo
                            handlerBack={this.handlePaymentStateBack}
                            handlerForward={this.handlePaymentStateForward}
                            cardName={this.state.cardName}
                            cardType={this.state.cardType}
                            paymentType={this.state.paymentType}
                            billingAddress={this.state.billingAddress}
                            city={this.state.city}
                            zipCode={this.state.zipCode}
                            stateAddress={this.state.stateAddress}
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
