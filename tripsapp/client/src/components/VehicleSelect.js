import React from 'react';

class VehicleSelect extends React.Component {
    constructor(){
        super();
    }

    render(){
        let options = this.props.options.map( (item, i) => {
            return (<option key={i} value={item._id}> {item.name} </option>)
        });

        return (
            <div id="vehicle-select" className="control">
                <div className="select" >
                    <select onChange={this.props.select}>
                        {options}
                    </select>
                </div>
            </div>
        );
    }
}

export default VehicleSelect;