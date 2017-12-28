import React, { Component } from 'react';
import { Grid, Row, Col, Panel } from 'react-bootstrap';

class ReviewInfo extends Component{
    constructor(props) {
        super(props);
        this.changeScreen = this.changeScreen.bind(this);
    }
    changeScreen(e) {
        let nextScreen;
        if (e.target.name == 'back') {
            nextScreen = this.props.screenId - 1;
        } else {
            nextScreen = this.props.screenId + 1;
        }
        let firstName = this.props.firstName;
        let lastName = this.props.lastName;
        let email = this.props.email;
        let companyName = this.props.companyName;
        let industry = this.props.industry;
        let phoneNumber = this.props.phoneNumber;
        let website = this.props.website;
        let adName = this.props.adName;
        let genre = this.props.genre;
        let adFormat = this.props.adFormat;
        let dailyBudget = this.props.dailyBudget;
        let monthlyBudget = this.props.monthlyBudget;
        this.props.handler(e, nextScreen, firstName, lastName, email, companyName, industry, phoneNumber, website, adName, genre, adFormat, dailyBudget, monthlyBudget);
    }
    render() {
        return (
            <div className="ad-signup-container">
                <div className="ad-signup" id="fix-margin">
                    <Panel className="ad-signup-panel">
                        <div className="review-ad-container">
                            <h1>Review your information</h1>
                            <p>Review your ad and your settings</p>
                            <form>
                                <Grid>
                                    <Row>
                                        <Col xs={6} className="right-side-review">
                                            <div className="form-group">
                                                <label className="control-label">Name</label>
                                                <p className="ad-type">{this.props.firstName} {this.props.lastName}</p>
                                            </div>

                                            <div className="form-group">
                                                <label className="control-label">Email</label>
                                                <p className="ad-type">{this.props.email}</p>
                                            </div>

                                            <div className="form-group">
                                                <label className="control-label">Industry</label>
                                                <p className="ad-type">{this.props.industry}</p>
                                            </div>

                                            <div className="form-group">
                                                <label className="control-label">Phone Number</label>
                                                <p className="ad-type">{this.props.phoneNumber}</p>
                                            </div>

                                            <div className="form-group">
                                                <label className="control-label">Website</label>
                                                <p className="ad-type">{this.props.website}</p>
                                            </div>
                                        </Col>
                                        <Col xs={6} className="right-side-review">
                                            <div className="form-group">
                                                <label className="control-label">Company/Product Name</label>
                                                <p className="ad-type">{this.props.companyName}</p>
                                            </div>

                                            <div className="form-group">
                                                <label className="control-label">Ad Name</label>
                                                <p className="ad-type">{this.props.adName}</p>
                                            </div>

                                            <div className="form-group">
                                                <label className="control-label">Genre</label>
                                                <p className="ad-type">{this.props.genre}</p>
                                            </div>

                                            <div className="form-group">
                                                <label className="control-label">Format</label>
                                                <p className="ad-type">{this.props.adFormat}</p>
                                            </div>

                                            <div className="form-group">
                                                <label className="control-label">Budget Amount</label>
                                                <p className="ad-type">${this.props.dailyBudget} per day</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </Grid>
                            </form>
                        </div>
                        <div className="bottom-form review-ad-bottom">
                            <button className="btn btn-lg back hvr-grow" ref="buttonBack" name="back" onClick={this.changeScreen}>
                                Back
                            </button>
                            <button className="btn btn-lg looks-great active hvr-grow" ref="buttonNext" name="next" onClick={this.changeScreen}>
                                <div className="looks-great-text align-middle">Looks Great</div>
                            </button>
                        </div>
                    </Panel>
                </div>
            </div>
        );
    }
};

export default ReviewInfo;
