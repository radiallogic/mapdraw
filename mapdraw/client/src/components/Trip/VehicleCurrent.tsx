import * as React from "react"

type Props = {
    vehicle: string;
}

export default class VehicleCurrent extends React.PureComponent<Props>{

    render() {
        return (<span> {this.props.vehicle} </span>) ;
    }
}