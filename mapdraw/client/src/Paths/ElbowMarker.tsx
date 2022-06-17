import * as React from "react"
import {useMapEvents, Marker } from 'react-leaflet';
import { DivIcon, DomEvent, LeafletMouseEvent} from 'leaflet';

interface ElbowMarketProps {
    position: any;
    updateLine: Function;
    removeElbow: Function;
}

export const ElbowMarker = (props: ElbowMarketProps): React.ReactElement  => {
    
    let position = props.position;
    const icon = new DivIcon({className: 'line-icon'});

    return <Marker 
        draggable={true}
        eventHandlers={ {
            dblclick: (e) => {
                // //e.originalEvent.preventDefault();
                // DomEvent.stopPropagation(e);
                DomEvent.stopPropagation(e.originalEvent);
                console.log('dbl click marker' );
                props.removeElbow(e);
            },
            drag: (event) => {
                // DomEvent.stopPropagation(event);
                //event = event as unknown as LeafletMouseEvent;
                console.log('marker drag event ', event)

                // // Determine where to move the marker to from the mouse move event.
                // const containerPoint = map.latLngToContainerPoint(event.latlng);
                // const latLng = map.containerPointToLatLng(containerPoint);

                props.updateLine(position, event.originalEvent.latlng) // event.originalEvent.latlng
            }
            
        }}

        zIndexOffset={10}
        position={position}
        icon={ icon } 
        //bubblingMouseEvents={false} 
        >
f
        </Marker>;
}