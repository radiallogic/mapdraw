import React from 'react';

import KitListSelect from './KitListSelect';

export default class KitList extends React.Component {
    constructor(){
        super();
    }

    render(){
        
        return (
            <div id="vehicles" className="level-item" >
                {this.props.kitlist}
                <KitListSelect options={this.props.kitlists} />
            </div>
        );
    }
}