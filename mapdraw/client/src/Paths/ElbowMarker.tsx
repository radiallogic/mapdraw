import * as React from "react"
import {useMapEvents, Marker } from 'react-leaflet';
import { DivIcon, DomEvent} from 'leaflet';

interface ElbowMarketProps {
    position: any;
    updateLine: Function;
    removeElbow: Function;
}

export const ElbowMarker = (props: ElbowMarketProps): React.ReactElement  => {

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
                console.log('marker drag event ', event)
                props.updateLine(props.position, event.target._latlng) 
            }, 
            dragend: (event) => {
                //console.log(event);
            }   
            
        }}

        zIndexOffset={10}
        position={ props.position }
        icon={ icon } 
        bubblingMouseEvents={false}
        >
        </Marker>;
}