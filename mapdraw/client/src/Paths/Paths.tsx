import * as React from "react"
import * as turf from '@turf/turf';
import {LatLngBounds, latLng, LatLng, LatLngLiteral} from 'leaflet';
import {Polyline, useMapEvents, useMapEvent} from 'react-leaflet';
import {DrawMouseEvents} from './DrawMouseEvents'
import { ElbowLine } from "./ElbowLine";

type Props = {
	paths: Array<Array<LatLng>>;
	zoom: number;
	mode: number;
}

type State = {
	paths: Array<Array<LatLng>>
    latLngs: any;
}

const EMPTY = [[0, 0],];
const bounds = new LatLngBounds( latLng(51.3, -0.10), latLng(51.5, -0.06) );
const blackOptions = { color: 'black' }


export default class Paths extends React.Component<Props, State>  {
	zoom: number;
	paths: Array<Array<LatLng>>;

	constructor(props: Props) {
		super(props);

        this.state = {
            paths: [],
            latLngs : EMPTY
        }
	};

	createPolyline = (latLngs: Array<LatLngLiteral> ) => {
        //console.log('latLngs', latLngs);

        if(latLngs.length < 2){
            return;
        }

        let c = latLngs.map( (item, i) => {
            return [ item.lat, item.lng ];
        } );
    
        //console.log('coords', coords);

        let geojson = turf.lineString(c);

        let tolerance = 0.01;
        if(this.zoom < 18 && this.zoom >= 15){
            tolerance = 0;
        }
        if(this.zoom < 15 && this.zoom >= 11){
            tolerance = 0.001;
        }
        if(this.zoom < 11 && this.zoom >= 8){
            tolerance = 0.01;
        }
        if(this.zoom < 8 && this.zoom >= 5){
            tolerance = 0.1;
        } 
        if(this.zoom < 5 && this.zoom >= 3){
            tolerance = 0.5;
        } 
        if(this.zoom < 3 && this.zoom >= 1){
            tolerance = 1;
        } 

        let simplified = turf.simplify(geojson, {tolerance: tolerance, highQuality: false} );
        let paths = this.state.paths;
        let latlngs = simplified.geometry.coordinates.map( c => {
            return latLng(c[0], c[1]);
        })  as unknown as Array<LatLng>

        console.log(latlngs);
        paths.push(latlngs);
        this.setState({paths: paths});
    }

	drawline = (point: LatLng) => {
        let ll = [];
        if(this.state.latLngs != EMPTY ){
            ll = this.state.latLngs;
        }
        ll.push(point);
        this.setState({latLngs:ll})
    }

    savePolyline = () => {
        console.log("savePolyline"); 
        this.createPolyline(this.state.latLngs);
        this.setState({latLngs : EMPTY} );
    }

	setMode = () => {

	}

	render() {
        let paths = this.state.paths.map( (path, i) => {
            //console.log( JSON.stringify(path) );
            return <ElbowLine positions={path} key={i} ></ElbowLine>
        })

        //console.log(paths);

		return (
            <>
                <DrawMouseEvents drawline={this.drawline} saveline={this.savePolyline} mode={this.props.mode} />
                <Polyline pathOptions={blackOptions} positions={this.state.latLngs} key={this.state.latLngs} ></Polyline>
                {paths}
            </>
        )
    }

}