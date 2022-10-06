import * as React from "react"
import { createRoot } from 'react-dom/client';

import { LatLngExpression, LatLngBounds, latLng, LatLng} from "leaflet";

import User, {isLoggedIn, nullUser} from './components/User/User'
import MapContainer from './components/MapContainer'
import MapControls from './components/MapControls'

import Trips from './components/Trip/Trips'
import Vehicles from './components/Trip/Vehicles'
import KitList from './components/Trip/KitList'

import Bubble from './components/Bubble'
import './app.css'

import {TSite} from './components/Sites/SiteTypes';
import {TVehicle, TTrip, TUser} from './components/MapTypes';
import {Path} from './components/Paths/PathTypes';
import { ErrorMsg } from "./components/GlobalTypes";


type Props = {

}

type State = {
	markers: Array<React.ReactElement>;
	position: LatLngExpression;
  bounds: LatLngExpression;
	zoom: number;

  mode: string;

  trip: TTrip, 
  trips: Array<TTrip>, 
  vehicles: Array<TVehicle>, 
  kitlists: Array<KitList>,

  id: string,
  name: string, 
  TVehicle: string,
  kitlist: string,  
  paths: Array<Path> ,
  sites: Array<TSite>,

  user: TUser,
  error: ErrorMsg,
}


class App extends React.Component<Props, State> {
	constructor(props: Props) {	
		super(props);

    const e:ErrorMsg = {
      valid: false
    }

    this.state = {
      markers: [],
			zoom: 6,
			position : [51.454, -2.587],
      bounds: [0,0],

      mode: '5',
      
      trip: null, 
      trips: [], 
      vehicles: [], 
      kitlists: [],
    
      id: '',
      name: '',
      TVehicle: '',
      kitlist: '',  
      paths: [] ,
      sites: [],
    
      user: nullUser,
      error: e,
    }
  }

  componentDidMount = () => {

    this.setState({position: this.getRandomPosition() }, () => {
      console.log("position: ", this.state.position);
    });

    this.setState({user:isLoggedIn()});
    this.getAllData();
  }

  getRandomPosition = () => {
    let n1 = Math.random();
    let n2 = Math.random();
    let pos = [ 
       ( n1 * (90 - -90)  + -90) , 
       ( n2 * (80 - -180) + -180) ,   
    ];

    // ( ( n1 * (90 - -90)  + -90).toFixed(3) * 1 ) , 
    // ( ( n2 * (80 - -180) + -180).toFixed(3) * 1 ) ,   

    const ll = new LatLng(pos[0], pos[1]); 
    console.log('ll', ll); 
    return ll;
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
              this.setState({[item]:data} as any);
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

  addVehicle = (TVehicle: TVehicle) => {
    console.log('add TVehicle: ', TVehicle); 
    // save to server here

    this.setState(prevState => ({
      vehicles: [...prevState.vehicles, TVehicle]
    }), () => {
      console.log('vehicles: ', this.state.vehicles); 
    });
  }

  removeVehicle = (TVehicle: TVehicle) => {
    // let vehicles = [...this.state.vehicles]; 
    // const index = TVehicle.index()
    // if (index !== -1) {
    //   index.splice(1);
    //   this.setState({vehicles: vehicles});
    // }
  }

  setSelectedTrip = (id: string, data: TTrip) => {
    console.log('setSelectedTrip' );

    if(data != null){
      // update id row in js.
      this.setState(prevState => ({
        trips: [...prevState.trips, data]
      }))
    }

    this.state.trips.map( (item: TTrip) => {
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
            //TVehicle: item.TVehicle,
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

  setSelectedVehicle = (TVehicle: string) => {
    //console.log('setSelectedVehicle: ', TVehicle);
    this.setState({TVehicle:TVehicle}, () => {
      this.saveTrip();
    });
  }

  createDefaultTrip = (name: string) => {
    const v: TVehicle = {
      name: 'bike'
    }

    const t: TTrip = {
      name: name,
      _id: null,
      id: null,
      paths: [],
      sites: [],
      zoom: 5,
      position: this.getRandomPosition(),
      vehicle: v,
    }
    return t;
  }

  saveName = (name: string) => {
    console.log('saveName: ', name);

    const t = this.createDefaultTrip(name);
    
    this.setState({trip: t}, () => {
      this.saveTrip();
    });
  }

  saveNew = (name: string) => {
    console.log('save New: ', name);
    const t = this.createDefaultTrip(name);

    this.setState({trip: t}, () => {
      this.saveTrip();
    });
  }

  saveTrip = () => {

    //console.log('state before save', this.state); 
    //console.log('saveTrip: ',  this.state.zoom );
    if(this.state.user.loggedin != true){
      const e:ErrorMsg = {
        valid: true,
        message: 'Warning (Your drawings won\'t be saved unless you login)'
      }
      this.setState({error:e});
      return; 
    } 
    if(this.state.name !== '' ){
      let body = {
        _id: null as any,
        name: this.state.trip, 
        TVehicle: this.state.TVehicle, 
        paths: this.state.paths, 
        sites: this.state.sites, 
        zoom: this.state.zoom, 
        position: this.state.position
      }; 

      // add ID to body if not blank
      if(this.state.id !== null && this.state.id !== ''){
        body._id = this.state.id;
      }

      let bodystr = JSON.stringify(body);
      console.log('body', body);

      fetch('/api/trips', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: bodystr
      }).then( (response) => {
        return response.json();
      }).then( (data) => {
        // If new data
        if(this.state.id == null || this.state.id == ''){
          this.setSelectedTrip(data._id, data);
        }
      });
    }else{

      const e:ErrorMsg={
        valid:true,
        message: "Name can't be empty"
      }
      this.setState({error:e});
    }
  }

  setMode = (mode: string) => {
    console.log('set mode: ' + mode)
    this.setState({mode:mode});
  }

  setPosition = (position: LatLngExpression) => {
    this.setState({position:position}, () => {
      this.saveTrip();
    });
  }

  setBounds = (bounds: LatLngExpression) => {
    this.setState({bounds:bounds}, () => {
      this.saveTrip();
    });
  }
  
  setZoom = (zoom: number) => {
    console.log('app set zoom ', this.state.zoom, zoom );
    this.setState({zoom:zoom}, () => {
      this.saveTrip();
      console.log('zoom set')
    });

  }

  addPath = (Path: Path) => {
    //console.log('set paths');
    const {paths} = this.state;
    
    paths.push(Path);
    this.setState({paths}, () => {
      this.saveTrip();
    });
    
  }

  // replace Path if first or last coordinates are the same
  // may miss edge cases. 

  // modifyPath = (newpath) => {
  //   const {paths} = this.state
  //   let index = paths.map( (item, i) => {


  //     if(item[0][0] == newpath[0][0] && item[0][1] == newpath[0][1] || 
  //       ( item[ item.length - 1][0] == newpath[ newpath.length -1 ][0] && 
  //         item[ item.length - 1][1] == newpath[ newpath.length -1 ][1] ) 
  //       ){
  //       return i;
  //     }
  //     return -1;
  //   });

  //   if(index != -1 ){
  //     paths[index] = newpath;
  //   }

  //   this.setState({paths}, () => {
  //     console.log('Set pat');
  //     this.saveTrip();
  //   });
    
  // }

  addSite = (latlng: LatLng) => {
    console.log('latlng', latlng)
    const {sites} = this.state
    
    const s: TSite = {
      rows: [],
      position: latlng
    }

		sites.push(s);
		this.setState({sites}, () => {
      console.log('app sites')
    })
  }

  saveSites = () => {
    this.saveTrip();
  }

  setUser = (user: TUser) => {
    console.log('in set user');
    this.setState({user: user});
  }

  setPaths = (paths: Array<Path>) => {
    this.setState({paths: paths});
  }

  setSites = (Sites: Array<TSite>) => {
    this.setState({sites: Sites});
  }

  render() {


    const controlBubbles = 
      <><Bubble className="child">
      <Trips 
        trips={this.state.trips}
        id={this.state.id}
        name={this.state.name}
        select={this.setSelectedTrip}
        save={this.saveName}
        savenew={this.saveNew}
        />
    {/* </Bubble>
      
    <Bubble className="child" > */}
    <hr />
      <Vehicles 
        vehicles={this.state.vehicles as any}
        vehicle={this.state.TVehicle}
        add={this.addVehicle}
        remove={this.removeVehicle}
        select={this.setSelectedVehicle} />
    </Bubble>
    </>;


    return (
      <>
        <div className="flex-container"> 
        
        <div className="page">
          <div className="header">
            { this.state.error.valid && <h3 className="error"> { this.state.error.message } </h3> }

            <Bubble className="login-bubble">
              <User clear={this.getAllData} setUser={this.setUser} user={this.state.user}/>
            </Bubble>
          </div>
          
          <div className="menu-parent">
            {this.state.user.loggedin && controlBubbles}
            
            <Bubble className="child">
              <MapControls
                //vehicle={this.state.TVehicle}
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
          
          setMode={this.setMode}
          setPosition={this.setPosition}
          setBounds={this.setBounds}
          setZoom={this.setZoom}
          setSites={this.setSites}
          setPaths={this.setPaths}

          paths={this.state.paths}
          sites={this.state.sites}

          //addPath={this.addPath}
          //modifyPath={this.modifyPath}

          addSite={this.addSite}
          saveSite={this.saveSites}          
          />
      </>
    );
  }
}
 

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
