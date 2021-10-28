import * as React from "react"

type Props = {
    data: React.ReactElement;
}
export default class displayLink extends React.PureComponent<Props>{
    render(){
        return(
            <div className='bubble' >
                {this.props.data}
            </div>
        )
    }

}