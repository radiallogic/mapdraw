import * as React from "react"

type Props = {
    save: Function;
}

type State = {
	text: string;
    link: string;
    name: string;
    value: string;
}

export default class addtext extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({link:e.target.value});
    }

    save = () => {
        this.props.save(this.state.name, this.state.value);
    }

    render(){
        return(
            <div className='' >
                <textarea name="text" value={this.state.text} onChange={this.onTextChange} />  
                <button onClick={this.save} value="Save" />
            </div>
        )
    }

}