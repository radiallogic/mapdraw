// client/src/App.js
import React, { Component } from "react";
import ReactDOM from 'react-dom';

import MapContainer from './components/MapContainer'

import Trips from './components/Trips'
import Vehicles from './components/Vehicles'
import KitLists from './components/KitLists'

class App extends Component {
  constructor(){
    super();

    this.state = {
      trips: [], 
      vehicles: [], 
      kitlists: [],
      trip: '', 
      vehicle: '',
      kitlist: '',  
      route: []

    }
  }

  componentDidMount = () => {
    console.log('fetch trips');

    ['trips', 'vehicles', 'kitlists'].map( (item) => {
        fetch('/api/' + item)
        .then( (response) => {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' + response.status);
              return;
            }
            response.json().then( (data) => {
              this.setState({[item]:data});
            });
          }
        )
        .catch(function(err) {
          console.log('Fetch Error :-S', err);
        });
    });
  }

  setSelected = (event) => {
    this.state.trips.map( (item) => {
      if(item._id == event.target.value){
        console.log(item);

        this.setState({trip: item.name, vehicle: item.vehicle, kitlist: item.kitlist, route: item.kitlist }, () => {
          console.log(this.state);
        });
      }
    })    
  }


  render() {

    return (
      <>
        <div className="section">
          
          <div  className="level">
            <Trips trips={this.state.trips} trip={this.state.trip} select={this.setSelected} />

            <KitLists kitlists={this.state.kitlists} kitlist={this.state.kitlist} />

            <Vehicles vehicles={this.state.vehicles} vehicle={this.state.vehicle} />
          </div>

        </div>

        <div className="section">
          <MapContainer />
        </div>
      </>
    );

  }
}

//export default App;

ReactDOM.render(<App />, document.getElementById('root'));