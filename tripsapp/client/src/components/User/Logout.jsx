import React, { PureComponent } from "react";

class Logout extends PureComponent {

    render(){
        return (
            <button className="button" onClick={this.props.logout}> logout </button>
        )

    }
}

export default Logout