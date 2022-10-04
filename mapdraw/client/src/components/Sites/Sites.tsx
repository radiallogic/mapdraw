
import * as React from "react"
// import {LatLngBounds, latLng, LatLng, } from 'leaflet';
import SiteMarker from './Site';
import { DrawMouseEvents } from './DrawMouseEvents';
import { TSite } from "./SiteTypes";


type Props = {
    setSites: Function;
    sites: Array<TSite>;
    addSite: Function;
    saveSite: Function;
    mode: string;
}

export const Sites = (props: Props): React.ReactElement  => {
	
    let sites = props.sites.map( (site: TSite, i) => {
        //console.log( JSON.stringify(path) );
        return <SiteMarker site={site} save={props.saveSite} key={i}></SiteMarker>
    });

	return (
        <>  
            <DrawMouseEvents mode={props.mode} addSite={props.addSite} />
            {sites}
        </>
    )
}
