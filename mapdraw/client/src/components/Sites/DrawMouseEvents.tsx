import * as React from "react"
import {useMapEvents} from 'react-leaflet';
import { DomEvent} from 'leaflet';

interface DrawMouseProps {
    mode: string;
    addSite: Function;
}
export const DrawMouseEvents = (props: DrawMouseProps): React.ReactElement  => {
    
    const map = useMapEvents({
		dblclick(e) {
            map.doubleClickZoom.disable();
            DomEvent.stopPropagation(e);
            e.originalEvent.preventDefault();


            
            console.log('addsite');
            props.addSite(e.latlng);
		}
	});

    return null;
}