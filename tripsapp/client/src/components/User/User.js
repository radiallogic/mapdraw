import React, { Component } from "react";
import Login from './Login';
import Signup from './Signup';

class User extends Component {
    constructor(){
        super();

        this.state = {  };
    }

    render(){

        return (
            <div>
                <Login className="is-pulled-right"/>
                <Signup className="is-pulled-right" />
            </div>
        )
    }
}


export default User;