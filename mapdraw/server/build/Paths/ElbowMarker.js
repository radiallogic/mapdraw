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
exports.ElbowMarker = void 0;
const React = __importStar(require("react"));
const react_leaflet_1 = require("react-leaflet");
const leaflet_1 = require("leaflet");
const ElbowMarker = (props) => {
    const icon = new leaflet_1.DivIcon({ className: 'line-icon' });
    return <react_leaflet_1.Marker draggable={true} eventHandlers={{
            dblclick: (e) => {
                // //e.originalEvent.preventDefault();
                // DomEvent.stopPropagation(e);
                leaflet_1.DomEvent.stopPropagation(e.originalEvent);
                console.log('dbl click marker');
                props.removeElbow(e);
            },
            drag: (event) => {
                // DomEvent.stopPropagation(event);
                console.log('marker drag event ', event);
                props.updateLine(props.position, event.target._latlng);
            },
            dragend: (event) => {
                //console.log(event);
            }
        }} zIndexOffset={10} position={props.position} icon={icon} bubblingMouseEvents={false}>
        </react_leaflet_1.Marker>;
};
exports.ElbowMarker = ElbowMarker;
//# sourceMappingURL=ElbowMarker.js.map