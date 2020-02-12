import React from 'react';

class TripSelect extends React.Component {
    constructor(){
        super();
    }

    select = (event) => {
        this.props.select(event.target.value);
        this.props.setContentToDefault();
    }

    render(){
        let options = this.props.options.map( (item, i) => {
            return (<option key={i} value={item._id}> {item.name} </option>)
        });

        return (
            <div className="field">
                <div id="trip-select" className="control">
                    <div className="select">
                        <select onChange={this.select} >
                            <option key={0} value=""> None Selected </option>
                            {options}
                        </select>
                    </div>
                </div>
            </div>
        );
    }
}

export default TripSelect;