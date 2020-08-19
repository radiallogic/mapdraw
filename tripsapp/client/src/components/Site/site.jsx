import React, {Component} from 'react' 

import Addlink from './addlink';
import Addtext from './addtext';
import DisplayLink from './displayLink';
import DisplayText from './displayText';


export default class Site extends Component {
    constructor(){
        super();

        this.state = {
            site: []
        }
    }

    componentDidMount = () => {
        this.setState({site: this.props.site}); 
    }

    componentDidUpdate = (prevProps) => {
        if(this.props.site !== prevProps.site){
            this.setState({site:this.props.site})
        }
    } 

    addlink = () => {
        let site = this.state.site;
        site.unshift(<Addlink save={this.props.save} />);
    }

    addText = () => {
        let site = this.state.site;
        site.unshift(<Addtext save={this.props.save} />);
    }


    render(){

        let rows = this.state.site.map((item) => {
            if(item.type == "link"){
                return <DisplayLink data={item} />
            }
            if(item.type == "text"){
                return <DisplayText data={item} />
            }
        })

        return(
            <div className={"bubble "} >
                <button value="Add Link" onClick={this.addlink} /> <button value="Add Text" onClick={this.addlink} /> 
                {rows}
            </div>
        )
    }

}