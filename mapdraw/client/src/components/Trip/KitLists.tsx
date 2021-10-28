import * as React from "react"

import KitListSelect from './KitListSelect';

type Props = {
    kitlist: Array<string>;
}

type State = {

}

export default class KitList extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render(){
        
        return (
            <div id="vehicles" className="level-item" >
                {this.props.kitlist}
                {/* <KitListSelect options={this.props.kitlists} /> */}
            </div>
        );
    }
}