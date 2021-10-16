import React, { Component } from "react";
import Login from './Login';
import Signup from './Signup';
import Logout from './Logout';


class User extends Component {
    constructor(){
        super();

        this.state = {
          loggedin: false, 
          error: ""
        };
    }

    signUp = (user, pass, passcon) => {
        this.setState({ error: ""});
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
            if(response.ok){
              this.props.clear();
              this.setState({loggedin:true, error: ""});
              this.props.setUser(response.json().user);
            }else{
              this.setState({error: response.json() });
            }
        });
    }

    login = (user, pass) => {
        this.setState({ error: ""});
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
            console.log('response.status ', response.status );
            console.log('response.ok ', response.ok ); 
            var json = response.json();
            console.log('login json', json)
            if(response.ok){
              this.props.clear();
              this.props.setUser(json.user);
            }else{
              this.setState({error: json });
            }
          });
    }

    logout = () => {
      this.setState({ error: ""});
      fetch('/user/logout/',{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'GET'
      }).then( (response) => {
        if(response.ok){
          this.props.clear();
          this.props.setUser(false);
        }else{
          return response.json();
        }
      });
    }

    render(){

      if(this.props.user != false){
        return (
          <>
              Logged in as: {this.props.user} <Logout logout={this.logout} />
          </>
        )
      }else{
        return (
          <>
              <Login login={this.login} error={this.state.error} />
              <Signup signUp={this.signUp} error={this.state.error} />
          </>
        )
      }
        
    }
}


export default User;