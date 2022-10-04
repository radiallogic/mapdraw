import * as React from "react"
import {useMapEvents} from 'react-leaflet';

interface DrawMouseProps {
    mode: string;
    addSite: Function;
}
export const DrawMouseEvents = (props: DrawMouseProps): React.ReactElement  => {
    
    const map = useMapEvents({
		dblclick(e) {
            console.log('addsite');
            props.addSite(e.latlng);
		}
	});

    return null;
}