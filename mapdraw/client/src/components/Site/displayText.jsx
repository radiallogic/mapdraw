import React, {PureComponent} from 'react' 

export default class displayLink extends PureComponent {
    render(){
        return(
            <div className='bubble' >
                {this.props.name}
            </div>
        )
    }

}