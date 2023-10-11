
import * as React from "react"
import SiteMarker from './SiteMarker';
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
    
    console.log('Sites props', props.sites);

    let sites = props.sites.map( (site: TSite, i) => {
        //console.log( JSON.stringify(path) );
        return <SiteMarker site={site} setSites={props.setSites} save={props.saveSite} key={i}></SiteMarker>
    });

	return (
        <>  
            <DrawMouseEvents mode={props.mode} addSite={props.addSite} />
            {sites}
        </>
    )
}
