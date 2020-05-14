import React, { Component } from "react";
import Login from './Login';
import Signup from './Signup';

class User extends Component {
    constructor(){
        super();

        this.state = {  };
    }
    // app.post("/user/signup", userController.postSignup);
    // app.post("/user/login", userController.postLogin);
    // app.get("/user/logout", userController.logout);
    // app.post("/user/forgot", userController.postForgot);

    signUp = (user, pass, passcon) => {

        let body = {email: user, password: pass, confirmPassword: passcon};
        body = JSON.stringify(body);
        console.log('body', body);

        fetch('/user/signup/', {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: body
          }).then( (response) => {
            return response.json();
          }).then( (data) => {
            console.log('returned data: ', data);
            return data;
          });
    }

    login = (user, pass) => {
        
        let body = {email: user, password: pass};
        body = JSON.stringify(body);
        console.log('body', body);

        fetch('/user/login/', {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: body
          }).then( (response) => {
            return response.json();
          }).then( (data) => {
            console.log('returned data: ', data);

            // deal with errors here
          });
    }

    render(){

        return (
            <>
                <Login login={this.login}/>
                <Signup signUp={this.signUp} />
            </>
        )
    }
}


export default User;