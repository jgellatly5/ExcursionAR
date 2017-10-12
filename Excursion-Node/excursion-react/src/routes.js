import React from 'react';
import { render } from 'react-dom';
import { Router, Route } from 'react-router';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import AdForm from './components/AdForm';
import GoalForm from './components/GoalForm';
import TempSignup from './components/TempSignup';
import NotFound from './components/NotFound';
import GetStarted from './components/GetStarted';
import LearnMore from './components/LearnMore';
import ContactForm from './components/ContactForm';
import ApiDocs from './components/ApiDocs';
// import Dashboard from './components/Dashboard';
import AppLayout from './components/AppLayout';
// import '.././public/index.html';

const Routes = (props) => (
    <Router {...props}>
        <Route path="/" component={AppLayout}>
            <Route component={Home} />
            <Route path="/login" component={LoginForm} />
            {/*<Route path="/signup" component={SignupForm} />*/}
            <Route path="/getStarted" component={GetStarted} />
            <Route path="/learnMore" component={LearnMore} />
            <Route path="/contact" component={ContactForm} />
            <Route path="/docs" component={ApiDocs} />
            <Route path="/createAd" component={AdForm} />
            <Route path="/goalAd" component={GoalForm} />
            <Route path="/signup" component={TempSignup} />
        </Route>
        <Route path="*" component={NotFound} />
    </Router>
);

export default Routes;
