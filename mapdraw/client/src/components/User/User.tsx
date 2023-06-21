import * as React from "react"
import Login from './Login';
import Signup from './Signup';
import Logout from './Logout';
import { ErrorMsg } from "../GlobalTypes";
import { TUser } from "../MapTypes";

type Props = {
  user?: TUser;
  clear: Function;
  setUser: Function;
}

type State = {
  error: ErrorMsg;
}

const emptyerror: ErrorMsg = {
  valid: false
}

export const nullUser: TUser = {
  name: 'none',
  loggedin: false
}

class User extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      error: emptyerror
    };
  }

  signUp = (user: string, pass: string, passcon: string) => {
    this.setState({ error: emptyerror });
    let body = { email: user, password: pass, confirmPassword: passcon };
    let bodyStr = JSON.stringify(body);
    console.log('body', body);

    fetch('/user/signup/', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: bodyStr
    }).then((response) => {
      if (response.ok) {
        this.props.clear();
        return response.json();

      } else {

        const e: ErrorMsg = {
          message: response.json() as any as string,
          valid: true
        }
        this.setState({ error: e });
      }
    }).then((json) => {

      const u: TUser = {
        loggedin: true,
        name: json.user.email
      }
      this.props.setUser(u);

    });
  }

  login = (user: string, pass: string) => {
    this.setState({ error: emptyerror });
    let body = { email: user, password: pass };
    let bodyStr = JSON.stringify(body);
    //console.log('body', body);

    fetch('/user/login/', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: bodyStr
    }).then((response) => {
      if (response.ok) {
        this.props.clear();
        return response.json();
      } else {
        const e: ErrorMsg = {
          message: response.json() as any as string,
          valid: true
        }
        this.setState({ error: e });
      }
    }).then((json) => {
      console.log("json", json);
      const u: TUser = {
        loggedin: true,
        name: json.user.email
      }
      console.log("set user", u);
      this.props.setUser(u);

    })
  }

  logout = () => {
    this.setState({ error: emptyerror });
    fetch('/user/logout/', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET'
    }).then((response) => {
      if (response.ok) {
        this.props.clear();
        this.props.setUser(nullUser);
      } else {
        return response.json();
      }
    });
  }

  render() {

    if (this.props.user.loggedin == true) {
      return (
        <>
          Logged in as: {this.props.user.name} || <Logout logout={this.logout} />
        </>
      )
    } else {
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

export const isLoggedIn = async (): Promise<TUser> => {

  let u: TUser = nullUser

  await fetch('/user/isloggedin', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  }).then((response) => {
    return response.json()
  }).then((json) => {
    console.log("isloggedin ", json);
    u = {
      loggedin: true,
      name: json.user.email
    }
  });

  return u;
}



