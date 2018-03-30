import {default as React, Component} from "react";
import {GoogleMap} from "react-google-maps";
import googleMapsLoader from "react-google-maps-loader";

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
} from "react-google-maps";
import DrawingManager from "react-google-maps/lib/components/drawing/DrawingManager";

CONST = GOOGLE_MAPS_API_KEY = "myapikey" // Change your api key 
 
//class MyComponent extends Component {
//    constructor() {
//        super()
//        this.state = {
//            map: null,
//        }
//    }
// 
//    componentDidMount() {
//        if (this.props.googleMaps)
//            this.initMap()
//        }
//    }
// 
//    componentDidUpdate(prevProps) {
//        if (!prevProps.googleMaps && this.props.googleMaps)
//            this.initMap()
//        }
//    }
// 
//    initMap() {
//        const map = new googleMaps.Map(this.ref_map)
//        this.setState({map})
//    }
// 
//    render() {
//        const {googleMaps} = this.props
// 
//        // You should handle the case when Google Maps is not loaded yet 
//        return googleMaps
//            ? <div ref={ref => this.ref_map = ref} />
//            : <Spinner /> // You should use a custom loader here 
//    }
//}
 


const google = window.google;

class Map extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <GoogleMap
      defaultZoom={3}
      defaultCenter={new google.maps.LatLng(-34.397, 150.644)}
      >
      
      </GoogleMap>
    );
  }
}

//const Map = compose(
//  withProps({
//    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
//    loadingElement: <div style={{ height: `100%` }} />,
//    containerElement: <div style={{ height: `400px` }} />,
//    mapElement: <div style={{ height: `100%` }} />,
//  }),
//  withScriptjs,
//  withGoogleMap
//)(props =>
//  <GoogleMap
//    defaultZoom={3}
//    defaultCenter={new google.maps.LatLng(-34.397, 150.644)}
//  >
//    <DrawingManager
//      defaultDrawingMode={google.maps.drawing.OverlayType.CIRCLE}
//      defaultOptions={{
//        drawingControl: true,
//        drawingControlOptions: {
//          position: google.maps.ControlPosition.TOP_CENTER,
//          drawingModes: [
//            google.maps.drawing.OverlayType.CIRCLE,
//            google.maps.drawing.OverlayType.POLYGON,
//            google.maps.drawing.OverlayType.POLYLINE,
//            google.maps.drawing.OverlayType.RECTANGLE,
//          ],
//        },
//        circleOptions: {
//          fillColor: `#ffff00`,
//          fillOpacity: 1,
//          strokeWeight: 5,
//          clickable: false,
//          editable: true,
//          zIndex: 1,
//        },
//      }}
//    />
//  </GoogleMap>
//);

export Map;
 
//var centerControlDiv = document.createElement('div');
//var centerControl = new CenterControl(centerControlDiv, map);
//
//centerControlDiv.index = 1;
//map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

export default googleMapsLoader(Map, {
  libraries: ["places", "geometry", "drawing"],
  key: 'AIzaSyDFFIwjU-Arp6kRS0MCDVL4d1HvhIz2Jmw',
})
