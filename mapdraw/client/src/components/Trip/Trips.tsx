import * as React from "react"

import TripAddEdit from './TripAddEdit'
import TripSelect from './TripSelect'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsAlt, faEdit, faMapMarker, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import {Option} from '../Types';

type Props = {
    name: string;
    id: string;
    trips: Array<Option>;

    select: Function;
    save: Function;
    savenew: Function;

}

type State = {
    add: boolean;
    content: React.ReactElement;
    button: React.ReactElement;
}


class Trips extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
                add: true,
                content: <TripSelect 
                            id={this.props.id}
                            select={this.select}
                            options={this.props.trips}
                            setContentToDefault={this.setContentToDefault}
                        />, 
                button: <button id="add" className="btn" onClick={this.add}>Add Trip</button> 
        }
    }

    // componentDidMount = () => {
    //     this.setContentToDefault();
    // }

    componentDidUpdate = (prevProps: Props) => {
        // console.log(" prev props: ", prevProps.name );
        // console.log(" props: ", this.props.name );

        if(this.props.trips !== prevProps.trips ||
             this.props.id !== prevProps.id || 
             this.props.name !== prevProps.name ){

            this.setContentToDefault();
        }
    } 
    
    setContentToDefault = () => {
        console.log('in trips, setContentToDefault: ', this.props.name ); 

        this.setState(
            {
            content: <TripSelect 
                        id={this.props.id}
                        select={this.select}
                        options={this.props.trips}
                        setContentToDefault={this.setContentToDefault}
                    />, 
            button: <button id="add" className="btn" onClick={this.add}>Add Trip</button> 
            }
        )
    }

    select = (id: number) => {
        console.log('trip ', id);
        this.props.select(id);
    }

    save = (name: string, addedit: string) =>{
        console.log('save function ... ', addedit  );
        if(addedit == "add"){
            console.log(' HERE: ', addedit  );
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

    addedit = (addedit: string) => {
        this.setState({content: <TripAddEdit
                                        addedit={addedit}
                                        name={this.props.name}
                                        save={this.save} 
                                        setContentToDefault={this.setContentToDefault} />, 

                        button: <button id="cancel" className="btn " onClick={this.setContentToDefault}>Cancel</button>
                    });
    }
    
    render(){
        return ( 
            <div id="trips" className="level-item" >   
                {this.state.button}
                {this.state.content}

                <button id="edit" onClick={this.edit} className={"btn edit-button "} > 
                    <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon> 
                </button> 
            </div>
        )
    }
}

export default Trips;