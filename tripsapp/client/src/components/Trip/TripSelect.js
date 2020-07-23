import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsAlt, faEdit, faMapMarker, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

class TripSelect extends React.Component {
    constructor(){
        super();
    }

    select = (event) => {
        this.props.select(event.target.value);
        this.props.setContentToDefault();
    }

    render(){
        let options = this.props.options.map( (item, i) => {
            return (<option key={i} value={item._id}> {item.name} </option>)
        });

        return (
            <>
                <select className="trip-select" onChange={this.select} value={this.props.id}>
                    <option key={0} value=""> No Trip Loaded </option>
                    {options}
                </select>
                <button onClick={this.props.edit} className={"button edit-button "} > 
                    <FontAwesomeIcon icon={faEdit}> </FontAwesomeIcon> 
                </button> 
            </>
        );
    }
}

export default TripSelect;