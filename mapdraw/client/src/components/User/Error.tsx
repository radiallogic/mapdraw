import * as React from "react"

import {ErrorMsg} from '../Types';

type Props = {
    error: ErrorMsg;
}

class Error extends React.PureComponent<Props> {

    render(){

        console.log('typeof this.props.error: ', typeof this.props.error); 
        console.log(this.props.error);

        if(typeof this.props.error === 'object'){
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