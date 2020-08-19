import React from 'react';

import TripAddEdit from './TripAddEdit'
import TripSelect from './TripSelect'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsAlt, faEdit, faMapMarker, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

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
        // console.log(" prev props: ", prevProps.name );
        // console.log(" props: ", this.props.name );

        if(this.props.trips !== prevProps.trips ||
             this.props.id !== prevProps.id || 
             this.props.name !== prevProps.name ){

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
                        edit={this.edit}
                        options={this.props.trips}
                        setContentToDefault={this.setContentToDefault}
                    />, 
            button: <button id="add" className="button is-primary is-outlined" onClick={this.add}>Add Trip</button> 
            }
        )
    }

    save = (name, addedit) =>{
        //console.log('save function ... ', addedit  );
        if(addedit == "add"){
            //console.log(' HERE: ', addedit  );
            this.props.savenew(name);
        }else{
            this.props.save(name);
        }
        this.setContentToDefault();
    }

    add = () => {
        this.addedit('add');
    }

    edit = () => {
        this.addedit('edit');
    }

    addedit = (addedit) => {
        this.setState({content: <TripAddEdit
                                        addedit={addedit}
                                        name={this.props.name}
                                        save={this.props.save} 
                                        setContentToDefault={this.setContentToDefault} />, 

                        button: <button id="cancel" className="button is-primary is-outlined" onClick={this.setContentToDefault}>Cancel</button>
                    });
    }
    
    render(){
        return ( 
            <div id="trips" className="level-item" >   
                {this.state.button}
                {this.state.content}

                <button id="edit" onClick={this.edit} className={"button edit-button "} > 
                    <FontAwesomeIcon icon={faEdit}> </FontAwesomeIcon> 
                </button> 
            </div>
        )
    }
}

export default Trips;