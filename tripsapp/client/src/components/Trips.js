import React from 'react';

import TripAdd from './TripAdd'
import TripSelect from './TripSelect'



class Trips extends React.Component {
    constructor(){
        super();

        this.state = {
            expanded: false,
            selected: 'None', 
            add: false
        }
    }

    save = () => {

    }

    select = (trip) => {
        this.setState({selected: trip});
        this.props.select(trip);
    }

    expand = () =>{
        console.log('expand function');
        this.setState({expanded:true});
    }

    add = () =>{
        console.log('add function');
        this.setState({add:true, expanded:true});
    }

    render(){
 
        if(this.state.expanded){
            return (
                <div id="trips">
                    {this.state.add && <TripAdd save={this.save} />}
                    <TripSelect select={this.select} options={this.props.trips}/>
                </div>
            );
        }else{
            return (
            
                <div id="trips" className="level-item" >
                    <span onClick={this.add}>
                        +
                    </span>

                    <span onClick={this.expand}>
                        {this.state.selected}
                    </span>

                </div>
            )
        }

    }
}

export default Trips;