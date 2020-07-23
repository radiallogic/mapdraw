import React, {Component} from 'react' 

export default class Bubble extends Component {

    render(){
        return(
            <div className={"bubble " + this.props.className } >
                {this.props.children}
            </div>
        )
    }

}