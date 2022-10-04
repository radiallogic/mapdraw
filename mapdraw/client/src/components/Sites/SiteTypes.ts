
import {LatLng} from "leaflet";

export type TSite = {
    rows: Array<SiteItem>
    position: LatLng
}

export type SiteItem = {
    type: String;
    value: String;
    name: string;
}