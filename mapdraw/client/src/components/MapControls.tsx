import * as React from "react"
import {ADD, EDIT, MOVE, DELETE} from './Constants';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsAlt, faEdit, faRandom, faDrawPolygon, faMapMarker, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface Props {
    setMode: Function;
}

interface State {
    move_highlight: boolean; 
    edit_highlight: boolean;  
    add_highlight: boolean;  
    delete_highlight: boolean;
}

interface HighlightProps {
    onClick: React.MouseEventHandler<HTMLButtonElement>,
    icon: IconProp,
    highlight: boolean
}

const HighlightButton: React.FC<HighlightProps> = ({onClick, icon, highlight}) => {
    let outline = '';
    if (highlight == true){
        outline = "bg-white";
    }

    return (<button onClick={onClick} className={"btn " + outline } >
                <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
            </button>)
};

class MapControls extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = 
            {
                move_highlight: false, 
                edit_highlight: false, 
                add_highlight: false, 
                delete_highlight: false, 
            };
    }

    move = () => {
        this.props.setMode(MOVE);
        this.unsetAllHighlights();
        this.setState({ move_highlight: true });
    }

    edit = () => {
        this.props.setMode(EDIT);
        this.unsetAllHighlights();
        this.setState({ edit_highlight: true });
    }

    add = () => {
        this.props.setMode(ADD);
        this.unsetAllHighlights();
        this.setState({ add_highlight: true });
    }

    delete = () => {
        this.props.setMode(DELETE);
        this.unsetAllHighlights();
        this.setState({ delete_highlight: true });
    }

    unsetAllHighlights = () => {
        this.setState(
            {   move_highlight: false, 
                edit_highlight: false, 
                add_highlight: false, 
                delete_highlight: false, 
            } )
    }


//<i class="fa fa-random" aria-hidden="true"></i>
//<i class="fa-solid fa-draw-polygon"></i>

    render(){
        return( 
            <> 
                <HighlightButton onClick={this.move} icon={faArrowsAlt} highlight={this.state.move_highlight} />
                <HighlightButton onClick={this.edit} icon={faDrawPolygon} highlight={this.state.edit_highlight} />
                <HighlightButton onClick={this.add} icon={faMapMarker} highlight={this.state.add_highlight} />

                <HighlightButton onClick={this.delete} icon={faMinusCircle} highlight={this.state.delete_highlight} />
            </>
        );
    }
    
}

export default MapControls