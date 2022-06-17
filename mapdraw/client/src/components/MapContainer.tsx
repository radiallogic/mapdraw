import * as React from "react"
import * as turf from '@turf/turf';
import  { MapContainer, TileLayer, useMapEvents, SVGOverlay} from 'react-leaflet'
import { LatLngExpression, LatLngBounds, latLng, LatLng} from "leaflet";

import Paths  from '../Paths/Paths';
import {ADD} from '../Paths/Constants';

const bounds = new LatLngBounds( latLng(51.49, -0.08), latLng(51.5, -0.06) );

interface PositionProps {
	setPosition: Function;
	setBounds: Function;
}

interface ZoomProps {
	zoom: number;
	setZoom: Function;
}

const Position = (props: PositionProps): React.ReactElement => {
	const map = useMapEvents({
		dragend: ( e ) => {
		  props.setPosition( e.target.getCenter() );
		  props.setBounds( e.target.getBounds() );
		  console.log("map center", e.target.getCenter());
		  console.log("map bounds", e.target.getBounds());
		}
	});
	return null;
}

const Zoom = (props: ZoomProps): React.ReactElement  => {
	const map = useMapEvents({
		click() {
			map.locate()
		},
		locationfound(e) {
			if(props.zoom !==  map.getZoom() ){
				props.setZoom( map.getZoom() )
				console.log("map getZoom", map.getZoom() );
			}
		},
	});
	return null;
}

type Props = {
	paths: Array<Array<LatLng>>;
	position: LatLngExpression;
	zoom: number;
	mode: number;

	setPosition: Function;
	setBounds: Function;
	setZoom: Function;
	addSite: Function;
}

type State = {
	markers: Array<React.ReactElement>;
	position: LatLngExpression;
	zoom: number;
}

export default class MapComplete extends React.Component<Props, State> {
	constructor(props: Props) {	
		super(props);
	};
	
	componentDidUpdate(prevProps: Props){
		//console.log(' prevProps ', this.props.zoom, prevProps.zoom);   
		if(this.props.paths !== prevProps.paths){
			console.log(' Paths changed in MapCcontainer')
		}
		if(this.props.position !== prevProps.position ){
			this.setState({position:this.props.position});
		}
		if(this.props.zoom !== prevProps.zoom ){
			this.setState({zoom:this.props.zoom});
		}
	}

	addMarker = (event:any) => {
		if(this.props.mode == ADD){ 
			//console.log("addMarker", event );
			this.props.addSite(event.latlng);
		}
	}

	render() {		
		return (
		  <MapContainer
			center={this.props.position}
			zoom={this.props.zoom}
			>

			<Zoom
				setZoom={this.props.setZoom}
				zoom={this.props.zoom}
			/>
			<Position 
				setPosition={this.props.setPosition} 
				setBounds={this.props.setBounds}
			/>

			<Paths
			    paths={this.props.paths}
			    mode={this.props.mode}
				zoom={this.props.zoom}
			/>

			<TileLayer
			  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			  url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
			/>
		  </MapContainer>
		);
	}
}