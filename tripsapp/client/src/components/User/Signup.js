import React, { Component } from "react";
import ReactModal from 'react-modal';

class Signup extends Component {
    constructor(){
        super();

        this.state = 
        {   open: false, 
            email: "", 
            pass: ""
        };
    }

    updateEmail = (e) => {
        this.setState({email: e.target.value});
    }

    updatePass = (e) => {
        this.setState({pass: e.target.value});
    }

    updateConfirm = (e) => {
        this.setState({passcon: e.target.value});
    }

    open = () => {
        this.setState({open:true});
    }

    close = () => {
        this.setState({open:false});
    }

    signup = () => {

        this.close();
    }


    render(){

        return (
            <>
            <Button onClick={this.open}> Login </Button>
            <ReactModal 
                isOpen={this.state.open}
                onRequestClose={this.closeModal}
            >
                

            <div id="user-login" className="field">
                <div className="control">
                    <input className="input" value={this.state.email} onChange={this.updateEmail} type="text" placeholder="Email" />
                </div>
                <div className="control">
                    <input className="input" value={this.state.pass} onChange={this.updatePass} type="password" placeholder="Password" />
                </div>
                <div className="control">
                    <input className="input" value={this.state.passcon} onChange={this.updateConfirm} type="password" placeholder="Confirm Password" />
                </div>
                <div className="control">
                    <button className="button is-primary is-light" onClick={this.signup}>Sign up</button>
                </div>
            </div>

            </ReactModal>
            </>
        )
    }
}


export default Signup;