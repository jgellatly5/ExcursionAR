import React, { Component } from 'react';
import { IndexLink, Link } from 'react-router';
// import logout from '../../api/logout';
// import success from '../../api/success';
// import failure from '../../api/failure';
import { Navbar, Nav, NavItem} from 'react-bootstrap';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';

class Navigation extends Component{
    constructor(props) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
    }
    onSelect() {
        // logout(success, failure);
    }
    render() {
            return (
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            Excursion
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                    <Nav id="cssmenu">
                        <IndexLinkContainer to="/">
                            <NavItem eventKey={ 1 } className="hvr-underline-from-left-white">Home</NavItem>
                        </IndexLinkContainer>
                        <LinkContainer to="/learnMore">
                            <NavItem eventKey={ 2 } className="hvr-underline-from-left-white">Learn More</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/getStarted">
                            <NavItem eventKey={ 3 } className="hvr-underline-from-left-white">Get Started</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/contact">
                            <NavItem eventKey={ 4 } className="hvr-underline-from-left-white">Contact</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/signup">
                            <NavItem eventKey={ 5 } className="hvr-underline-from-left-white">Signup</NavItem>
                        </LinkContainer>
                    </Nav>
                    {/*<Nav pullRight>
                        <LinkContainer to="/signup">
                            <NavItem eventKey={ 1 } className="hvr-grow">Advertiser Signup</NavItem>
                        </LinkContainer>
                    </Nav>*/}
                    </Navbar.Collapse>
                </Navbar>
            );
    }
};

export default Navigation;
