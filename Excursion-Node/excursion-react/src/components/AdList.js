import React, { Component } from 'react';
import AdDetail from './AdDetail';
// import ListAdContainer from '../containers/ListAdContainer';
// import { createContainer } from 'meteor/react-meteor-data';
// import { Meteor } from 'meteor/meteor';
// import Advertisements from '../.././api/advertisements/advertisements';
import { Panel } from 'react-bootstrap';

export class AdList extends Component{
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div>
                <Panel header={title}>
                    {this.props.advertisements.map(
                        (advertisement) => <AdDetail key={advertisement._id} advertisement={advertisement}/>)}
                 </Panel>
            </div>
        );
    }
}

const title = (
    <h1>Dashboard</h1>
);

// export default ListContainer = createContainer(() => {
//     const PER_PAGE = 10;
//     const subscription = Meteor.subscribe('advertisements.list', PER_PAGE);
//     const loading = !subscription.ready();
//     const advertisements = Advertisements.find({ ownerId: Meteor.userId() }).fetch();
//     return { loading, advertisements };
// }, AdList);
