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
        this.handleSetBudgetState = this.handleSetBudgetState.bind(this);
        this.handleReviewInfoState = this.handleReviewInfoState.bind(this);
        this.handlePaymentState = this.handlePaymentState.bind(this);
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
    handleSetBudgetState(e, newScreen, dailyBudget, monthlyBudget) {
        e.preventDefault();
        this.setState({
            screen: newScreen,
            dailyBudget: dailyBudget,
            monthlyBudget: monthlyBudget
        });
    }
    handleReviewInfoState(e, newScreen) {
        e.preventDefault();
        this.setState({ screen: newScreen });
    }
    handlePaymentState(e, newScreen, cardName, cardType, paymentType, billingAddress, city, zipCode, stateAddress) {
        e.preventDefault();
        this.setState({
            screen: newScreen,
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
                            screenId={this.state.screen}
                            handlerBack={this.handleFreemiumAdInfoStateBack}
                            handlerForward={this.handleFreemiumAdInfoStateForward}
                            adName={this.state.adName}
                            genre={this.state.genre}
                            adFormat={this.state.adFormat}
                        />;
                break;
            case 3:
                child = <SetBudget
                            screenId={this.state.screen}
                            handler={this.handleSetBudgetState}
                            dailyBudget={this.state.dailyBudget}
                            monthlyBudget={this.state.monthlyBudget}
                        />;
                break;
            case 4:
                child = <ReviewInfo
                            screenId={this.state.screen}
                            handler={this.handleReviewInfoState}
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
                            screenId={this.state.screen}
                            handler={this.handlePaymentState}
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
