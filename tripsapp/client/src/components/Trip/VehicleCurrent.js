import React from 'react'

export default class VehicleCurrent extends React.PureComponent{

    render() {
        return (<span> {this.props.vehicle} </span>) ;
    }
}