import React from 'react';

import TripAddEdit from './TripAddEdit'
import TripSelect from './TripSelect'


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
        if(this.props.trips !== prevProps.trips || this.props.id !== prevProps.id ){
            this.setContentToDefault();
        }
    } 

    select = (id) => {
        console.log('trip ', id);
        this.props.select(id);
    }


    setContentToDefault = () => {

        console.log('in trips, setContentToDefault: ', this.props.name ); 

        this.setState(
            {
            content: <TripSelect 
                        name={this.props.name}
                        id={this.props.id}
                        select={this.select}
                        edit={this.addedit}
                        options={this.props.trips}
                        setContentToDefault={this.setContentToDefault}
                    />, 
            button: <button className="button is-primary is-outlined" onClick={this.addedit}>Add Trip</button> 
            }
        )
    }

    save = (name) =>{
        console.log('save function');
        this.props.save(name);
        this.setContentToDefault();
    }

    addedit = () =>{
        console.log('add function');
        this.setState({content: <TripAddEdit
                                        name={this.props.name}
                                        save={this.props.save} 
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