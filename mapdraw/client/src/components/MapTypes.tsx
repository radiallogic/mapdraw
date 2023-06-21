
import { LatLng } from "leaflet";
import { TSite } from './Sites/SiteTypes';
import { Path } from './Paths/PathTypes';

export interface TVehicle {
  name: string;
}

export interface TUser {
  name: string;
  loggedin: boolean;
  admin?: boolean;
}

export const nullUser: TUser = {
  name: 'none',
  loggedin: false
}

export interface TTrip {
  _id: string,
  name: string;
  id: string;
  vehicle: TVehicle;
  paths: Array<Path>;
  sites: Array<TSite>;
  zoom: number;
  position: LatLng;
}