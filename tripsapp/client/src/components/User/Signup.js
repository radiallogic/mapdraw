import React, { Component } from "react";
import ReactModal from 'react-modal';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import Error from './Error';

import customStyles from './UserStyle';

class Signup extends Component {
    constructor(){
        super();

        this.state = 
        {   open: false, 
            email: "", 
            pass: "", 
            passcon: "", 
        };

        ReactModal.setAppElement('#root');
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
        this.props.signUp(this.state.email, this.state.pass, this.state.passcon);
    }


    render(){

        return (
            <>
            <button className="button" onClick={this.open}> Sign up </button>
            <ReactModal 
                style={customStyles}
                isOpen={this.state.open}
                onRequestClose={this.closeModal}
            >
                
            <FontAwesomeIcon icon={faTimes} onClick={this.close} /> 

            <div id="user-login" className="field">

                <Error error={this.props.error} />

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