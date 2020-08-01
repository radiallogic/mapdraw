import React, {Component} from 'react' 

export default class addlink extends Component {
    constructor(){
        super();

        this.state = {
            name: "", 
            link: "" 
        }
    }

    onLinkChange = (e) => {
        this.setState({link:e.target.value});
    }

    onNameChange = (e) => {
        this.setState({name:e.target.value});
    }

    save = () => {
        this.props.save(this.state.name, this.state.value);
    }


    render(){
        return(
            <div className={} >
                <input type="text" name="name" value={this.state.name} onChange={this.onNameChange} />  : 
                <input type="text" name="link" value={this.state.link} onChange={this.onLinkChange} />  
                <button onClick={this.save} value="Save" />
            </div>
        )
    }

}