import React, { Component } from "react";
import Login from './Login';
import Signup from './Signup';
import Forgotten from './Forgotten';

class User extends Component {
    constructor(){
        super();

        this.state = {  };
    }

    render(){

        return (
            <div>
                <Login />
                <Signup />
                <Forgotten />
            </div>
        )
    }
}


export default User;