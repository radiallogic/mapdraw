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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElbowLine = void 0;
const leaflet_1 = require("leaflet");
const react_1 = __importDefault(require("react"));
const react_leaflet_1 = require("react-leaflet");
const ElbowMarker_1 = require("./ElbowMarker");
const turf = __importStar(require("@turf/turf"));
const _ = __importStar(require("lodash"));
const blueOptions = { color: 'blue' };
const ElbowLine = (props) => {
    const coords = props.positions;
    const addElbow = (e) => {
        let positions = coords.map(coord => {
            return [coord.lng, coord.lat];
        });
        const line = turf.lineString(positions);
        const splitter = turf.point([e.latlng.lng, e.latlng.lat]);
        const split = turf.lineSplit(line, splitter);
        let linePart = split.features[1].geometry.coordinates; // only works with middle bits
        let bit = linePart.pop(); // remove duplicate coordinates;
        let newline = split.features[0].geometry.coordinates.concat(linePart);
        let tmp = newline.map(bit => {
            return (0, leaflet_1.latLng)(bit[1], bit[0]);
        });
        props.setpaths(tmp, props.index);
    };
    const updateLine = (position, latLng) => {
        console.log('update line');
        // swap old and new marker position
        let tmp = coords.map(coord => {
            console.log(coord, position);
            if (_.isEqual(coord, position)) {
                return latLng;
            }
            else {
                return coord;
            }
        });
        props.setpaths(tmp, props.index);
    };
    const removeElbow = (e) => {
        //console.log('remove elbow', coords)
        let latlng = (0, leaflet_1.latLng)(e.latlng.lat, e.latlng.lng);
        let tmp = coords.map(coord => {
            if (_.isEqual(coord, latlng)) {
                console.log('remove elbow at: ', latlng);
            }
            else {
                return coord;
            }
        });
        tmp = _.compact(tmp);
        props.setpaths(tmp, props.index);
    };
    let markers = coords.map((latLng, i) => {
        return <ElbowMarker_1.ElbowMarker position={latLng} updateLine={updateLine} removeElbow={removeElbow} key={i}></ElbowMarker_1.ElbowMarker>;
    });
    return <> 
            {markers}
            <react_leaflet_1.Polyline eventHandlers={{
            dblclick: (e) => {
                e.originalEvent.preventDefault();
                console.log('line dbl click');
                addElbow(e);
            }
        }} bubblingMouseEvents={false} pathOptions={blueOptions} positions={props.positions}>
            </react_leaflet_1.Polyline>
        </>;
};
exports.ElbowLine = ElbowLine;
//# sourceMappingURL=ElbowLine.js.map