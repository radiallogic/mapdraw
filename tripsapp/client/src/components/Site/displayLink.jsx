import React, {PureComponent} from 'react' 

export default class displayLink extends PureComponent {
    render(){
        return(
            <div className='bubble' >
                <a href={this.props.link} > {this.props.name} </a>
            </div>
        )
    }

}