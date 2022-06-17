import {latLng, LatLng, LatLngLiteral, LeafletMouseEvent} from "leaflet";
import React, { useState, useEffect } from 'react';
import {useMapEvents, Polyline} from 'react-leaflet';
import {ElbowMarker} from './ElbowMarker';
import * as turf from '@turf/turf';
import { isConditionalExpression } from "typescript";

interface ElbowLineProps {
    positions: Array<LatLng>
}

const blueOptions = { color: 'blue' }

export const ElbowLine = (props: ElbowLineProps): React.ReactElement  => {
    
    //let coords = props.positions;
    // use state for coords. 
    const [coords, setCoords] = useState([]);

    useEffect(() => {
        setCoords(props.positions);
    }, [props])

    const addElbow = (e: LeafletMouseEvent) => {
        console.log('add elbow')
        
        let positions = coords.map( coord => {
            return [coord.lng, coord.lat]
        } ) as unknown as Array<turf.Position>;

        console.log("positions", positions); 

        const line = turf.lineString(positions);
        const splitter = turf.point([e.latlng.lng, e.latlng.lat]);
        
        console.log("splitter", splitter); 

        const split = turf.lineSplit(line, splitter);

        console.log("split", split); 

        let linePart = split.features[1].geometry.coordinates; // only works with middle bits
        let bit = linePart.pop(); // remove duplicate coordinates;
        let newline = split.features[0].geometry.coordinates.concat( linePart );

        console.log("newline", newline);

        let tmp = newline.map(bit => {
            return latLng( bit[1], bit[0]) 
        }) as unknown as Array<LatLng>;

        setCoords(tmp);

    }

    const updateLine = (position: LatLng, latLng: LatLng) => {
        console.log('update line')
        // swap old and new marker position
        let tmp = coords.map( coord => {
            if(coord == position){
                return latLng;
            }else{
                return coord;
            }
        })

        console.log('tmp: ', tmp); 
        setCoords(tmp);
    }

    const removeElbow = (e: LeafletMouseEvent) => {
        console.log('remove elbow')
        let latlng = latLng(e.latlng.lat, e.latlng.lng);
        let tmp = coords.map( coord => {
            if(coord == latlng){
                console.log("removeElbow", coord, latlng ); 
            }else{
                return coord;
            }
        })
        setCoords(tmp);
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

                bubblingMouseEvents={false} 
                pathOptions={blueOptions} 
                positions={props.positions} 
                
                >
            </Polyline>
        </>;
}