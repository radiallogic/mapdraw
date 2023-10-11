import * as React from "react"
import * as turf from '@turf/turf';

// import {  atom, useAtom } from 'jotai'
// import { PathsAtom } from "../../globals";

import {LatLngBounds, latLng, LatLng} from 'leaflet';
import {Polyline, useMapEvents, useMapEvent} from 'react-leaflet';
import {DrawMouseEvents} from './DrawMouseEvents'
import { ElbowLine } from "./ElbowLine";

import { Path } from './PathTypes';

type Props = {
    setPaths: Function; 
	paths: Array<Path>;
	zoom: number;
	mode: string;
    setMode: Function;
}

type State = {
	paths: Array<Path>
    latLngs: any;
}

const EMPTY = [[0, 0],];
const bounds = new LatLngBounds( latLng(51.3, -0.10), latLng(51.5, -0.06) );
const blackOptions = { color: 'black' }

export default class Paths extends React.Component<Props, State>  {
	zoom: number;
	paths: Array<Path>;

	constructor(props: Props) {
		super(props);

        this.state = {
            paths: [],
            latLngs : EMPTY
        }
	};

    componentDidUpdate(prevProps: Props) { 
		if(this.props.paths !== prevProps.paths){ 
            this.setState({paths: this.props.paths});
		}
	}

	createPolyline = (latLngs: Array<LatLng> ) => {

        if(latLngs.length < 2){
            return;
        }

        let c = latLngs.map( (item, i) => {
            return [ item.lat, item.lng ];
        } );

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
        })

        // create Path object here.
        const p: Path ={
            points: latlngs
        }
        paths.push(p);
        this.setState({paths: paths});

        //console.log('setpaths in app.tsx: ', paths);
        this.props.setPaths(paths);
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
        //console.log("savePolyline"); 
        this.createPolyline(this.state.latLngs);
        this.setState({latLngs : EMPTY} );
    }

    setpaths = (path: Path, index: number) => {
        let paths = this.state.paths;
        //console.log(paths, path, index);
        paths[index] = path;
        this.setState({paths: paths}); 

        //  for saving on server
        //console.log('setpaths: ', paths);
        this.props.setPaths(paths);
    }

	render() {
        let paths = this.state.paths.map( (path: Path, i: number) => {
            return <ElbowLine positions={path} key={i} index={i} setpaths={this.setpaths} ></ElbowLine>
        })

		return (
            <>
                <DrawMouseEvents 
                    drawline={this.drawline}
                    saveline={this.savePolyline}
                    mode={this.props.mode} 
                    setMode={this.props.setMode}
                />
                <Polyline 
                    pathOptions={blackOptions}
                    positions={this.state.latLngs} 
                    key={this.state.latLngs} >
                </Polyline>
                {paths}
            </>
        )
    }

}