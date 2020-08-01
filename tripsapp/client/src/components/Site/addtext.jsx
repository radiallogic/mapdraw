import React, {Component} from 'react' 

export default class addtext extends Component {
    constructor(){
        super();

        this.state = {
            text: "", 
        }
    }

    onLinkChange = (e) => {
        this.setState({link:e.target.value});
    }

    save = () => {
        this.props.save(this.state.name, this.state.value);
    }

    render(){
        return(
            <div className={} >
                <textbox name="text" value={this.state.text} onChange={this.onTextChange} />  
                <button onClick={this.save} value="Save" />
            </div>
        )
    }

}