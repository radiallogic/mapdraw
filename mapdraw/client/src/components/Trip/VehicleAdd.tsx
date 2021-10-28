import * as React from "react"

type Props = {
    add: Function;
}

type State = {
    value: string;
}

class VehicleAdd extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
    }

    update = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({value: event.target.value});   
    }

    save = () => {
        this.props.add(this.state.value); 
    } 

    render(){

        return (
            <div id="trip-add" className="field has-addons">
                <div className="control">
                    <input className="input" value={this.state.value} onChange={this.update} type="text" placeholder="Text input" />
                </div>
                <div className="control">
                    <button className="button is-primary is-light" onClick={this.save}>Submit</button>
                </div>
            </div>
        );
    }
}

export default VehicleAdd;
