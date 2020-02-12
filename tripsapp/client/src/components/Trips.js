import React from 'react';

import TripAdd from './TripAdd'
import TripSelect from './TripSelect'
import TripTitle from './TripTitle'


class Trips extends React.Component {
    constructor(){
        super();

        this.state = {
            // expanded: false,
            add: false,
            content: ''
        }
    }

    componentDidMount = () => {
        this.setContentToDefault();
    }

    componentDidUpdate = (prevProps) => {
        //console.log(" props: ", prevProps )
        if(this.props.trips !== prevProps.trips){
            this.setContentToDefault();
        }
    } 

    select = (id) => {
        console.log('trip ', id);
        this.props.select(id);
    }

    setContentToDefault = () => {
        this.setState(
            {
            content: <TripSelect 
                        trip={this.props.trip}
                        select={this.select}
                        options={this.props.trips}
                        setContentToDefault={this.setContentToDefault}
                    />, 
            button: <button className="button is-primary is-outlined" onClick={this.add}>Add Trip</button> 
            }
        )
    }

    save = (name) =>{
        console.log('save function');
        this.props.save(name);
        this.setContentToDefault();
    }

    add = () =>{
        console.log('add function');
        this.setState({content: <TripAdd save={this.props.save} 
                                         setContentToDefault={this.setContentToDefault} />, 
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

export default Trips;