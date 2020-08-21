import React from 'react';

class TripAddEdit extends React.Component {
    constructor(){
        super();

        this.state = {value: 'Empty Trip Name'}
    }


    componentDidMount = () => {
        console.log(' TripAddEdit componentDidMount ', this.props.addedit );
        if( this.props.addedit == 'edit'){
            this.setState({value:this.props.name});
        }
    }
    
    componentDidUpdate(prevProps) {
        //console.log('addedit:', prevProps); 
        if (this.props.name !== prevProps.name) {
          //console.log('trip addedit: ', this.props.name);
          this.setState({value:this.props.name});
        }
    }

    update = (event) => {
        this.setState({value: event.target.value});   
    }

    save = (event) => {
        event.preventDefault();
        this.props.save(this.state.value, this.props.addedit ); 
        this.props.setContentToDefault();
    } 

    render(){

        return (
            <div id="trip-add" className="field has-addons">
                <div className="control">
                    <input id="trip-input" className="input" value={this.state.value} onChange={this.update} type="text" placeholder="Trip Name" />
                </div>
                <div className="control">
                    <button className="button is-primary is-light" onClick={this.save}>Save</button>
                </div>
            </div>
        );
    }
}

export default TripAddEdit;
