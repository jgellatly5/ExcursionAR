import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';

class ApiDocs extends Component{
    render() {
        return (
            <div className="bg">
                <Jumbotron>
                    <h3 className="docs">Documentation</h3>
                    <p className="docs">If you are looking for information regarding the developer API,
                    you are in the right place. To expedite your search, you can use the provided toolbar.</p>
                </Jumbotron>
            </div>
        );
    }
};

export default ApiDocs;
