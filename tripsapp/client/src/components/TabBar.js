import React, { Component } from "react";

class TabBar extends Component {
    constructor(){
        super();

        this.state = { tabs: [{name: 'Init', key: 0}] };
    }

    addTab = () => {
        //this.setState({tabs:});
    }

    removeTab = () => {

    }

    render(){

        let tabs = this.state.tabs.map((item) => {
            let active = ''; // is-active
            return (<li className={active} key={item.key} ><a>{item} <span onClick={this.removeTab}>x</span></a></li>);
        });

        return (
            <div class="tabs">
                <ul onClick={this.add}>
                    +
                </ul>
                <ul>
                    {tabs}
                </ul>
            </div>
          
        )
    }
}


export default TabBar;