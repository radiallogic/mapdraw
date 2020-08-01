import { noConflict, FeatureGroup, Point, Polyline, Marker, LayerGroup, DivIcon, DomEvent } from 'leaflet';
import { select } from 'd3-selection';
import { line, curveMonotoneX } from 'd3-shape';

import * as turf from '@turf/turf';
import { CREATE, EDIT, DELETE, APPEND, EDIT_APPEND, NONE, ALL, modeFor } from './helpers/Flags';

// Preventing binding to the `window`.
noConflict();

/**
 * @constant polygons
 * @type {WeakMap}
 */
export const polygons = new WeakMap();

/**
 * @constant defaultOptions
 * @type {Object}
 */
export const defaultOptions = {
    mode: ALL,
    smoothFactor: 0.3,
    elbowDistance: 10,
    simplifyFactor: 1.1,
    mergePolygons: true,
    concavePolygon: true,
    maximumPolygons: Infinity,
    notifyAfterEditExit: false,
    leaveModeAfterCreate: false,
    strokeWidth: 2
};

/**
 * @constant instanceKey
 * @type {Symbol}
 */
export const instanceKey = Symbol('paths/instance');

/**
 * @constant modesKey
 * @type {Symbol}
 */
export const modesKey = Symbol('paths/modes');

/**
 * @constant notifyDeferredKey
 * @type {Symbol}
 */
export const notifyDeferredKey = Symbol('paths/notify-deferred');

/**
 * @constant edgesKey
 * @type {Symbol}
 */
export const edgesKey = Symbol('paths/edges');

/**
 * @constant cancelKey
 * @type {Symbol}
 */
const cancelKey = Symbol('paths/cancel');

export default class Paths extends FeatureGroup {

    /**
     * @constructor
     * @param {Object} [options = {}]
     * @return {void}
     */
    constructor(options = defaultOptions) {
        super();
        this.options = { ...defaultOptions, ...options };
        this.polylines = [];

        this.lineStyle = { strokeColor:'#5e03fc',
        strokeOpacity: 0.5,
        strokeWeight: 2 };

        this.zoom = 6;
    }

    createPolyline = (map, latLngs, options = defaultOptions) => {

        let coords =  latLngs.map( (item, i) => {
            return [ item.lat, item.lng ];
        } );
    
        let geojson = turf.lineString(coords);

        let tolerance = 0.01;
        if(this.zoom < 18 && this.zoom >= 15){
            tolerance = 0;
        }
        if(this.zoom < 15 && this.zoom >= 11){
            tolerance = 0.001;
        }
        if(this.zoom < 11 && this.zoom >= 8){
            tolerance = 0.01;
        }
        if(this.zoom < 8 && this.zoom >= 5){
            tolerance = 0.1;
        } 
        if(this.zoom < 5 && this.zoom >= 3){
            tolerance = 0.5;
        } 
        if(this.zoom < 3 && this.zoom >= 1){
            tolerance = 1;
        } 

        let simplified = turf.simplify(geojson, {tolerance: tolerance, highQuality: false} );

        let polyline = new Polyline(simplified.geometry.coordinates, this.lineStyle); 
        this.createEdges(this.map, polyline); 
        polyline.addTo(this.layerGroup);
    

        this.options.addPath(simplified.geometry.coordinates); 

        //this.polylines.push(polyline);
    
        return polyline;
    };

    // creates the dragable markers on a line
    createEdges = (map, polyline)  => { 

        const markers = polyline.getLatLngs().map(latLng => {
    
            //const mode = map[modesKey];
            const icon = new DivIcon({className: 'line-icon'});
            const marker = new Marker(latLng, { icon }).addTo(this.layerGroup);
    
            // Disable the propagation when you click on the marker.
            DomEvent.disableClickPropagation(marker);
    
            marker.on('dblclick', (e) => {
                console.log('markerclick: ', e);
                e.originalEvent.stopPropagation(); 
                // let coords = e.sourceTarget._latlngs.map( (item, i ) => {
                //     return [item.lat, item.lng ];
                // });


                // remove point fromt coords and create new line. 

                //let newline = {};
                //console.log('markerclick 1: ', newline);

                //this.options.modifyPath(newline); 
            });

            marker.on('mousedown', function mouseDown() {
    
                if (!(map[modesKey] & EDIT)) {
    
                    // polylines can only be created when the mode includes edit.
                    map.off('mousedown', mouseDown);
                    return;
    
                }
    
                // Disable the map dragging as otherwise it's difficult to reposition the edge.
                map.dragging.disable();
    
                /**
                 * @method mouseMove
                 * @param {Object} event
                 * @return {void}
                 */
                const mouseMove = event => {
    
                    // Determine where to move the marker to from the mouse move event.
                    const containerPoint = map.latLngToContainerPoint(event.latlng);
                    const latLng = map.containerPointToLatLng(containerPoint);
    
                    // Update the marker with the new lat/lng.
                    marker.setLatLng(latLng);
    
                    // ...And finally update the polyline to match the current markers.
                    const latLngs = markers.map(marker => marker.getLatLng());
                    polyline.setLatLngs(latLngs);
                    polyline.redraw();
    
                };
    
                // Listen for the mouse move events to determine where to move the marker to.
                map.on('mousemove', mouseMove);
    
                /**
                 * @method mouseUp
                 * @return {void}
                 */
                function mouseUp() {
    
                    if (!(map[modesKey] & CREATE)) {
    
                        // Re-enable the dragging of the map only if created mode is not enabled.
                        map.dragging.enable();
                    }
    
                    // Stop listening to the events.
                    map.off('mouseup', mouseUp);
                    map.off('mousedown', mouseDown);
                    map.off('mousemove', mouseMove);
    
                }
    
                // Cleanup the mouse events when the user releases the mouse button.
                // We need to listen on both map and marker, because if the user moves the edge too quickly then
                // the mouse up will occur on the map layer.
                map.on('mouseup', mouseUp);
                marker.on('mouseup', mouseUp);
    
            });
    
            return marker;
    
        });
    
        return markers;
    
    }
    


    /**
     * @method onAdd
     * @param {Object} map
     * @return {void}
     */
    onAdd = (map) => {

        // Memorise the map instance.
        this.map = map;

        // Attach the cancel function and the instance to the map.
        map[cancelKey] = () => {};
        map[instanceKey] = this;
        map[notifyDeferredKey] = () => {};

        // Set the initial mode.
        modeFor(map, this.options.mode, this.options);

        // Instantiate the SVG layer that sits on top of the map.
        const svg = this.svg = select(map._container).append('svg')
                                 .classed('free-draw', true).attr('width', '100%').attr('height', '100%')
                                 .style('pointer-events', 'none').style('z-index', '1001').style('position', 'relative');

        // Set the mouse events.
        this.listenForEvents(map, svg, this.options);

        this.layerGroup = new LayerGroup; 
        this.layerGroup.addTo(this.map);

    }

    setPaths = (paths) => {        
        this.layerGroup.clearLayers();

        paths.map( path => {        
            let polyline = new Polyline(path, this.lineStyle); 
            
            polyline.on('dblclick', (e) => {
                e.originalEvent.stopPropagation(); 
                let coords = e.sourceTarget._latlngs.map( (item, i ) => {
                    return [item.lat, item.lng ];
                });

                let line = turf.lineString(coords);
                let splitter = turf.point([e.latlng.lat, e.latlng.lng]);
                let split = turf.lineSplit(line, splitter);

                let linePart = split.features[1].geometry.coordinates;
                linePart.pop(); // remove duplicate coordinates;
                let newline = split.features[0].geometry.coordinates.concat( linePart );
                
                console.log('HERE 5: ', newline);

                this.options.modifyPath(newline); 

            });

            this.createEdges(this.map, polyline); 
            polyline.addTo(this.layerGroup);
        }) 

    }

    setVehicle = (vehicle) => {
        this.vehicle = vehicle;

        // setVehicle
        if(this.vehicle.toLowerCase() == 'paraglider'){
            this.lineStyle.strokeColor = '#ff6ec7'; 
        }
        if(this.vehicle.toLowerCase() == 'canoe'){
            this.lineStyle.strokeColor = '08e8de'; 
        }
    } 

    setZoom = (zoom) => {
        this.zoom = zoom;
    }

    /**
     * @method clear
     * @return {void}
     */
    clear() {
        this.layerGroup.clearLayers();
    }

    /**
     * @method setMode
     * @param {Number} [mode = null]
     * @return {Number}
     */
    mode(mode = null) {

        console.log(' here in mode ', mode);

        // Set mode when passed `mode` is numeric, and then yield the current mode.
        typeof mode === 'number' && modeFor(this.map, mode, this.options);
        return this.map[modesKey];
    }

    /**
     * @method cancel
     * @return {void}
     */
    cancel() {
        this.map[cancelKey]();
    }

    /**
     * @method listenForEvents
     * @param {Object} map
     * @param {Object} svg
     * @param {Object} options
     * @return {void}
     */
    listenForEvents(map, svg, options) {

        /**
         * @method mouseDown
         * @param {Object} event
         * @return {void}
         */
        const mouseDown = event => {

            if (!(map[modesKey] & CREATE)) {

                // Polygons can only be created when the mode includes create.
                return;

            }

            /**
             * @constant latLngs
             * @type {Set}
             */
            const latLngs = new Set();

            // Create the line iterator and move it to its first `yield` point, passing in the start point
            // from the mouse down event.
            const lineIterator = this.createPath(svg, map.latLngToContainerPoint(event.latlng), options.strokeWidth);

            /**
             * @method mouseMove
             * @param {Object} event
             * @return {void}
             */
            const mouseMove = event => {

                // Resolve the pixel point to the latitudinal and longitudinal equivalent.
                const point = map.mouseEventToContainerPoint(event.originalEvent);

                // Push each lat/lng value into the points set.
                latLngs.add(map.containerPointToLatLng(point));

                // Invoke the generator by passing in the starting point for the path.
                lineIterator(new Point(point.x, point.y));

            };

            // Create the path when the user moves their cursor.
            map.on('mousemove touchmove', mouseMove);

            /**
             * @method mouseUp
             * @param {Boolean} [create = true]
             * @return {Function}
             */
            const mouseUp = (_, create = true) => {

                // Remove the ability to invoke `cancel`.
                map[cancelKey] = () => {};

                // Stop listening to the events.
                map.off('mouseup', mouseUp);
                map.off('mousemove', mouseMove);
                'body' in document && document.body.removeEventListener('mouseleave', mouseUp);

                // Clear the SVG canvas.
                svg.selectAll('*').remove();

                if (create) {

                    // ...And finally if we have any lat/lngs in our set then we can attempt to
                    // create the polygon.
                    latLngs.size && this.createPolyline(map, Array.from(latLngs), options);

                    // Finally invoke the callback for the polygon regions.
                    //updateFor(map, 'create');

                    // Exit the `CREATE` mode if the options permit it.
                    options.leaveModeAfterCreate && this.mode(this.mode() ^ CREATE);

                }

            };

            // Clear up the events when the user releases the mouse.
            map.on('mouseup touchend', mouseUp);
            'body' in document && document.body.addEventListener('mouseleave', mouseUp);

            // Setup the function to invoke when `cancel` has been invoked.
            map[cancelKey] = () => mouseUp({}, false);

        };

        map.on('mousedown touchstart', mouseDown);

    }

    /**
     * @method createPath
     * @param {Object} svg
     * @param {Point} fromPoint
     * @param {Number} strokeWidth
     * @return {void}
     */
    createPath(svg, fromPoint, strokeWidth) {
        let lastPoint = fromPoint;

        const lineFunction = line().curve(curveMonotoneX).x(d => d.x).y(d => d.y);

        return toPoint => {
            const lineData = [ lastPoint, toPoint ];
            lastPoint = toPoint;
            // Draw SVG line based on the last movement of the mouse's position.
            svg.append('path').classed('leaflet-line', true)
                .attr('d', lineFunction(lineData)).attr('fill', 'none')
                .attr('stroke', 'black').attr('stroke-width', strokeWidth);
        };
    }

}

// /**
//  * @method paths
//  * @return {Object}
//  */
// export const paths = options => {
//     return new paths(options);
// };

export { CREATE, EDIT, DELETE, APPEND, EDIT_APPEND, NONE, ALL } from './helpers/Flags';
