import React from 'react';

class TripAdd extends React.Component {
    constructor(){
        super();
    }

    render(){

        return (
            <div id="trip-add" className="box">
                <div className="control">
                    <input className="input" type="text" placeholder="Text input" />
                </div>
                <div className="control">
                    <button className="button is-primary">Submit</button>
                </div>
            </div>
        );
    }
}

export default TripAdd;
