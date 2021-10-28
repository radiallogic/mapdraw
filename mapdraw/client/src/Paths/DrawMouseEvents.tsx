import * as React from "react"
import {useMapEvents} from 'react-leaflet';

interface DrawMouseProps {
    drawline: Function;
}

export const DrawMouseEvents = (props: DrawMouseProps): React.ReactElement  => {
    const map = useMapEvents({
		click(event) {
			
            // map.dragging.enable(); toggle

            // const point = map.mouseEventToContainerPoint(event.originalEvent);
            // console.log( map.containerPointToLatLng(point) ); 
		},
		mousemove(e) {
            const point = map.mouseEventToContainerPoint(e.originalEvent);
            console.log( 'mouse move: ' + map.containerPointToLatLng(point) ); 
            props.drawline(map.containerPointToLatLng(point)); 
		},
        mouseup() {
            map.dragging.enable();
            console.log('mouse up')
        }, 
        mousedown(){
            map.dragging.disable();
            console.log('mouse down')
        },
	});

    return null;
}