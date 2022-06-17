import * as React from "react"
import { Option } from "../GlobalTypes";

type Props = {
    select: React.ChangeEventHandler<HTMLSelectElement>;
    options: Array<Option>;
}

type State = {
    value: string;
}

class KitListSelect extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render(){
        let options = this.props.options.map( (item, i) => {
            return (<option key={i} value={item._id}> {item.name} </option>)
        });

        return (
            <div id="kitlist-select" className="control">
                <div className="select" > 
                {/* onSelect={this.props.select} */}
                    <select onChange={this.props.select}>
                        {options}
                    </select>
                </div>
            </div>
        );
    }
}

export default KitListSelect;