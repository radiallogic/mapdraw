import React from 'react'

export default class TripTitle extends React.PureComponent{

    render() {
        return (<span onClick={this.props.expand}> {this.props.selected} </span>) ;
    }
}