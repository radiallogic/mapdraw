// import 'core-js';
// import 'regenerator-runtime/runtime';

import { noConflict, FeatureGroup, Point, Polyline, Marker } from 'leaflet';
import { select } from 'd3-selection';
import { line, curveMonotoneX } from 'd3-shape';

import * as turf from '@turf/turf';
import { CREATE, EDIT, DELETE, APPEND, EDIT_APPEND, NONE, ALL, modeFor } from './helpers/Flags';
import createEdges from './helpers/Edges';

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
    }

    createPolyline = (map, latLngs, options = defaultOptions) => {

        let coords =  latLngs.map( (item, i) => {
            return [ item.lat, item.lng ];
        } );
    
        let geojson = turf.lineString(coords);
        let simplified = turf.simplify(geojson, {tolerance: 0.01, highQuality: false} );
    
        // console.log('simplified: ', simplified); 

        let polyline = new Polyline(simplified.geometry.coordinates); 
        createEdges(map, polyline, options); 
        polyline.addTo(map);
    
        this.polylines.push(polyline);
    
        return polyline;
    };

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

        // Setup the dependency injection for simplifying the polygon.
        //map.simplifyPolygon = simplifyPolygon;

        // Add the item to the map.
        //polygons.set(map, new Set());

        // Set the initial mode.
        modeFor(map, this.options.mode, this.options);

        // Instantiate the SVG layer that sits on top of the map.
        const svg = this.svg = select(map._container).append('svg')
                                 .classed('free-draw', true).attr('width', '100%').attr('height', '100%')
                                 .style('pointer-events', 'none').style('z-index', '1001').style('position', 'relative');

        // Set the mouse events.
        this.listenForEvents(map, svg, this.options);

    }

    // /**
    //  * @method onRemove
    //  * @param {Object} map
    //  * @return {void}
    //  */
    // onRemove = (map) => {

    //     // Remove the item from the map.
    //     polygons.delete(map);

    //     // Remove the SVG layer.
    //     this.svg.remove();

    //     // Remove the appendages from the map container.
    //     delete map[cancelKey];
    //     delete map[instanceKey];
    //     // delete map.simplifyPolygon;

    // }

    /**
     * @method create
     * @param {LatLng[]} latLngs
     * @param {Object} [options = { concavePolygon: false }]
     * @return {Object}
     */
    create = (latLngs, options = { concavePolygon: false })  => {
        const created = createPolyline(this.map, latLngs, { ...this.options, ...options });
        //updateFor(this.map, 'create');
        return created;
    }

    /**
     * @method remove
     * @param {Object} polygon
     * @return {void}
     */
    remove(polygon) {
        polygon ? removeFor(this.map, polygon) : super.remove();
        //updateFor(this.map, 'remove');
    }

    removeFor = () => {
        map.removeLayer(polygon);
        edgesKey in polygon && polygon[edgesKey].map(edge => map.removeLayer(edge));

        // Remove polygon from the master set.
        polygons.get(map).delete(polygon);
    }

    setPaths = () => {
        // clear all map layers 

        // set paths 

        // update map draw. 
    }

    /**
     * @method clear
     * @return {void}
     */
    clear() {
        clearFor(this.map);
        //updateFor(this.map, 'clear');
    }

    /**
     * @method setMode
     * @param {Number} [mode = null]
     * @return {Number}
     */
    mode(mode = null) {

        console.log(' here in mode  ');

        // Set mode when passed `mode` is numeric, and then yield the current mode.
        typeof mode === 'number' && modeFor(this.map, mode, this.options);
        return this.map[modesKey];
    }

    // /**
    //  * @method size
    //  * @return {Number}
    //  */
    // size() {
    //     return polygons.get(this.map).size;
    // }

    // /**
    //  * @method all
    //  * @return {Array}
    //  */
    // all() {
    //     return Array.from(polygons.get(this.map));
    // }

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

// if (typeof window !== 'undefined') {

//     // Attach to the `window` as `paths` if it exists, as this would prevent `new paths.default` when
//     // using the web version.
//     window.paths = paths;
//     paths.CREATE = CREATE;
//     paths.EDIT = EDIT;
//     paths.DELETE = DELETE;
//     paths.APPEND = APPEND;
//     paths.EDIT_APPEND = EDIT_APPEND;
//     paths.NONE = NONE;
//     paths.ALL = ALL;

// }
