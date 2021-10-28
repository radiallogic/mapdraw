import * as React from "react"

type Props = {
    logout: React.MouseEventHandler
}

class Logout extends React.PureComponent<Props>{

    render(){
        return (
            <button className="button" onClick={this.props.logout}> logout </button>
        )

    }
}

export default Logout