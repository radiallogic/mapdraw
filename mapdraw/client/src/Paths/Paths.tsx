import * as React from "react"
import * as turf from '@turf/turf';
import {LatLngBounds, latLng, LatLng, LatLngLiteral} from 'leaflet';
import {Polyline, SVGOverlay, useMapEvents, useMapEvent} from 'react-leaflet';
import {DrawMouseEvents} from './DrawMouseEvents'

type Props = {
	paths: Array<turf.GeoJSONObject>;
	zoom: number;
	mode: number;
}

type State = {
	paths: Array<turf.GeoJSONObject>
    latLngs: any;
}

const bounds = new LatLngBounds( latLng(51.49, -0.08), latLng(51.5, -0.06) );
const limeOptions = { color: 'black' }

export default class Paths extends React.Component<Props, State>  {
	zoom: number;
	paths: Array<turf.GeoJSONObject>;

	constructor(props: Props) {
		super(props);

        this.state = {
            paths: [],
            latLngs : [
                [0, 0],
              ]
        }
	};

	createPolyline = (latLngs: Array<LatLngLiteral> ) => {

        let coords =  latLngs.map( (item, i) => {
            return [ item.lat, item.lng ];
        } );
    
        let geojson = turf.lineString(coords);

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

        let simplified:turf.GeoJSONObject = turf.simplify(geojson, {tolerance: tolerance, highQuality: false} );
        let paths = this.state.paths;
        paths.push(simplified);
        this.setState({paths: paths});

        //let polyline:typeof Polyline = new Polyline(this.props); 
        //polyline.addTo(this.layerGroup); 
    }

    // addElbows = (map, polyline) => {
    //     const markers = polyline.getLatLngs().map(latLng => {
        
    //     //const mode = map[modesKey];
    //     const icon = new DivIcon({className: 'line-icon'});
    //     const marker = new Marker(latLng, { icon }).addTo(this.layerGroup);

    //     DomEvent.disableClickPropagation(marker);
        
    //     marker.on('dblclick', (e) => {

    //     });

    //     marker.on('mousedown', function mouseDown() {

    //         // Disable the map dragging as otherwise it's difficult to reposition the edge.
    //         map.dragging.disable();

    //         // drag marker
    //         const mouseMove = event => {

    //             // Determine where to move the marker to from the mouse move event.
    //             const containerPoint = map.latLngToContainerPoint(event.latlng);
    //             const latLng = map.containerPointToLatLng(containerPoint);

    //             // Update the marker with the new lat/lng.
    //             marker.setLatLng(latLng);

    //             // ...And finally update the polyline to match the current markers.
    //             const latLngs = markers.map(marker => marker.getLatLng());
    //             polyline.setLatLngs(latLngs);
    //             polyline.redraw();
    //         };

    //         // Listen for the mouse move events to determine where to move the marker to.
    //         map.on('mousemove', mouseMove);

    //         /**
    //          * @method mouseUp
    //          * @return {void}
    //          */
    //         function mouseUp() {

    //             if (!(map[modesKey] & CREATE)) {

    //                 // Re-enable the dragging of the map only if created mode is not enabled.
    //                 map.dragging.enable();
    //             }

    //             // Stop listening to the events.
    //             map.off('mouseup', mouseUp);
    //             map.off('mousedown', mouseDown);
    //             map.off('mousemove', mouseMove);

    //         }

    //         // Cleanup the mouse events when the user releases the mouse button.
    //         // We need to listen on both map and marker, because if the user moves the edge too quickly then
    //         // the mouse up will occur on the map layer.
    //         map.on('mouseup', mouseUp);
    //         marker.on('mouseup', mouseUp);

    //     });

    //     return marker;

    // });

    // return markers;

    // }

    addElbow = () => {
        // let coords = e.sourceTarget._latlngs.map( (item, i ) => {
        //     return [item.lat, item.lng ];
        // });

        // let line = turf.lineString(coords);
        // let splitter = turf.point([e.latlng.lat, e.latlng.lng]);
        // let split = turf.lineSplit(line, splitter);

        // let linePart = split.features[1].geometry.coordinates;
        // let bit = linePart.pop(); // remove duplicate coordinates;
        // let newline = split.features[0].geometry.coordinates.concat( linePart );
    }

    removeElbow = () => {
        // this.layerGroup.eachLayer(function (layer) {

        //     console.log("layer",layer);
        //     if(layer[0] == newline[0] && layer[-1] == newline[-1]){
        //         // remove layer, add new layer
        //     }
        // });
    }

	drawline = (point: LatLng) => {
        let ll = this.state.latLngs;
        ll.push(point);
        this.setState({latLngs:ll})
        console.log('state: ' + this.state.latLngs)
	}

	setMode = () => {

	}

// const lineFunction = line().curve(curveMonotoneX).x(d => d.x).y(d => d.y);


	render() {		
		return (
            <>
                <SVGOverlay attributes={{ stroke: 'red' }} bounds={bounds}>
                    <rect x="0" y="0" width="100%" height="100%" fill="blue" />
                    <circle r="5" cx="10" cy="10" fill="red" />
                    <text x="50%" y="50%" stroke="white">
                        text
                    </text>
                    <line> </line>
                </SVGOverlay>

                <DrawMouseEvents drawline={this.drawline}/>  {/* mode={this.props.mode} */}

                <Polyline pathOptions={limeOptions} positions={this.state.latLngs} ></Polyline>
            </>
        )
    }

}