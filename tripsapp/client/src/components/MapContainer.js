import React from 'react'
import  { LayersControl, Marker, Map, Popup, TileLayer, ZoomControl, GeoJSON, ScaleControl} from 'react-leaflet'


import Pather from './Pather'

export default class MapContainer extends React.Component {
	constructor() {
		super();
		this.state = {
			zoom: 15,
			position : [51.454, -2.587]
		};
	};

  	Ref = React.createRef();

    componentDidMount = () => {
    	//console.log('componentDidMount');
		document.addEventListener('keydown', event => {
			// Cancel the current FreeDraw action when the escape key is pressed.
		 	if (event.key === 'Escape') {
				this.Ref.current.leafletElement.cancel();
		 	}
		});
		
        //this.updatePosition();
    };
    updatePosition = () => {

    }

	handlePopupClose = () => {
		//console.log('handlePopupClose');

		// var zoom = this.refs.map.leafletElement.getZoom();
		// this.props.setCenter(this.refs.map.leafletElement.getCenter(), zoom); 
		// this.updateAllowPositionUpdate(true);

		// this.refs.map.leafletElement.setZoom(zoom);
	}


	render() {

		const position = [51.454, -2.587];
		return (
		  <Map center={this.state.position} zoom={5}>
			<TileLayer
			  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			  url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
			/>

			<Pather />
			
			<Marker position={position}>
			  <Popup>
				A pretty CSS3 popup. <br/> Easily customizable.
			  </Popup>
			</Marker>

			
		  </Map>
		);
	  }
 //   render(){

// 		let mode = ALL;

//         let draw = <Freedraw
// 	            mode={mode}
// 	            onMarkers={this.handleOnMarkers}
// 	            onModeChange={this.handleModeChange}
// 	            ref={this.freedrawRef}
//              />;
        
//         return (
// 			<Map
// 				className="map" 
//                 ref='map' 
//                 center={this.state.position} 
//                 // zoom={this.state.zoom} 
//                 // maxZoom={18}
//                 // onDragend={this.updatePosition}
//                 // onZoomend={this.onZoomEnd}
//                 // onClick={this.addMarker}
//                 // onPopupClose={this.handlePopupClose}
//                 // setMessage={this.props.setMessage}
//                 // setLoading={this.props.setLoading}
//             >
// <TileLayer
//           attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//           url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
//         />
				
// 				<Marker position={this.state.position}>
// 					<Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
// 				</Marker>

//             {/* {draw} */}
//             </Map>
//        )
//    }

}