import React from 'react';

class TripAdd extends React.Component {
    constructor(){
        super();

        this.state = {value: ''}
    }

    update = (event) => {
        this.setState({value: event.target.value});   
    }

    save = (event) => {
        event.preventDefault();
        this.props.save(this.state.value); 
        this.props.setContentToDefault();
    } 

    render(){

        return (
            <div id="trip-add" className="field has-addons">
                <div className="control">
                    <input className="input" value={this.state.value} onChange={this.update} type="text" placeholder="Text input" />
                </div>
                <div className="control">
                    <button className="button is-primary is-light" onClick={this.save}>Submit</button>
                </div>
            </div>
        );
    }
}

export default TripAdd;
