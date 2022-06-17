import * as React from "react"
import {useMapEvents} from 'react-leaflet';
import {ALL, ADD, NONE, DELETE} from './Constants'

interface DrawMouseProps {
    saveline: Function;
    drawline: Function;
    mode: Number;
}

let draw = false; 

export const DrawMouseEvents = (props: DrawMouseProps): React.ReactElement  => {
    
    const map = useMapEvents({
		click(e) {
            //console.log("mode: " + props.mode);
		},
		mousemove(e) {
            //console.log("draw: " + draw);
            if(draw){
                const point = map.mouseEventToContainerPoint(e.originalEvent);
                //console.log( 'mouse move: ' + map.containerPointToLatLng(point) ); 
                props.drawline(map.containerPointToLatLng(point)); 
            }
			
            if(props.mode == NONE || props.mode == DELETE){
                map.dragging.enable();
            }
		},
        mouseup(e) {
            e.originalEvent.preventDefault();
            // map.dragging.enable();
            console.log('mouse up')
            props.saveline();
            draw = false;
        }, 
        mousedown(e){
            e.originalEvent.preventDefault();
            if(props.mode == ALL || props.mode == ADD){
                draw = true;
            }
            if(props.mode == ADD || props.mode == ALL){
                map.dragging.disable();
            }
            console.log('mouse down')
        },
	});

    return null;
}