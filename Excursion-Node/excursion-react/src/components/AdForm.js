import React, { Component } from 'react';
// import submitAd from '../../api/submitAd';
// import success from '../../api/success';
// import failure from '../../api/failure';
// import { Bert } from 'meteor/themeteorchef:bert';
import { Jumbotron, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class AdForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            advertisementName: '',
            companyName: '',
            contactName: '',
            industry: '',
        }
        this.baseState = this.state;
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    onSubmit(e) {
        e.preventDefault();
        // submitAd(success, failure);
        this.setState(this.baseState);
        console.log(this.state.industry);
    }
    render() {
        return (
            <div>
                <Jumbotron>
                    <h3 className="registration">Please fill out some information about your advertisement.</h3>
                </Jumbotron>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label className="control-label">Advertisement Name</label>
                        <input
                            value={this.state.advertisementName}
                            onChange={this.onChange}
                            type="text"
                            name="advertisementName"
                            className="form-control"
                        />
                    </div>

                    <FormGroup controlId="formValidationError2" validationState="error">
                        <ControlLabel>Input with error and feedback icon</ControlLabel>
                        <FormControl type="text" />
                        <FormControl.Feedback />
                    </FormGroup>

                    <div className="form-group">
                        <label className="control-label">Description</label>
                        <input
                            value={this.state.description}
                            onChange={this.onChange}
                            type="text"
                            name="description"
                            className="form-control"
                        />
                    </div>

                    <FormGroup controlId="formControlsSelect">
                        <ControlLabel>Industry</ControlLabel>
                        <FormControl className="list" componentClass="select" placeholder="Please select from the dropdown">
                            <option value={this.state.industry} name="industry">Business&Information</option>
                            <option value={this.state.industry} name="industry">Agriculture</option>
                            <option value={this.state.industry} name="industry">Construction/Contracting</option>
                            <option value={this.state.industry} name="industry">Education</option>
                            <option value={this.state.industry} name="industry">Finance&Insurance</option>
                            <option value={this.state.industry} name="industry">Food&Hospitality</option>
                            <option value={this.state.industry} name="industry">Gaming</option>
                            <option value={this.state.industry} name="industry">Health Services</option>
                            <option value={this.state.industry} name="industry">Natural/Environmental</option>
                            <option value={this.state.industry} name="industry">Other</option>
                            <option value={this.state.industry} name="industry">Personal Services</option>
                            <option value={this.state.industry} name="industry">Real Estate & Housing</option>
                            <option value={this.state.industry} name="industry">Safety/Security & Legal</option>
                            <option value={this.state.industry} name="industry">Transportation</option>
                        </FormControl>
                    </FormGroup>

                    <div className="form-group">
                        <label className="control-label">Company Name</label>
                        <input
                            value={this.state.companyName}
                            onChange={this.onChange}
                            type="text"
                            name="companyName"
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label className="control-label">Contact Name</label>
                        <input
                            value={this.state.contactName}
                            onChange={this.onChange}
                            type="text"
                            name="contactName"
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <button className="btn btn-primary btn-lg">
                            Submit Ad
                        </button>
                    </div>
                </form>
            </div>
        );
    }
};

export default AdForm;
