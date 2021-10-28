import * as React from "react"
import ReactModal from 'react-modal';

type Props = {

}

type State = {
    open: boolean;
    email: string;
}

class Forgotten extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = 
        {   open: false, 
            email: ""
        };

        ReactModal.setAppElement('#root');
    }

    updateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({email: e.target.value});
    }

    open = () => {
        this.setState({open:true});
    }

    close = () => {
        this.setState({open:false});
    }

    sendForgotten = () => {
        this.close();
    }


    render(){

        return (
            <>
            <button onClick={this.open}> Forgotten Password </button>
            <ReactModal 
                isOpen={this.state.open}
                onRequestClose={this.close}
            >

            <div id="user-login" className="field has-addons">
                <div className="control">
                    <input className="input" value={this.state.email} onChange={this.updateEmail} type="text" placeholder="Email" />
                </div>
                
                <div className="control">
                    <button className="button is-primary is-light" onClick={this.sendForgotten}>Send password reset email</button>
                </div>
            </div>

            </ReactModal>
            </>
        )
    }
}


export default Forgotten;