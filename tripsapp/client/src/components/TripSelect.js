import React from 'react';

class TripSelect extends React.Component {
    constructor(){
        super();
    }

    render(){
        let options = this.props.options.map( (item, i) => {
            return (<option key={i} value={item._id}> {item.name} </option>)
        });

        return (
            <div id="trip-select" className="control">
                <div className="select">
                    <select onChange={this.props.select}>
                        {options}
                    </select>
                </div>
            </div>
        );
    }
}

export default TripSelect;