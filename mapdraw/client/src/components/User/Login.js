import React, { Component } from "react";
import ReactModal from 'react-modal';
import Forgotten from './Forgotten';
import Error from './Error';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import customStyles from './UserStyle';

class Login extends Component {
    constructor(){
        super();

        this.state = 
        {   open: false, 
            email: "", 
            pass: ""
        };

        ReactModal.setAppElement('#root');
    }

    onFacebookLogin = () => {
        const inOneHour = new Date(new Date().getTime() + 60 * 60 * 1000);
        Cookies.set('lastLocation_before_logging', this.props.location.pathname, { expires: inOneHour });
        window.location.href = `${window.location.origin}/auth/facebook`;
    };

    updateEmail = (e) => {
        this.setState({email: e.target.value});
    }

    updatePass = (e) => {
        this.setState({pass: e.target.value});
    }

    open = () => {
        this.setState({open:true});
    }

    close = () => {
        this.setState({open:false});
    }

    login = () => {
        this.props.login(this.state.email, this.state.pass);
    }


    render(){

        return (
            <>
            <button className="btn" onClick={this.open}> Login </button>
            <ReactModal 
                style={customStyles}
                isOpen={this.state.open}
                onRequestClose={this.closeModal}
            >
                
            <FontAwesomeIcon icon={faTimes} onClick={this.close} />

            <div id="user-login" className="field">

                <Error error={this.props.error} />

                {/* <div className="control">
                    <button className="btn " onClick={this.onFacebookLogin}> facebook login </button>
                </div> */}

                <div className="control">
                    <input className="input" value={this.state.email} onChange={this.updateEmail} type="text" placeholder="Email" />
                </div>
                <div className="control">
                    <input className="input" value={this.state.pass} onChange={this.updatePass} type="password" placeholder="Password" />
                </div>
                <div className="control">
                    <button className="btn" onClick={this.login}>Login</button>
                </div>

                <div className="control">
                    <Forgotten />
                </div>
            </div>

            </ReactModal>
            </>
        )
    }
}


export default Login;