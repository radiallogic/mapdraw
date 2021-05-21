import React, { PureComponent } from "react";

class Error extends PureComponent {

    render(){

        console.log('typeof this.props.error: ', typeof this.props.error); 
        console.log(this.props.error); 

        let errors = []

        if(typeof this.props.error === 'object'){
            return (
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong class="font-bold">Login Error</strong>
                    <span class="block sm:inline">{this.props.error[0].msg}</span>
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