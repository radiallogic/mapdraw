export const SET_MAP_CENTER = 'SET_MAP_CENTER';
export const SET_MAP_ZOOM = 'SET_MAP_ZOOM';


export function setMapCenter(value) {
  return {
    type: SET_MAP_CENTER,
    canter: value
  };
}

export function setMapZoom(value) {
  return {
    type: SET_MAP_ZOOM,
    zoom: value
  };
}

//export function SavePoints(value) {
//  return {
//    type: SET_MAP_ZOOM,
//    zoom: value
//  };
//}