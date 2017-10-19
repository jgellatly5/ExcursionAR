import React, { Component } from 'react';
import { Link } from 'react-router';
import { Jumbotron, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class LearnMore extends Component{
    render() {
        return (
            <div className="learnmore">
                <Jumbotron className="learnmore-header">
                    <h1 className="getstarted">Learn More/FAQ</h1>
                    <p className="getstarted">Want to know more about Excursion?
                    Browse through our frequently asked questions.</p>
                </Jumbotron>
                <div className="getstarted">
                    <h2>What is Excursion?</h2>
                    <p>Excursion is an augmented reality (AR) ad platform that allows publishers to place
                    3 dimensional augmented reality advertisements into their mobile applications. Extending upon
                    current AR toolkits, Excursion provides a software development kit (SDK) for iOS developers
                    using ARKit and Android developers using ARCore to use in their code base to contextually place
                    ads in the user experience.
                    <br/>
                    <br/>
                    In tandem with the services provided to publishers, we also provide
                    services to sponsors looking to use AR as a new medium to target consumers. Using an online
                    web application, we allow sponsors to signup and bid for ad space within certain AR applications.
                    Then in their dashboard, sponsors can track their ad{`'`}s performance and view their daily budget.
                    This relationship between publisher and sponsor will provide a new ecosystem for the AR industry to thrive upon.</p>
                </div>
                <div className="getstarted">
                    <p>Features of Excursion include:</p>
                    <ul>
                        <li>publisher Portal for API key management</li>
                        <li>SDK for easy integration within AR applications</li>
                        <li>Advertisement dashboard and ad tracking system</li>
                    </ul>
                </div>
                <hr/>
                <div className="getstarted">
                    <h2>Why are we doing this?</h2>
                    <p>Excursion is a solution to an elusive problem that both the AR and VR industry
                    are dealing with. Content creators and publishers are reluctant to create
                    new experiences for customers with AR hardware because there is not a large
                    enough consumer base worth pursuing to spend time or money on for a profit.
                    On the other hand, consumers are not willing to purchase the hardware for lack
                    of available content. If this problem is not solved, augmented reality will
                    have a hard time progressing. <br/>
                    <br/>
                    Enter Excursion. <br/>
                    <br/>
                    This new tool will allow content creators to monetize their newly developed AR creations,
                    fueling a desire to continue creating experiences and facilitating a steady cycle of production
                    and consumption that will pull users into the AR space. Excursion will allow publishers and sponsors to connect
                    and share the market that the AR industry has to offer and users will receive high quality content in return.</p>
                </div>
                <hr/>
                {/*<div className="getstarted">
                    <h2>What is Augmented Reality?</h2>
                    <p>Augmented reality, abbreviated AR, is an experience where digital information
                    is overlaid onto the field-of-view of the user donning a specific piece of hardware
                    such as a visor or helmet or alternatively using a camera on a smart phone to show
                    information overlaid upon the real world that would otherwise not exist. <br/>
                    <br/>
                    Examples of this include Snapchat filters that allow you to change your face into a dog, the popular Pokemon Go application
                    that lets users travel around town and swipe on their phones to throw balls and capture creatures, and
                    even in sports, the yellow or blue lines on a television that indicate the yardage to a first down in American football.<br/>
                    <br/>
                    In contrast, virtual reality, or VR, is an experience where a user puts on a headset that attempts to
                    cover the users entire field-of-view and creates an entirely immersive experience that lets one feel like
                    they are living inside of a video game.</p>
                </div>
                <hr/>*/}
                <div className="getstarted">
                    <h2>If I am a sponsor (advertiser), how do I register?</h2>
                    <p>To get started, <Link to="/signup">Sign up</Link> for a user account.
                    Please check that you are an sponsor, you will be routed to a special online form
                    to fill out information for the company or entity you represent. Your online dashboard will display your advertisement
                    history, the price/view that was set for the advertisement, the current budget for the project and the max daily budget per daily,
                    and the performance of ads that are currently live. For more information on how pricing works, please Contact Us.</p>
                </div>
                <hr/>
                <div className="getstarted">
                    <h2>If I am a publisher (developer), how do I register?</h2>
                    <p>We currently are in development of the SDK and are taking registration requests
                    for the publishers who are interested in testing the Excursion beta. When the SDK is ready, you will be routed to the developer portal dashboard.
                    Here you can access which apps are registered with Excursion, which API keys are
                    currently active, and the amount of money generated from your applications.</p>
                </div>
                <hr/>
                <div className="getstarted">
                    <h2>Is Excursion free to use?</h2>
                    <p>Yes! We do not charge sponsors to register with the platform or publishers to use the SDK.
                    Money is only involved when a sponsor sets their budget, chooses their cost-per-impression, and
                    the resulting ad is viewed by the user. Our current revenue share model is 60-40 where the publisher
                    receives 60% of the generated revenue and Excursion receives the rest. The publisher gets paid, the
                    sponsor successfully captures the user, the user continues engaging with the app and everyone is happy!</p>
                </div>
                <div className="greywrap">
                    <Jumbotron className="contactfooter">
                        <h1>Still have questions?</h1>
                        <p>
                            <LinkContainer to="/contact">
                                <Button bsStyle="primary" className="contactbutton hvr-grow">
                                    Contact Us
                                </Button>
                            </LinkContainer>
                        </p>
                    </Jumbotron>
                </div>
                <footer className="footer-distributed">
                <hr/>
        			{/*<div className="footer-right">
        				<a href="#" className="hvr-grow"><i className="fa fa-facebook"></i></a>
        				<a href="#" className="hvr-grow"><i className="fa fa-twitter"></i></a>
        				<a href="#" className="hvr-grow"><i className="fa fa-linkedin"></i></a>
        				<a href="#" className="hvr-grow"><i className="fa fa-github"></i></a>
        			</div>*/}
        			<div className="footer-left">
                        <p className="footer-links">
                            <a href="/" className="hvr-underline-from-left-white">Home</a>
                            |
                            <a href="/learnMore" className="hvr-underline-from-left-white">FAQ</a>
                            |
                            <a href="/getStarted" className="hvr-underline-from-left-white">Get Started</a>
                            {/*|
                            <a href="#" className="hvr-underline-from-left">API Docs</a>*/}
                            |
                            <a href="/contact" className="hvr-underline-from-left-white">Contact</a>
                        </p>
        				<p>Excursion &copy; 2017</p>
        			</div>
                </footer>
            </div>
        );
    }
};

export default LearnMore;
