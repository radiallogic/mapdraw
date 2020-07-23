import React, { PureComponent } from "react";

class Error extends PureComponent {

    render(){

        console.log('typeof this.props.error: ', typeof this.props.error); 
        console.log(this.props.error); 

        let errors = []

        if(typeof this.props.error === 'object'){
            console.log('here', this.props.error[0].msg);
            return (
                <div className="error">
                    {this.props.error[0].msg}
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