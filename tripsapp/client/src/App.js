// client/src/App.js
import React, { Component } from "react";
import ReactDOM from 'react-dom';

import User from './components/User/User'

import MapContainer from './components/MapContainer'
import MapControls from './components/MapControls'

import Trips from './components/Trip/Trips'
import Vehicles from './components/Trip/Vehicles'
import KitList from './components/Trip/KitList'

import Bubble from './Bubble'
import './app.scss'


class App extends Component {
  constructor(){
    super();

    this.state = {
      trips: [], 
      vehicles: [], 
      kitlists: [],

      id: '',
      trip: 'None', 
      vehicle: '',
      kitlist: '',  
      paths: [],
      sites: [],

      error: '',

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

  // addKitlist = (kitlist) => {
  //   this.setState(prevState => ({
  //     kitlists: [...prevState.kitlists, kitlist]
  //   }))
  // }

  // removekitlist = (kitlist) => {
  //   let kitlists = [...this.state.kitlists]; 
  //   const index = array.indexOf(kitlist)
  //   if (index !== -1) {
  //     array.splice(index, 1);
  //     this.setState({kitlists: kitlists});
  //   }
  // }

  addVehicle = (vehicle) => {
    console.log('add vehicle: ', vehicle); 
    // save to server here

    this.setState(prevState => ({
      vehicles: [...prevState.vehicles, vehicle]
    }), () => {
      console.log('vehicles: ', this.state.vehicles); 
    });
  }

  removeVehicle = (vehicle) => {
    let vehicles = [...this.state.vehicles]; 
    const index = array.indexOf(vehicle)
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({vehicles: vehicles});
    }
  }

  setSelectedTrip = (id, data = null) => {
    if(data != null){

      // update id row in js.

      this.setState(prevState => ({
        trips: [...prevState.trips, data]
      }))
    }

    this.state.trips.map( (item) => {
      if(item._id == id){

        if(item.paths == undefined){
          item.paths = [];
        }
        if(item.sites == undefined){
          item.sites = [];
        }

        this.setState({trip: item.name, id: item._id, vehicle: item.vehicle, paths: item.paths, sites: item.sites}, () => { // kitlist: item.kitlist
          console.log("state now: ", this.state);
        });
      }
    })    
  }

  setSelectedVehicle = (vehicle) => {
    console.log('setSelectedVehicle: ', vehicle);
    this.setState({vehicle:vehicle}, () => {
      this.saveTrip();
    });
  }

  saveName = (name) => {
    console.log('saveName: ', name);
    this.setState({trip: name} , () => {
      this.saveTrip();
    });
  }

  saveTrip = () => {

    console.log('state before trip', this.state); 

    if(this.state.trip !== '' ){
      let body = {name:this.state.trip, vehicle: this.state.vehicle, paths: this.state.paths, sites: this.state.sites}; 

      // add ID to body if not blank
      if(this.state.id !== null && this.state.id !== ''){
        body._id = this.state.id;
      }

      body = JSON.stringify(body);
      console.log('body', body);

      fetch('/api/trips', {
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
        this.getAllData(); // stack order? 
        this.setSelectedTrip(data._id, data);

        // deal with errors here
      });
    }else{
      this.setState({error: "Name can't be empty"});
    }
  }

  setMode = (mode) => {
    this.setState({mode:mode});
  }

  addPath = (path) => {
    const {paths} = this.state
    console.log('set paths');
    paths.push(path);
    this.setState({paths});
    this.saveTrip();
  }

  addSite = (latlng) => {
    const {sites} = this.state
		sites.push(latlng);
		this.setState({sites})
  }

  render() {

    return (
      <>
        <div className="flex-container"> 
        
        <div className="page">
          <div className="header">
            { this.state.error && <h3 className="error"> { this.state.error } </h3> }

            <Bubble className="login-bubble">
              <User />
            </Bubble>
          </div>

          <div className="menu-parent">
            <Bubble className="child">
              <Trips 
                trips={this.state.trips}
                trip={this.state.trip}
                select={this.setSelectedTrip}
                save={this.saveName}
                />
            </Bubble>

            <Bubble className="child">
              <Vehicles 
                vehicles={this.state.vehicles}
                vehicle={this.state.vehicle}
                add={this.addVehicle}
                remove={this.removeVehicle}
                select={this.setSelectedVehicle} />
            </Bubble>
            
            <Bubble className="child">
              <MapControls 
                setMode={this.setMode}
              />
            </Bubble>

          </div>
        </div>
        </div>

        <MapContainer 
          mode={this.state.mode}
          addPath={this.addPath}
          addSite={this.addSite}
          paths={this.state.paths}
          sites={this.state.sites}
          />
      </>
    );

  }
}

{/* <Bubble className="child">
<KitList 
  add={this.addKitlist}
  remove={this.removekitlist}
/>
</Bubble> */}

//   

ReactDOM.render(<App />, document.getElementById('root'));