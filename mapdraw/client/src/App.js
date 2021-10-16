// client/src/App.js
import "core-js/stable";
import "regenerator-runtime/runtime";


import React, { Component } from "react";
import ReactDOM from 'react-dom';

import User from './components/User/User'

import MapContainer from './components/MapContainer'
import MapControls from './components/MapControls'

import Trips from './components/Trip/Trips'
import Vehicles from './components/Trip/Vehicles'
import KitList from './components/Trip/KitList'

import Bubble from './components/Bubble'
import './app.css'

class App extends Component {
  constructor(){
    super();

    this.state = {
      trips: [], 
      vehicles: [], 
      kitlists: [],

      id: '',
      name: 'None', 
      vehicle: '',
      kitlist: '',  
      paths: [],
      sites: [],

      user: '',
      error: '',

			zoom: 6,
			position : [51.454, -2.587],
    }
  }

  componentDidMount = () => {
    this.isLoggedIn();
    this.getAllData();
    this.setState({position: this.getRandomPosition() }, () => {
      console.log(this.state.position);
    });
  }

  isLoggedIn = () => {
    fetch('/user/isloggedin', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }).then( (response) => {
      return response.json();
    }).then( (data) => {
      console.log("isloggedin data: ", data.user);
      this.setState({user:data.user});
    });
  }


  getRandomPosition = () => {
    return  [ 
      ( (Math.random() * (90 - -90) + -90).toFixed(3) * 1 ) , 
      ( (Math.random() * (80 - -180) + -180).toFixed(3) * 1 ) ,   
    ];
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
              //console.log('from server', data)
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
    console.log('setSelectedTrip' );

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

        this.setState(
          {name: item.name, 
            id: item._id,
            vehicle: item.vehicle,
            paths: item.paths,
            sites: item.sites,
            zoom: item.zoom, 
            position: item.position
          }, () => { // kitlist: item.kitlist
          console.log("state now: ", this.state);
        });
      }
    })    
  }

  setSelectedVehicle = (vehicle) => {
    //console.log('setSelectedVehicle: ', vehicle);
    this.setState({vehicle:vehicle}, () => {
      this.saveTrip();
    });
  }

  saveName = (name) => {
    console.log('saveName: ', name);
    this.setState({trip: name}, () => {
      this.saveTrip();
    });
  }

  saveNew = (name) => {
    console.log('save New: ', name);
    this.setState({trip: name, paths: [], vehicle: '', id: '', position: this.getRandomPosition() }, () => {
      this.saveTrip();
    });
  }

  saveTrip = () => {

    //console.log('state before save', this.state); 
    //console.log('saveTrip: ',  this.state.zoom );

    if(this.state.name !== '' ){
      let body = {name:this.state.trip, 
        vehicle: this.state.vehicle, 
        paths: this.state.paths, 
        sites: this.state.sites, 
        zoom: this.state.zoom, 
        position: this.state.position
      }; 

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
        // If new data
        if(this.state.id == null || this.state.id == ''){
          this.setSelectedTrip(data._id, data);
        }
      });
    }else{
      this.setState({error: "Name can't be empty"});
    }
  }

  setMode = (mode) => {
    this.setState({mode:mode});
  }

  setPosition = (position) => {
    this.setState({position:position}, () => {
      this.saveTrip();
    });
  }
  
  setZoom = (zoom) => {
    console.log('app set zoom ', this.state.zoom, zoom );
    this.setState({zoom:zoom}, () => {
      this.saveTrip();
      console.log('zoom set')
    });

  }

  addPath = (path) => {
    const {paths} = this.state
    //console.log('set paths');
    paths.push(path);
    this.setState({paths}, () => {
      this.saveTrip();
    });
    
  }

  // replace path if first or last coordinates are the same
  // may miss edge cases. 

  modifyPath = (newpath) => {
    const {paths} = this.state
    let index = paths.map( (item, i) => {


      if(item[0][0] == newpath[0][0] && item[0][1] == newpath[0][1] || 
        ( item[ item.length - 1][0] == newpath[ newpath.length -1 ][0] && 
          item[ item.length - 1][1] == newpath[ newpath.length -1 ][1] ) 
        ){
        return i;
      }
      return -1;
    });

    if(index != -1 ){
      paths[index] = newpath;
    }

    this.setState({paths}, () => {
      console.log('Set pat');
      this.saveTrip();
    });
    
  }

  addSite = (latlng) => {
    const {sites} = this.state
		sites.push({position: latlng});
		this.setState({sites})
  }

  saveSites = () => {
    
  }

  setUser = (user) => {
    this.setState({user: user});
  }

  render() {

    return (
      <>
        <div className="flex-container"> 
        
        <div className="page">
          <div className="header">
            { this.state.error && <h3 className="error"> { this.state.error } </h3> }

            <Bubble className="login-bubble">
              <User clear={this.getAllData} setUser={this.setUser} user={this.state.user}/>
            </Bubble>
          </div>

          <div className="menu-parent">
            <Bubble className="child">
              <Trips 
                trips={this.state.trips}
                id={this.state.id}
                name={this.state.name}
                select={this.setSelectedTrip}
                save={this.saveName}
                savenew={this.saveNew}
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
                vehicle={this.state.vehicle}
                setMode={this.setMode}
              />
            </Bubble>

          </div>
        </div>
        </div>

        <MapContainer 
          mode={this.state.mode}

          position={this.state.position}
          zoom={this.state.zoom}
          setPosition={this.setPosition}
          setZoom={this.setZoom}

          addPath={this.addPath}
          modifyPath={this.modifyPath}
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