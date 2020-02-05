import React from 'react';

import VehicleSelect from './VehicleSelect'

export default class Vehicles extends React.Component {
    constructor(){
        super();
    }

    render(){

        return (
            <div id="vehicles" className="level-item" >
                <VehicleSelect options={this.props.vehicles} />\
            </div>
        )
    }
}