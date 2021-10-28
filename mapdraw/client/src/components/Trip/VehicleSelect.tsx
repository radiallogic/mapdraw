import * as React from "react"

import {Option} from "../Types";

type Props = {
    options: Array<Option>;

    select: React.ChangeEventHandler<HTMLSelectElement>;
    vehicle: string;
}

type State = {

}

class VehicleSelect extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
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