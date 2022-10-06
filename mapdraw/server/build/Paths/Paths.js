"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const turf = __importStar(require("@turf/turf"));
const leaflet_1 = require("leaflet");
const react_leaflet_1 = require("react-leaflet");
const DrawMouseEvents_1 = require("./DrawMouseEvents");
const ElbowLine_1 = require("./ElbowLine");
const EMPTY = [[0, 0],];
const bounds = new leaflet_1.LatLngBounds((0, leaflet_1.latLng)(51.3, -0.10), (0, leaflet_1.latLng)(51.5, -0.06));
const blackOptions = { color: 'black' };
class Paths extends React.Component {
    zoom;
    paths;
    constructor(props) {
        super(props);
        this.state = {
            paths: [],
            latLngs: EMPTY
        };
    }
    ;
    createPolyline = (latLngs) => {
        if (latLngs.length < 2) {
            return;
        }
        let c = latLngs.map((item, i) => {
            return [item.lat, item.lng];
        });
        let geojson = turf.lineString(c);
        let tolerance = 0.01;
        if (this.zoom < 18 && this.zoom >= 15) {
            tolerance = 0;
        }
        if (this.zoom < 15 && this.zoom >= 11) {
            tolerance = 0.001;
        }
        if (this.zoom < 11 && this.zoom >= 8) {
            tolerance = 0.01;
        }
        if (this.zoom < 8 && this.zoom >= 5) {
            tolerance = 0.1;
        }
        if (this.zoom < 5 && this.zoom >= 3) {
            tolerance = 0.5;
        }
        if (this.zoom < 3 && this.zoom >= 1) {
            tolerance = 1;
        }
        let simplified = turf.simplify(geojson, { tolerance: tolerance, highQuality: false });
        let paths = this.state.paths;
        let latlngs = simplified.geometry.coordinates.map(c => {
            return (0, leaflet_1.latLng)(c[0], c[1]);
        });
        paths.push(latlngs);
        this.setState({ paths: paths });
    };
    drawline = (point) => {
        let ll = [];
        if (this.state.latLngs != EMPTY) {
            ll = this.state.latLngs;
        }
        ll.push(point);
        this.setState({ latLngs: ll });
    };
    savePolyline = () => {
        console.log("savePolyline");
        this.createPolyline(this.state.latLngs);
        this.setState({ latLngs: EMPTY });
    };
    setpaths = (path, index) => {
        let paths = this.state.paths;
        //console.log(paths, path, index);
        paths[index] = path;
        this.setState({ paths: paths });
    };
    render() {
        let paths = this.state.paths.map((path, i) => {
            //console.log( JSON.stringify(path) );
            return <ElbowLine_1.ElbowLine positions={path} key={i} index={i} setpaths={this.setpaths}></ElbowLine_1.ElbowLine>;
        });
        return (<>
                <DrawMouseEvents_1.DrawMouseEvents drawline={this.drawline} saveline={this.savePolyline} mode={this.props.mode} setMode={this.props.setMode}/>
                <react_leaflet_1.Polyline pathOptions={blackOptions} positions={this.state.latLngs} key={this.state.latLngs}>

                </react_leaflet_1.Polyline>
                {paths}
            </>);
    }
}
exports.default = Paths;
//# sourceMappingURL=Paths.js.map