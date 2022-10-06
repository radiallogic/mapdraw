"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawMouseEvents = void 0;
const react_leaflet_1 = require("react-leaflet");
const Constants_1 = require("../Constants");
let draw = false;
const DrawMouseEvents = (props) => {
    const map = (0, react_leaflet_1.useMapEvents)({
        mousemove(e) {
            //console.log("draw: " + draw);
            if (draw) {
                const point = map.mouseEventToContainerPoint(e.originalEvent);
                //console.log( 'mouse move: ' + map.containerPointToLatLng(point) ); 
                props.drawline(map.containerPointToLatLng(point));
            }
            if (props.mode == Constants_1.MOVE || props.mode == Constants_1.DELETE || props.mode == Constants_1.EDIT) {
                map.dragging.enable();
            }
        },
        mouseup(e) {
            e.originalEvent.preventDefault();
            // map.dragging.enable();
            console.log('mouse up');
            if (props.mode == Constants_1.ADD) {
                props.saveline();
            }
            draw = false;
            props.setMode(Constants_1.EDIT);
        },
        mousedown(e) {
            e.originalEvent.preventDefault();
            if (props.mode == Constants_1.ADD) {
                draw = true;
                map.dragging.disable();
            }
            console.log('mouse down');
        },
    });
    return null;
};
exports.DrawMouseEvents = DrawMouseEvents;
//# sourceMappingURL=DrawMouseEvents.js.map