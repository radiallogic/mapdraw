import React from 'react';

import VehicleSelect from './VehicleSelect'
// import VehicleCurrent from './VehicleCurrent'
import VehicleAdd from './VehicleAdd'


export default class Vehicles extends React.Component {
    constructor(){
        super();

        this.state = {
            // expanded: false,
            button: false,
            content: ''
        }
    }

    componentDidMount = () => {
        this.setContentToDefault();
    }

    componentDidUpdate = (prevProps) => {
        //console.log(" props: ", prevProps )
        if(this.props.vehicles !== prevProps.vehicles || this.props.vehicle !== prevProps.vehicle){
            this.setContentToDefault();
        }
    } 

    setContentToDefault = () => {
        this.setState(
            {
            content: <VehicleSelect options={this.props.vehicles} select={this.select} vehicle={this.props.vehicle} />, 
            button: <button className="button is-primary is-outlined" onClick={this.add}>Add Vehicle</button> 
            }
        )
    }

    select = (event) => {
        this.props.select(event.target.value);
    }

    save = (name) =>{
        this.props.add(name);
        this.setContentToDefault();
    }

    add = () =>{
        this.setState({content:  <VehicleAdd add={this.save}/>, 
                        button: <button className="button is-primary is-outlined" onClick={this.setContentToDefault}>Cancel</button>});
    }

    render(){
        return (
            <div id="trips" className="level-item" >   
                {this.state.button}
                {this.state.content}
            </div>
        )
    }
}