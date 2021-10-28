import * as React from "react"
import Login from './Login';
import Signup from './Signup';
import Logout from './Logout';
import { ErrorMsg } from "../Types";

type Props = {
  user?: string;

  clear: Function;
  setUser: Function;
}

type State = {
  loggedin: boolean;
  error: ErrorMsg;  
}

class User extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
          loggedin: false, 
          error: {message: ""}
        };
    }

    signUp = (user: string, pass: string, passcon: string) => {
        this.setState({ error: {message: ""} });
        let body = {email: user, password: pass, confirmPassword: passcon};
        let bodyStr = JSON.stringify(body);
        console.log('body', body);

        fetch('/user/signup/', {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: bodyStr
          }).then( (response) => {
            if(response.ok){
              this.props.clear();
              this.setState({loggedin:true, error: {message: ""}});
              //TODO FIXME
              var json:any = response.json();
              this.props.setUser(json.user);
            }else{
              this.setState({error: {message: json } });
            }
        });
    }

    login = (user: string, pass: string) => {
        this.setState({error: {message: ""}});
        let body = {email: user, password: pass};
        let bodyStr = JSON.stringify(body);
        console.log('body', body);

        fetch('/user/login/', {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: bodyStr
          }).then( (response) => {
            console.log('response.status ', response.status );
            console.log('response.ok ', response.ok ); 
            //TODO FIXME
            var json:any = response.json();
            console.log('login json', json)

            if(response.ok){
              this.props.clear();
              this.props.setUser(json.user);
            }else{
              this.setState({error: {message: json}});
            }
          });
    }

    logout = () => {
      this.setState({error: {message: ""}});
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

      if(this.props.user != null){
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