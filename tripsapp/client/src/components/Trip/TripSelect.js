import React from 'react';

class TripSelect extends React.PureComponent {

    select = (event) => {
        this.props.select(event.target.value);
        this.props.setContentToDefault();
    }

    render(){
        let options = this.props.options.map( (item, i) => {
            return (<option key={i} value={item._id}> {item.name} </option>)
        });

        return (
            <>
                <select className="trip-select block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" onChange={this.select} value={this.props.id}>
                    <option key={0} value="No Trip Loaded"> No Trip Loaded </option>
                    {options}
                </select>
            </>
        );
    }
}

export default TripSelect;