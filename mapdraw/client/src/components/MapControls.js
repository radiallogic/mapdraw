import React, { Component } from "react";
import {ALL, NONE, DELETE}  from '../Paths/react-leaflet-paths';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsAlt, faEdit, faMapMarker, faMinusCircle } from '@fortawesome/free-solid-svg-icons';


export const ADD = 9;

class MapControls extends Component {

    constructor(props) {
        super(props);

        this.state = 
            {   move_highlight: "", 
                edit_highlight: "", 
                add_highlight: "", 
                delete_highlight: "", 
            };
    }


    move = () => {

        this.props.setMode(NONE);
        this.unsetAllHighlights();
        this.setState({ move_highlight: "highlight" });
    }

    edit = () => {
        this.props.setMode(ALL);
        this.unsetAllHighlights();
        this.setState({ edit_highlight: "highlight" });
    }

    add = () => {
        this.props.setMode(ADD);

        this.unsetAllHighlights();
        this.setState({ add_highlight: "highlight" });
    }

    delete = () => {
        this.props.setMode(DELETE);
        this.unsetAllHighlights();
        this.setState({ delete_highlight: "highlight" });
    }

    unsetAllHighlights = () => {
        this.setState(
            {   move_highlight: "", 
                edit_highlight: "", 
                add_highlight: "", 
                delete_highlight: "", 
            } )
    }


    render(){
        return( 
            <> 
                <button onClick={this.move} className={"btn " + this.state.move_highlight }  > 
                    <FontAwesomeIcon icon={faArrowsAlt}> </FontAwesomeIcon> 
                </button>
                <button onClick={this.edit} className={"btn " + this.state.edit_highlight } > 
                    <FontAwesomeIcon icon={faEdit}> </FontAwesomeIcon> 
                </button>
                <button onClick={this.add} className={"btn " + this.state.add_highlight }>
                    <FontAwesomeIcon icon={faMapMarker}> </FontAwesomeIcon> 
                </button>
                <button onClick={this.delete} className={"btn " + this.state.delete_highlight } > 
                    <FontAwesomeIcon icon={faMinusCircle}> </FontAwesomeIcon> 
                </button>
            </>
        );
    }
    
}

export default MapControls