import * as React from "react"

type Props = {
    className: string;
}

export default class Bubble extends React.PureComponent<Props> {

    render(){
        return(
            <div className={"bubble " + this.props.className } >
                {this.props.children}
            </div>
        )
    }

}