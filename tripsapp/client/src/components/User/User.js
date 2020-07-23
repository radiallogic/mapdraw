import React, { Component } from "react";
import Login from './Login';
import Signup from './Signup';
import Logout from './Logout';

class User extends Component {
    constructor(){
        super();

        this.state = 
        { loggedin: false, 
          error: ""
        };
    }

    componentDidMount = () => {
      this.isLoggedIn();
    }

    isLoggedIn = () => {
      
      fetch('/user/isloggedin/' ).then( (response) => {
        return response.json();
      }).then( (data) => {
        console.log(' isloggedin data', data) 
        if(data === ['yes']){
          this.setState({loggedin:true});
        }else{
          this.setState({loggedin:false});
        }
    });
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
            if(response.ok){
              this.props.clear();
              this.setState({loggedin:true, error: ""});
            }else{
              this.setState({error: response.json() });
            }
          });
    }

    logout = () => {
      this.setState({ error: ""});
      fetch('/user/logout/').then( (response) => {
        if(response.ok){
          this.props.clear();
          this.setState({loggedin:false});
        }else{
          return response.json();
        }
      });
    }

    render(){

      if(this.state.loggedin == true){
        return (
          <>
              <Logout logout={this.logout} />
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