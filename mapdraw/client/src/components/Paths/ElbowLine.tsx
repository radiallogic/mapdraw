import {latLng, LatLng, LeafletMouseEvent} from "leaflet";
import React, {useState} from 'react';
import { Polyline } from 'react-leaflet';
import { ElbowMarker } from './ElbowMarker';
import * as turf from '@turf/turf';
import * as _ from "lodash";

import {Path} from './PathTypes';
import { Hash } from "crypto";


interface ElbowLineProps {
    positions: Path
    setpaths: Function;
    index: number;
}

const blueOptions = { color: 'blue' }

export const ElbowLine = (props: ElbowLineProps): React.ReactElement  => {
    console.log("ElbowLineProps", props);

    const coords = props.positions.points;

    // const [tmpP, setP] = useState();

    const addElbow = (e: LeafletMouseEvent) => {

        let positions = coords.map( coord => {
            return [coord.lng, coord.lat]
        } ) as unknown as Array<turf.Position>;

        const line = turf.lineString(positions);
        const splitter = turf.point([e.latlng.lng, e.latlng.lat]);

        const split = turf.lineSplit(line, splitter);

        let linePart = split.features[1].geometry.coordinates; // only works with middle bits
        let bit = linePart.pop(); // remove duplicate coordinates;
        let newline = split.features[0].geometry.coordinates.concat( linePart );

        let tmp = newline.map(bit => {
            return latLng( bit[1], bit[0]) 
        });

        const p: Path = {
            points: tmp
        }

        props.setpaths(p, props.index);
    }

    const updateLine = (position: LatLng, latLng: LatLng) => {
        console.log('update line')
        // swap old and new marker position
        let tmp = coords.map( coord => {
            //console.log(coord, position)
            if( _.isEqual(coord, position) ){
                return latLng;
            }else{
                return coord;
            }
        })
        const p: Path = {
            points: tmp
        }
        console.log( 'update index: ', props.index); 

        props.setpaths(p, props.index);
    }

    //props.setpaths(p, props.index);

    const removeElbow = (e: LeafletMouseEvent) => {
        //console.log('remove elbow', coords)
        let latlng = latLng(e.latlng.lat, e.latlng.lng);
        

        let tmp = coords.map( coord => {
            if( _.isEqual(coord, latlng)){
                console.log('remove elbow at: ', latlng); 
            }else{
                return coord;
            }
        })
        tmp = _.compact(tmp);

        const p: Path = {
            points: tmp
        }

        props.setpaths(p, props.index);
    }
    
    let markers = coords.map( (latLng, i) => {
        return <ElbowMarker position={latLng} updateLine={updateLine} removeElbow={removeElbow} key={i} ></ElbowMarker>
    });

    return <> 
            {markers}
            <Polyline 
                eventHandlers={{
                    dblclick: (e) => { 
                        e.originalEvent.preventDefault();
                        console.log('line dbl click')
                        addElbow(e);
                    }
                }}

                bubblingMouseEvents={ false } 
                pathOptions={ blueOptions } 
                positions={ props.positions.points }
                >
            </Polyline>
        </>;
}