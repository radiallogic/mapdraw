import * as React from "react"

import {Option} from '../GlobalTypes';

type Props = {
    id: string;
    select: Function;
    setContentToDefault: Function;

    options: Array <Option>;
}

class TripSelect extends React.PureComponent<Props> {

    select = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.select(event.target.value);
        this.props.setContentToDefault();
    }

    render(){
        let options = this.props.options.map( (item, i) => {
            return (<option key={i} value={item._id}> {item.name} </option>)
        });

        return (
            <>
                <select role="listbox" className="select" onChange={this.select} value={this.props.id}>
                    <option key={0} value="No Trip Loaded"> No Trip Loaded </option>
                    {options}
                </select>
            </>
        );
    }
}

export default TripSelect;