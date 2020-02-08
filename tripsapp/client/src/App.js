// client/src/App.js
import React, { Component } from "react";
import ReactDOM from 'react-dom';

import MapContainer from './components/MapContainer'

import Trips from './components/Trips'
import Vehicles from './components/Vehicles'
import KitList from './components/KitList'

class App extends Component {
  constructor(){
    super();

    this.state = {
      trips: [], 
      vehicles: [], 
      kitlists: [],
      trip: 'None', 
      vehicle: '',
      kitlist: '',  
      route: []

    }
  }

  componentDidMount = () => {
    this.getAllData();
  }

  getAllData = () => {
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

  setSelected = (id, data = null) => {
    if(data != null){
      this.setState(prevState => ({
        trips: [...prevState.trips, data]
      }))
    }
    console.log('in setSelected: ', id);
    //needs new data to work from. 

    this.state.trips.map( (item) => {
      if(item._id == id){
        console.log(item._id);

        this.setState({trip: item.name }, () => { // , vehicle: item.vehicle, kitlist: item.kitlist, route: item.kitlist
          console.log("state now: ", this.state);
        });
      }
    })    
  }

  saveTrip = (name) => {
    console.log("in saveTrip: " + name);

    fetch('/api/trips', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({name:name})
    }).then( (response) => {
      return response.json();
    }).then( (data) => {
      console.log('returned data: ', data);
      this.getAllData(); // stack order? 
      this.setSelected(data._id, data);

      // deal with errors here
    });

  }

  render() {

    return (
      <>
        <div className="section">
          
          <div  className="level">

            <Trips 
              trips={this.state.trips}
              trip={this.state.trip}
              select={this.setSelected}
              save={this.saveTrip}
              />

            <Vehicles vehicles={this.state.vehicles} vehicle={this.state.vehicle} />

            <KitList />
          </div>

        </div>

        <div className="section">
         
        </div>
      </>
    );

  }
}


//  <MapContainer />
//export default App;

ReactDOM.render(<App />, document.getElementById('root'));