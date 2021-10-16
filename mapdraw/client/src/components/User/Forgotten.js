import React, { Component } from "react";
import ReactModal from 'react-modal';

class Forgotten extends Component {
    constructor(){
        super();

        this.state = 
        {   open: false, 
            email: ""
        };

        ReactModal.setAppElement('#root');
    }

    updateEmail = (e) => {
        this.setState({email: e.target.value});
    }

    open = () => {
        this.setState({open:true});
    }

    close = () => {
        this.setState({open:false});
    }

    sendForgotten = () => {

        this.close();
    }


    render(){

        return (
            <>
            <button onClick={this.open}> Forgotten Password </button>
            <ReactModal 
                isOpen={this.state.open}
                onRequestClose={this.closeModal}
            >
                

            <div id="user-login" className="field has-addons">
                <div className="control">
                    <input className="input" value={this.state.email} onChange={this.updateEmail} type="text" placeholder="Email" />
                </div>
                
                <div className="control">
                    <button className="button is-primary is-light" onClick={this.sendForgotten}>Send password reset email</button>
                </div>
            </div>

            </ReactModal>
            </>
        )
    }
}


export default Forgotten;