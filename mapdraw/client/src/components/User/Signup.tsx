import * as React from "react"
// import ReactModal from 'react-modal';

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTimes } from "@fortawesome/free-solid-svg-icons";

// import Error from './Error';

// import customStyles from './UserStyle';
import { ErrorMsg } from "../GlobalTypes";

type Props = {
    signUp: Function;
    error: ErrorMsg;
}

type State = {
    email: string;
    pass: string;
    passcon: string;

    open: boolean;
}

class Signup extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = 
        {   open: false, 
            email: "", 
            pass: "", 
            passcon: "", 
        };

        // ReactModal.setAppElement('#root');
    }

    updateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({email: e.target.value});
    }

    updatePass = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({pass: e.target.value});
    }

    updateConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            <button className="btn" onClick={this.open}> Sign up </button>

{this.state.open ? (
        <div className="w-screen h-screen opacity-25 absolute top-0 left-0 right-0 inset-0 z-40 bg-black">
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            {/* <FontAwesomeIcon icon={faTimes} onClick={this.close} />  */}
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Modal Title
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => close()}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                    I always felt like I could do anything. That’s the main
                    thing people are controlled by! Thoughts- their perception
                    of themselves! They're slowed down by their perception of
                    themselves. If you're taught you can’t do anything, you
                    won’t do anything. I was taught I could do everything.
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => this.close()}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => this.close()}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className=""></div>



                      {/* <div id="user-login" className="field">

                <Error error={this.props.error} />


                <div className="control">
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={this.state.email} onChange={this.updateEmail} type="text" placeholder="Email" />
                </div>
                <div className="control">
                    <i className="fas fa-lock"></i>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={this.state.pass} onChange={this.updatePass} type="password" placeholder="Password" />
                </div>
                <div className="control">
                    <i className="fas fa-lock"></i>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={this.state.passcon} onChange={this.updateConfirm} type="password" placeholder="Confirm Password" />
                </div>
                <div className="control">
                    <button className="btn is-primary is-light" onClick={this.signup}>Sign up</button>
                </div>
            </div> */}
        </div>
      ) : null}
            </>
        )
    }
}


export default Signup;