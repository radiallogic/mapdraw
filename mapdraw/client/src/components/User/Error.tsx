import * as React from "react"

import {ErrorMsg} from '../GlobalTypes';

type Props = {
    error: ErrorMsg;
}

class Error extends React.PureComponent<Props> {

    render(){
        if(this.props.error.valid == true){
            return (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Login Error</strong>
                    <span className="block sm:inline">{this.props.error.message}</span>
                </div>
            )
        }else{
            return (
                null
            )
        }

    }
}

export default Error