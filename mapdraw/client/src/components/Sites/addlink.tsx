import * as React from "react"

type Props = {
    save: Function;
}

type State = {
	name: string;
    link: string;
    value: string;
}

export default class addlink extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    onLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({link:e.target.value});
    }

    onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({name:e.target.value});
    }

    save = () => {
        this.props.save(this.state.name, this.state.value);
    }

    render(){
        return(
            <div className='' >
                <input type="text" name="name" value={this.state.name} onChange={this.onNameChange} />  : 
                <input type="text" name="link" value={this.state.link} onChange={this.onLinkChange} />  
                <button onClick={this.save} value="Save" />
            </div>
        )
    }

}