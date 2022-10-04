import * as React from "react"
import { Marker } from 'react-leaflet';
import { DivIcon, DomEvent, LatLng} from 'leaflet';

interface ElbowMarketProps {
    position: LatLng;
    updateLine: Function;
    removeElbow: Function;
}

export const ElbowMarker = (props: ElbowMarketProps): React.ReactElement  => {

    const icon = new DivIcon({className: 'line-icon'});

    return <Marker 
        draggable={true}
        eventHandlers={ {
            dblclick: (e) => {
                DomEvent.stopPropagation(e);
                props.removeElbow(e);
            },
            drag: (event) => {
                DomEvent.stopPropagation(event);
                //console.log('marker drag event ', event)

                //props.updateLine(props.position, event.target._latlng) 
            },
            mouseup: (event) => { 
                // dragend doesn't fire on desktop for some reason
                //console.log("mouseup", event); 
                props.updateLine(props.position, event.target._latlng) 
            }
        } }
        zIndexOffset={10}
        position={ props.position }
        icon={ icon } 
        bubblingMouseEvents={false}
        >
    </Marker>;
}