import * as React from "react"
import {useMapEvents} from 'react-leaflet';
import {ADD, EDIT, MOVE, DELETE} from '../Constants'

interface DrawMouseProps {
    saveline: Function;
    drawline: Function;
    setMode: Function;
    mode: string;
}

let draw = false; 

export const DrawMouseEvents = (props: DrawMouseProps): React.ReactElement  => {
      
    const map = useMapEvents({
		mousemove(e) {
            if(draw){
                const point = map.mouseEventToContainerPoint(e.originalEvent);
                //console.log( 'mouse move: ' + map.containerPointToLatLng(point) ); 
                props.drawline(map.containerPointToLatLng(point)); 
            }
			
            if(props.mode == MOVE || props.mode == DELETE || props.mode == EDIT ){
                map.dragging.enable();
            }
		},
        mouseup(e) {
            //e.originalEvent.preventDefault();
            // map.dragging.enable();
            console.log('mouse up')

            if(props.mode == ADD){
                props.saveline();
            }
            draw = false;
            props.setMode(EDIT);
        }, 
        mousedown(e){
            //e.originalEvent.preventDefault();
            if(props.mode == ADD){
                draw = true;
                map.dragging.disable();
            }
            console.log('mouse down')
        }

	});

    return null;
}