import LeafletPaths from './Paths'; 
import { MapLayer, withLeaflet } from 'react-leaflet';


class Paths extends MapLayer {
  createLeafletElement(props) {
    return new LeafletPaths({ ...props });
  }

  updateLeafletElement(fromProps, toProps) {
    if(fromProps.mode != toProps.mode){
      this.leafletElement.mode(toProps.mode);
    }

    if(fromProps.paths != toProps.paths && toProps.paths != undefined){
      console.log('paths changed')
      this.leafletElement.setPaths(toProps.paths);
    }
  }

  componentDidMount() {
    const { map } = this.props.leaflet;
    map.addLayer(this.leafletElement);

    console.log( 'map in react-leaflet-paths' , map);
    this.attachEvents();
  }

  attachEvents() {
    this.leafletElement.on('markers', this.props.onMarkers);
    this.leafletElement.on('mode', this.props.onModeChange);
  }

  render() {
    return null;
  }
}

export {ALL, NONE, DELETE} from './Paths';
export default withLeaflet(Paths);