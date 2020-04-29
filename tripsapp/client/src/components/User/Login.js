import React, { Component } from "react";
import ReactModal from 'react-modal';
import Forgotten from './Forgotten';

class Login extends Component {
    constructor(){
        super();

        this.state = 
        {   open: false, 
            email: "", 
            pass: ""
        };
    }


    // onFacebookLogin = () => {
    //     const inOneHour = new Date(new Date().getTime() + 60 * 60 * 1000);
    //     Cookies.set('lastLocation_before_logging', this.props.location.pathname, { expires: inOneHour });
    //     window.location.href = `${window.location.origin}/auth/facebook`;
    // };

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



        //<Forgotten className="is-pulled-right"/> 

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
                    <button className="button is-primary is-light" onClick={this.login}>Login</button>
                </div>
            </div>

            
            

            </ReactModal>
            </>
        )
    }
}


export default Login;