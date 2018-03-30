import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

export const customStyle = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

export class DeleteModal extends React.Component {
  constructor() {
    super();
    
  }

  render() {
    return (
      <ConfirmModal
        confirmCallback={this.props.confirmCallback}
        cancelCallback={this.props.cancelCallback}
        confirmText={this.props.confirmText}
        cancelText={this.props.cancelText}
        
        message={this.props.message}
      />
    );
  }
}



export class ConfirmModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
    this.state.open = this.props.open;

    console.log( ' ConfirmModal this.props.open' )
    console.log( this.props.open )

    this.cancel = this.cancel.bind(this);
    this.confirm = this.confirm.bind(this);
    
  }
  
  componentDidUpdate(){

    if(this.props.open !== this.state.open){ // prevent infinite loop. 
     this.setState({open:this.props.open})
    }

  }
  
  cancel() {
    console.log('cancel')
    //this.setState({open: false })
    
    this.props.cancelCallback()
  }
  
  confirm() {
    console.log('confirm')
    //this.setState({open: false})
    this.props.confirmCallback()
  }

  render() {
    return (
      <div>
        
        <Modal
          isOpen={this.state.open}
          contentLabel="Example Modal"
          style={customStyle}
        >
          <div >
          {this.props.message}
          </div>
          
          <button onClick={this.cancel }>{this.props.cancelText}</button> <button onClick={this.confirm} >{this.props.confirmText}</button> 

        </Modal>
      </div>
    );
  }
}