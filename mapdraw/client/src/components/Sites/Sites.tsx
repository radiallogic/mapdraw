
import * as React from "react"
import SiteMarker from './SiteMarker';
import { DrawMouseEvents } from './DrawMouseEvents';
import { TSite } from "./SiteTypes";


type Props = {
    updateSite: Function;
    sites: Array<TSite>;
    addSite: Function;
    saveSite: Function;
    mode: string;
}

export const Sites = (props: Props): React.ReactElement  => {

    let sites = props.sites.map( (site: TSite, i) => {
        return <SiteMarker site={site} updateSite={props.updateSite} save={props.saveSite} key={i}></SiteMarker>
    });

	return (
        <>  
            <DrawMouseEvents mode={props.mode} addSite={props.addSite} />
            {sites}
        </>
    )
}
