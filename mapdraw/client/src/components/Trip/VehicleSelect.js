import React from 'react';

class VehicleSelect extends React.Component {
    constructor(){
        super();
    }

    render(){

        let options = this.props.options.map( (item, i) => {
            return (<option key={i} value={item.name} > {item.name} </option>)
        });

        return (
            <div className="field">
                <div id="vehicle-select" className="control">
                    <select className="select" onChange={this.props.select} value={this.props.vehicle}>
                        <option key={0} value=""> Pick Vehicle </option>
                        {options}
                    </select>
                </div>
            </div>
        );
    }
}

export default VehicleSelect;