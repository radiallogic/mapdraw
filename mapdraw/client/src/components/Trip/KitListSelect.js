import React from 'react';

class KitListSelect extends React.Component {
    constructor(){
        super();
    }

    render(){
        let options = this.props.options.map( (item, i) => {
            return (<option key={i} value={item._id}> {item.name} </option>)
        });

        return (
            <div id="kitlist-select" className="control">
                <div className="select" onSelect={this.props.select}>
                    <select onChange={this.props.select}>
                        {options}
                    </select>
                </div>
            </div>
        );
    }
}

export default KitListSelect;