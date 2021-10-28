import * as React from "react"

import VehicleSelect from './VehicleSelect'
// import VehicleCurrent from './VehicleCurrent'
import VehicleAdd from './VehicleAdd'
import { Option } from "../Types"

type Props = {
    vehicles: Array<Option>;
    vehicle: string;

    select: Function;
    add: Function;
}

type State = {
    button: React.ReactElement;
    content: React.ReactElement;
}

export default class Vehicles extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            button: <></>,
            content: <></>
        }
    }

    componentDidMount = () => {
        this.setContentToDefault();
    }

    componentDidUpdate = (prevProps: Props) => {
        //console.log(" props: ", prevProps )
        if(this.props.vehicles !== prevProps.vehicles || this.props.vehicle !== prevProps.vehicle){
            this.setContentToDefault();
        }
    } 

    setContentToDefault = () => {
        this.setState(
            {
            content: <VehicleSelect options={this.props.vehicles} select={this.select} vehicle={this.props.vehicle} />, 
            button: <button className="btn" onClick={this.add}>Add Vehicle</button> 
            }
        )
    }

    select = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.select(event.target.value);
    }

    save = (name: string) =>{
        this.props.add(name);
        this.setContentToDefault();
    }

    add = () =>{
        this.setState({content:  <VehicleAdd add={this.save}/>, 
                        button: <button className="btn" onClick={this.setContentToDefault}>Cancel</button>});
    }

    render(){
        return (
            <div id="trips" className="level-item" >   
                {this.state.button} {this.state.content}
            </div>
        )
    }
}